import { useEffect, useRef, useState } from "react";
import { renderAsync } from "docx-preview";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { FileText } from "lucide-react";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

type DocumentPreviewProps = {
  blob: Blob;
  fileTypeLabel: string;
  title: string;
};

// Chọn component preview phù hợp theo loại file: PDF, TXT hoặc DOCX.
function DocumentPreview({ blob, fileTypeLabel, title }: DocumentPreviewProps) {
  if (fileTypeLabel === "PDF") {
    return <PdfPreview blob={blob} title={title} />;
  }

  if (fileTypeLabel === "TXT") {
    return <TextPreview blob={blob} />;
  }

  if (fileTypeLabel === "DOCX") {
    return <DocxPreview blob={blob} title={title} />;
  }

  return (
    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
      <FileText className="h-16 w-16 text-muted-foreground" />
      <h2 className="mt-4 text-xl font-bold text-card-foreground">
        Preview is not available
      </h2>
      <p className="mt-2 max-w-md text-muted-foreground">
        This file type cannot be previewed directly in the browser.
      </p>
    </div>
  );
}

// Render PDF trực tiếp trong web bằng pdfjs, không cần mở bên thứ ba.
function PdfPreview({ blob, title }: { blob: Blob; title: string }) {
  const previewRef = useRef<HTMLDivElement>(null);
  const [isRendering, setIsRendering] = useState(true);
  const [renderError, setRenderError] = useState(false);

  useEffect(() => {
    const previewElement = previewRef.current;

    if (!previewElement) return;

    let isMounted = true;
    previewElement.innerHTML = "";
    setIsRendering(true);
    setRenderError(false);

    const renderPdf = async () => {
      const arrayBuffer = await blob.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const availableWidth = previewElement.clientWidth || 900;

      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
        if (!isMounted) return;

        const page = await pdf.getPage(pageNumber);
        const defaultViewport = page.getViewport({ scale: 1 });
        const scale = availableWidth / defaultViewport.width;
        const viewport = page.getViewport({ scale });
        const outputScale = window.devicePixelRatio || 1;
        const canvas = window.document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (!context) return;

        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);
        canvas.style.width = "100%";
        canvas.style.height = `${viewport.height}px`;
        canvas.className = "block bg-white";

        const pageContainer = window.document.createElement("div");
        pageContainer.className = "w-full bg-white";
        pageContainer.appendChild(canvas);
        previewElement.appendChild(pageContainer);

        await page.render({
          canvas,
          canvasContext: context,
          viewport,
          transform:
            outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : undefined,
        }).promise;
      }
    };

    renderPdf()
      .catch(() => {
        if (isMounted) {
          setRenderError(true);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsRendering(false);
        }
      });

    return () => {
      isMounted = false;
      previewElement.innerHTML = "";
    };
  }, [blob]);

  if (renderError) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-6 text-center">
        <FileText className="h-16 w-16 text-muted-foreground" />
        <h2 className="mt-4 text-xl font-bold text-card-foreground">
          Cannot preview this PDF
        </h2>
        <p className="mt-2 max-w-md text-muted-foreground">
          The PDF content could not be rendered in the browser.
        </p>
      </div>
    );
  }

  return (
    <div
      aria-label={`Preview of ${title}`}
      className="relative h-full overflow-auto bg-white p-6"
    >
      {isRendering ? (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 px-6 text-center">
          <p className="text-sm font-semibold text-muted-foreground">
            Rendering PDF preview...
          </p>
        </div>
      ) : null}

      <div ref={previewRef} className="mx-auto w-fit min-w-[760px]" />
    </div>
  );
}

// Đọc nội dung file TXT từ Blob và hiển thị dưới dạng text trong trang.
function TextPreview({ blob }: { blob: Blob }) {
  const [textContent, setTextContent] = useState("");
  const [isLoadingText, setIsLoadingText] = useState(true);

  useEffect(() => {
    let isMounted = true;

    setIsLoadingText(true);
    blob
      .text()
      .then((text) => {
        if (isMounted) {
          setTextContent(text);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingText(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [blob]);

  if (isLoadingText) {
    return (
      <div className="flex h-full items-center justify-center px-6 text-center">
        <p className="text-sm font-semibold text-muted-foreground">
          Loading text preview...
        </p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto bg-white p-8">
      <pre className="whitespace-pre-wrap break-words font-mono text-sm leading-7 text-slate-800">
        {textContent || "This text file is empty."}
      </pre>
    </div>
  );
}

// Render file DOCX thành HTML bằng thư viện docx-preview để xem ngay trong web.
function DocxPreview({ blob, title }: { blob: Blob; title: string }) {
  const previewRef = useRef<HTMLDivElement>(null);
  const [isRendering, setIsRendering] = useState(true);
  const [renderError, setRenderError] = useState(false);

  useEffect(() => {
    const previewElement = previewRef.current;

    if (!previewElement) return;

    let isMounted = true;
    previewElement.innerHTML = "";
    setIsRendering(true);
    setRenderError(false);

    renderAsync(blob, previewElement, undefined, {
      breakPages: true,
      className: "docx-preview",
      ignoreFonts: false,
      ignoreHeight: false,
      ignoreWidth: false,
      inWrapper: true,
      renderFooters: true,
      renderHeaders: true,
    })
      .catch(() => {
        if (isMounted) {
          setRenderError(true);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsRendering(false);
        }
      });

    return () => {
      isMounted = false;
      previewElement.innerHTML = "";
    };
  }, [blob]);

  if (renderError) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-6 text-center">
        <FileText className="h-16 w-16 text-muted-foreground" />
        <h2 className="mt-4 text-xl font-bold text-card-foreground">
          Cannot preview this document
        </h2>
        <p className="mt-2 max-w-md text-muted-foreground">
          The document content could not be rendered in the browser.
        </p>
      </div>
    );
  }

  return (
    <div
      aria-label={`Preview of ${title}`}
      className="relative h-full overflow-auto bg-white"
    >
      {isRendering ? (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 px-6 text-center">
          <p className="text-sm font-semibold text-muted-foreground">
            Rendering document preview...
          </p>
        </div>
      ) : null}

      <div ref={previewRef} className="w-full bg-white" />
    </div>
  );
}

export default DocumentPreview;
