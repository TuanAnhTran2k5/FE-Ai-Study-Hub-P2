import { useEffect, useRef, useState } from "react";
import { renderAsync } from "docx-preview";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { FileText, Minus, Plus } from "lucide-react";

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

function getElementTopInsideContainer(
  element: HTMLElement,
  container: HTMLElement,
) {
  return (
    element.getBoundingClientRect().top -
    container.getBoundingClientRect().top +
    container.scrollTop
  );
}

// Render PDF trực tiếp trong web bằng pdfjs, không cần mở bên thứ ba.
function PdfPreview({ blob, title }: { blob: Blob; title: string }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<HTMLDivElement[]>([]);

  const [isRendering, setIsRendering] = useState(true);
  const [renderError, setRenderError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const previewElement = previewRef.current;

    if (!previewElement) return;

    let isMounted = true;

    previewElement.innerHTML = "";
    pageRefs.current = [];
    setIsRendering(true);
    setRenderError(false);
    setCurrentPage(1);
    setTotalPages(0);

    const renderPdf = async () => {
      const arrayBuffer = await blob.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      if (!isMounted) return;

      setTotalPages(pdf.numPages || 1);
      setCurrentPage(1);

      const availableWidth =
        scrollContainerRef.current?.clientWidth ||
        previewElement.clientWidth ||
        900;

      const pageMaxWidth = Math.max(760, availableWidth - 96);

      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
        if (!isMounted) return;

        const page = await pdf.getPage(pageNumber);
        const defaultViewport = page.getViewport({
          scale: 1,
        });

        const fitScale = pageMaxWidth / defaultViewport.width;
        const scale = fitScale * zoom;
        const viewport = page.getViewport({
          scale,
        });

        const outputScale = window.devicePixelRatio || 1;
        const canvas = window.document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (!context) return;

        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);
        canvas.style.width = `${viewport.width}px`;
        canvas.style.height = `${viewport.height}px`;
        canvas.className = "block bg-white shadow-sm";

        const pageContainer = window.document.createElement("div");
        pageContainer.className = "flex justify-center bg-slate-100 py-4";
        pageContainer.appendChild(canvas);

        pageRefs.current[pageNumber - 1] = pageContainer;
        previewElement.appendChild(pageContainer);

        await page.render({
          canvas,
          canvasContext: context,
          viewport,
          transform:
            outputScale !== 1
              ? [outputScale, 0, 0, outputScale, 0, 0]
              : undefined,
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
  }, [blob, zoom]);

  const goToPage = (pageNumber: number) => {
    const safePage = Math.min(Math.max(pageNumber, 1), totalPages || 1);
    setCurrentPage(safePage);

    const pageElement = pageRefs.current[safePage - 1];
    const container = scrollContainerRef.current;

    if (!pageElement || !container) return;

    const toolbarHeight = 56;
    const pageTop = getElementTopInsideContainer(pageElement, container);

    container.scrollTo({
      top: Math.max(0, pageTop - toolbarHeight),
      behavior: "smooth",
    });
  };

  const handleScroll = () => {
    const container = scrollContainerRef.current;

    if (!container || pageRefs.current.length === 0) return;

    const toolbarHeight = 56;
    const checkPoint = container.scrollTop + toolbarHeight + 120;

    let nextPage = 1;

    pageRefs.current.forEach((pageElement, index) => {
      const pageTop = getElementTopInsideContainer(pageElement, container);

      if (pageTop <= checkPoint) {
        nextPage = index + 1;
      }
    });

    setCurrentPage((prevPage) => {
      return prevPage === nextPage ? prevPage : nextPage;
    });
  };

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
      className="h-full overflow-hidden bg-white"
    >
      <div
        ref={scrollContainerRef}
        className="relative h-full overflow-auto bg-slate-100"
        onScroll={handleScroll}
      >
        {/* PDF TOOLBAR */}
        <div className="sticky top-0 z-20 flex h-12 items-center justify-between border-b border-border bg-white px-5 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-card-foreground">Page</span>

            <input
              type="number"
              min={1}
              max={totalPages || 1}
              value={currentPage}
              className="h-9 w-16 rounded-lg border border-border bg-background text-center text-sm font-bold outline-none focus:ring-2 focus:ring-ring"
              onChange={(event) => {
                const value = Number(event.target.value);

                if (Number.isFinite(value)) {
                  goToPage(value);
                }
              }}
            />

            <span className="text-sm font-bold text-card-foreground">
              / {totalPages || "-"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-lg p-2 text-card-foreground hover:bg-secondary"
              onClick={() => setZoom((value) => Math.max(0.5, value - 0.1))}
              aria-label="Zoom out"
            >
              <Minus className="h-5 w-5" />
            </button>

            <button
              type="button"
              className="rounded-xl px-4 py-2 text-sm font-bold text-card-foreground hover:bg-secondary"
              onClick={() => setZoom(1)}
            >
              {Math.round(zoom * 100)}%
            </button>

            <button
              type="button"
              className="rounded-lg p-2 text-card-foreground hover:bg-secondary"
              onClick={() => setZoom((value) => Math.min(2, value + 0.1))}
              aria-label="Zoom in"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>

        {isRendering ? (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 px-6 text-center">
            <p className="text-sm font-semibold text-muted-foreground">
              Rendering PDF preview...
            </p>
          </div>
        ) : null}

        <div ref={previewRef} className="mx-auto w-fit" />
      </div>
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<HTMLElement[]>([]);

  const [isRendering, setIsRendering] = useState(true);
  const [renderError, setRenderError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const previewElement = previewRef.current;

    if (!previewElement) return;

    let isMounted = true;

    previewElement.innerHTML = "";
    pageRefs.current = [];
    setIsRendering(true);
    setRenderError(false);
    setCurrentPage(1);
    setTotalPages(0);

    renderAsync(blob, previewElement, undefined, {
      breakPages: true,
      className: "docx-preview",
      ignoreFonts: false,
      ignoreHeight: false,
      ignoreWidth: false,

      // Tắt wrapper mặc định để bỏ nền xám của docx-preview.
      inWrapper: false,

      renderFooters: true,
      renderHeaders: true,
    })
      .then(() => {
        if (!isMounted) return;

        const pages = previewElement.querySelectorAll(
          "section.docx",
        ) as NodeListOf<HTMLElement>;

        pageRefs.current = Array.from(pages);
        setTotalPages(pages.length || 1);
        setCurrentPage(1);

        pages.forEach((page) => {
          page.style.background = "#ffffff";
          page.style.boxShadow = "0 12px 32px rgba(15, 23, 42, 0.14)";
          page.style.margin = "0 auto 28px auto";
          page.style.display = "block";
          page.style.borderRadius = "6px";
          page.style.overflow = "hidden";
        });
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

  const goToPage = (pageNumber: number) => {
    const safePage = Math.min(Math.max(pageNumber, 1), totalPages || 1);
    setCurrentPage(safePage);

    const pageElement = pageRefs.current[safePage - 1];
    const container = scrollContainerRef.current;

    if (!pageElement || !container) return;

    const toolbarHeight = 56;
    const pageTop = getElementTopInsideContainer(pageElement, container);

    container.scrollTo({
      top: Math.max(0, pageTop - toolbarHeight),
      behavior: "smooth",
    });
  };

  const handleScroll = () => {
    const container = scrollContainerRef.current;

    if (!container || pageRefs.current.length === 0) return;

    const toolbarHeight = 56;
    const checkPoint = container.scrollTop + toolbarHeight + 120;

    let nextPage = 1;

    pageRefs.current.forEach((pageElement, index) => {
      const pageTop = getElementTopInsideContainer(pageElement, container);

      if (pageTop <= checkPoint) {
        nextPage = index + 1;
      }
    });

    setCurrentPage((prevPage) => {
      return prevPage === nextPage ? prevPage : nextPage;
    });
  };

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
      className="h-full overflow-hidden bg-white"
    >
      <div
  ref={scrollContainerRef}
  className="relative h-full overflow-auto bg-slate-100"
  onScroll={handleScroll}
>
        {/* DOCX TOOLBAR */}
        <div className="sticky top-0 z-20 flex h-12 items-center justify-between border-b border-border bg-white px-5 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-card-foreground">Page</span>

            <input
              type="number"
              min={1}
              max={totalPages || 1}
              value={currentPage}
              className="h-9 w-16 rounded-lg border border-border bg-background text-center text-sm font-bold outline-none focus:ring-2 focus:ring-ring"
              onChange={(event) => {
                const value = Number(event.target.value);

                if (Number.isFinite(value)) {
                  goToPage(value);
                }
              }}
            />

            <span className="text-sm font-bold text-card-foreground">
              / {totalPages || "-"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-lg p-2 text-card-foreground hover:bg-secondary"
              onClick={() => setZoom((value) => Math.max(0.6, value - 0.1))}
              aria-label="Zoom out"
            >
              <Minus className="h-5 w-5" />
            </button>

            <button
              type="button"
              className="rounded-xl px-4 py-2 text-sm font-bold text-card-foreground hover:bg-secondary"
              onClick={() => setZoom(1)}
            >
              {Math.round(zoom * 100)}%
            </button>

            <button
              type="button"
              className="rounded-lg p-2 text-card-foreground hover:bg-secondary"
              onClick={() => setZoom((value) => Math.min(1.8, value + 0.1))}
              aria-label="Zoom in"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>

        {isRendering ? (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 px-6 text-center">
            <p className="text-sm font-semibold text-muted-foreground">
              Rendering document preview...
            </p>
          </div>
        ) : null}

        <div className="flex min-h-full justify-center bg-slate-100 px-6 py-6">
          <div
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: "top center",
            }}
          >
            <div ref={previewRef} className="w-fit max-w-full bg-white" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DocumentPreview;