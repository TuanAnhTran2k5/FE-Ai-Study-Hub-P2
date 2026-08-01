import { useEffect, useRef, useState } from "react";
import { renderAsync } from "docx-preview";
import * as pdfjsLib from "pdfjs-dist";
import * as XLSX from "xlsx";
import { FileText, Minus, Plus, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

type DocumentPreviewProps = {
  blob: Blob;
  fileTypeLabel: string;
  title: string;
  fileUrl?: string;
};

function PptxPreview({
  blob,
  fileUrl,
  title,
}: {
  blob: Blob;
  fileUrl?: string;
  title: string;
}) {
  const isPublicFileUrl =
    fileUrl &&
    fileUrl.startsWith("http") &&
    !fileUrl.includes("localhost") &&
    !fileUrl.includes("127.0.0.1") &&
    !fileUrl.includes("192.168.") &&
    !fileUrl.includes("10.");

  const handleDownloadFallback = () => {
    const downloadUrl = URL.createObjectURL(blob);
    const link = window.document.createElement("a");
    link.href = downloadUrl;
    link.download = title;
    link.click();
    URL.revokeObjectURL(downloadUrl);
  };

  if (isPublicFileUrl) {
    const encodedUrl = encodeURIComponent(fileUrl);
    const iframeUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodedUrl}`;

    return (
      <div className="h-full w-full border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <iframe
          src={iframeUrl}
          className="h-full w-full border-0"
          title={`Preview of ${title}`}
          allowFullScreen
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-pointer-lock allow-presentation allow-downloads"
        />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col items-center justify-center p-8 text-center bg-slate-50/50 border border-slate-200 rounded-2xl">
      <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-950/20 text-orange-600 ring-8 ring-orange-50 dark:ring-orange-950/10 mb-6">
        <FileText className="h-7 w-7" />
      </div>
      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
        Tính năng xem trước PowerPoint
      </h2>
      <p className="mt-2 max-w-md text-sm text-slate-500 leading-relaxed font-semibold">
        Khi deploy ứng dụng lên server thực tế, file PowerPoint sẽ được lưu trữ trực tuyến và hiển thị trực tiếp tại đây thông qua **Microsoft Office Online Viewer**.
      </p>
      <p className="mt-1 max-w-md text-xs text-slate-400 font-semibold italic">
        (Do đang chạy ở môi trường Local / URL chưa công khai, Microsoft không thể truy cập trực tiếp file này).
      </p>
      <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
        <button
          type="button"
          onClick={handleDownloadFallback}
          className="h-10 px-6 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-black shadow-lg shadow-orange-600/10 cursor-pointer transition-colors"
        >
          Tải xuống để xem trên thiết bị
        </button>
      </div>
    </div>
  );
}

function DocumentPreview({ blob, fileTypeLabel, title, fileUrl }: DocumentPreviewProps) {
  if (fileTypeLabel === "PDF") {
    return <PdfPreview blob={blob} title={title} />;
  }

  if (fileTypeLabel === "TXT") {
    return <TextPreview blob={blob} />;
  }

  if (fileTypeLabel === "DOCX") {
    return <DocxPreview blob={blob} title={title} />;
  }

  if (fileTypeLabel === "XLS" || fileTypeLabel === "XLSX") {
    return <ExcelPreview blob={blob} title={title} />;
  }

  if (fileTypeLabel === "PPTX") {
    return <PptxPreview blob={blob} fileUrl={fileUrl} title={title} />;
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

type PreviewToolbarProps = {
  currentPage: number;
  totalPages: number;
  zoom: number;
  onPageChange: (pageNumber: number) => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  onZoomIn: () => void;
};

function PreviewToolbar({
  currentPage,
  totalPages,
  zoom,
  onPageChange,
  onZoomOut,
  onZoomReset,
  onZoomIn,
}: PreviewToolbarProps) {
  return (
    <div className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-5 text-slate-900 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-slate-700">Page</span>

        <input
          type="number"
          min={1}
          max={totalPages || 1}
          value={currentPage}
          onChange={(event) => {
            const value = Number(event.target.value);

            if (Number.isFinite(value)) {
              onPageChange(value);
            }
          }}
          className="h-9 w-16 rounded-xl border border-slate-300 bg-slate-900 px-2 text-center text-sm font-bold text-white outline-none focus:ring-2 focus:ring-slate-400"
        />

        <span className="text-sm font-bold text-slate-700">
          / {totalPages || "-"}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
          onClick={onZoomOut}
          aria-label="Zoom out"
        >
          <Minus className="h-4 w-4" />
        </button>

        <button
          type="button"
          className="h-9 min-w-16 rounded-xl border border-slate-300 bg-white px-3 text-sm font-bold text-slate-700 hover:bg-slate-100"
          onClick={onZoomReset}
        >
          {Math.round(zoom * 100)}%
        </button>

        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
          onClick={onZoomIn}
          aria-label="Zoom in"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

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
    return <NativePdfPreview blob={blob} title={title} />;
  }

  return (
    <div
      aria-label={`Preview of ${title}`}
      className="h-full overflow-hidden bg-white"
    >
      <div
        ref={scrollContainerRef}
        className="relative h-full overflow-auto bg-slate-100 scrollbar-document"
        onScroll={handleScroll}
      >
        <PreviewToolbar
          currentPage={currentPage}
          totalPages={totalPages}
          zoom={zoom}
          onPageChange={goToPage}
          onZoomOut={() => setZoom((value) => Math.max(0.5, value - 0.1))}
          onZoomReset={() => setZoom(1)}
          onZoomIn={() => setZoom((value) => Math.min(2, value + 0.1))}
        />

        {isRendering ? (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 px-6 text-center">
            <p className="text-sm font-semibold text-slate-700">
              Rendering PDF preview...
            </p>
          </div>
        ) : null}

        <div ref={previewRef} className="mx-auto w-fit" />
      </div>
    </div>
  );
}

function NativePdfPreview({ blob, title }: { blob: Blob; title: string }) {
  const [pdfUrl, setPdfUrl] = useState("");

  useEffect(() => {
    const objectUrl = URL.createObjectURL(
      blob.type === "application/pdf"
        ? blob
        : new Blob([blob], { type: "application/pdf" }),
    );

    setPdfUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [blob]);

  if (!pdfUrl) {
    return (
      <div className="flex h-full items-center justify-center bg-white px-6 text-center">
        <p className="text-sm font-semibold text-slate-700">
          Loading PDF preview...
        </p>
      </div>
    );
  }

  return (
    <iframe
      src={pdfUrl}
      title={`Preview of ${title}`}
      className="h-full w-full border-0 bg-white"
    />
  );
}

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
    <div className="h-full overflow-auto bg-white p-8 scrollbar-document">
      <pre className="whitespace-pre-wrap break-words font-mono text-sm leading-7 text-slate-800">
        {textContent || "This text file is empty."}
      </pre>
    </div>
  );
}

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
          page.style.backgroundColor = "#ffffff";
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
        className="relative h-full overflow-auto bg-slate-100 scrollbar-document"
        onScroll={handleScroll}
      >
        <PreviewToolbar
          currentPage={currentPage}
          totalPages={totalPages}
          zoom={zoom}
          onPageChange={goToPage}
          onZoomOut={() => setZoom((value) => Math.max(0.5, value - 0.1))}
          onZoomReset={() => setZoom(1)}
          onZoomIn={() => setZoom((value) => Math.min(1.8, value + 0.1))}
        />

        {isRendering ? (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 px-6 text-center">
            <p className="text-sm font-semibold text-slate-700">
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

type ExcelSheetPreview = {
  name: string;
  rows: ExcelCellPreview[][];
  columnWidths: number[];
  rowHeights: Array<number | undefined>;
  totalRows: number;
  totalCols: number;
};

type ExcelCellPreview = {
  value: string;
  hidden: boolean;
  rowSpan: number;
  colSpan: number;
};

const EXCEL_MAX_ROWS = 300;
const EXCEL_MAX_COLS = 80;
const DEFAULT_EXCEL_COLUMN_WIDTH = 128;

function getExcelColumnName(index: number) {
  let columnName = "";
  let value = index + 1;

  while (value > 0) {
    const remainder = (value - 1) % 26;
    columnName = String.fromCharCode(65 + remainder) + columnName;
    value = Math.floor((value - 1) / 26);
  }

  return columnName;
}

function getExcelColumnWidth(column?: XLSX.ColInfo) {
  const width =
    column?.wpx ??
    (typeof column?.wch === "number" ? column.wch * 7 + 12 : undefined) ??
    (typeof column?.width === "number" ? column.width * 7 + 12 : undefined) ??
    DEFAULT_EXCEL_COLUMN_WIDTH;

  return Math.min(Math.max(width, 48), 420);
}

function getExcelRowHeight(row?: XLSX.RowInfo) {
  const height =
    row?.hpx ?? (typeof row?.hpt === "number" ? row.hpt * 1.333 : undefined);

  return height ? Math.min(Math.max(height, 24), 480) : undefined;
}

function getMergeInfo(rowIndex: number, columnIndex: number, merges: XLSX.Range[]) {
  const merge = merges.find(
    (range) =>
      rowIndex >= range.s.r &&
      rowIndex <= range.e.r &&
      columnIndex >= range.s.c &&
      columnIndex <= range.e.c,
  );

  if (!merge) {
    return {
      hidden: false,
      rowSpan: 1,
      colSpan: 1,
    };
  }

  const isStart = merge.s.r === rowIndex && merge.s.c === columnIndex;

  if (!isStart) {
    return {
      hidden: true,
      rowSpan: 1,
      colSpan: 1,
    };
  }

  return {
    hidden: false,
    rowSpan: Math.min(merge.e.r, EXCEL_MAX_ROWS - 1) - rowIndex + 1,
    colSpan: Math.min(merge.e.c, EXCEL_MAX_COLS - 1) - columnIndex + 1,
  };
}

function getExcelCellText(cell?: XLSX.CellObject) {
  if (!cell) return "";
  if (cell.w !== undefined) return String(cell.w);
  if (cell.v === null || cell.v === undefined) return "";

  return String(cell.v);
}

function buildExcelRows(
  sheet: XLSX.WorkSheet,
  rowCount: number,
  columnCount: number,
  merges: XLSX.Range[],
) {
  return Array.from({ length: rowCount }).map((_, rowIndex) =>
    Array.from({ length: columnCount }).map((__, columnIndex) => {
      const mergeInfo = getMergeInfo(rowIndex, columnIndex, merges);

      return {
        value: mergeInfo.hidden
          ? ""
          : getExcelCellText(
              sheet[XLSX.utils.encode_cell({ r: rowIndex, c: columnIndex })],
            ),
        ...mergeInfo,
      };
    }),
  );
}

function ExcelPreview({ blob, title }: { blob: Blob; title: string }) {
  const [sheets, setSheets] = useState<ExcelSheetPreview[]>([]);
  const [activeSheetName, setActiveSheetName] = useState("");
  const [isRendering, setIsRendering] = useState(true);
  const [renderError, setRenderError] = useState(false);
  const [zoom, setZoom] = useState(1);
  const { t } = useTranslation();

  useEffect(() => {
    let isMounted = true;

    setIsRendering(true);
    setRenderError(false);
    setSheets([]);
    setActiveSheetName("");

    const renderExcel = async () => {
      const workbook = XLSX.read(await blob.arrayBuffer(), {
        cellDates: true,
        dense: false,
      });

      return workbook.SheetNames.map((sheetName) => {
        const sheet = workbook.Sheets[sheetName];
        const range = sheet?.["!ref"]
          ? XLSX.utils.decode_range(sheet["!ref"])
          : null;
        const totalRows = range ? range.e.r + 1 : 0;
        const totalCols = range ? range.e.c + 1 : 0;
        const rowCount = Math.min(totalRows, EXCEL_MAX_ROWS);
        const columnCount = Math.min(totalCols, EXCEL_MAX_COLS);
        const merges = sheet?.["!merges"] ?? [];

        // Dynamic Column Auto-Fit calculation
        const columnWidths = Array.from({ length: columnCount }).map((_, columnIndex) => {
          const colInfo = sheet?.["!cols"]?.[columnIndex];
          // Use original defined width if present
          if (colInfo && (colInfo.wpx !== undefined || colInfo.wch !== undefined || colInfo.width !== undefined)) {
            return getExcelColumnWidth(colInfo);
          }

          // Otherwise, scan rows and calculate max character length
          let maxLength = 0;
          const scanRows = Math.min(rowCount, 20); // scan first 20 rows
          for (let r = 0; r < scanRows; r++) {
            const cellAddress = XLSX.utils.encode_cell({ r, c: columnIndex });
            const cell = sheet?.[cellAddress];
            const text = getExcelCellText(cell);
            if (text.length > maxLength) {
              maxLength = text.length;
            }
          }
          // Pad calculation: 8px per char + 24px padding. Clamp between 75px and 450px.
          return Math.min(Math.max(maxLength * 8 + 24, 75), 450);
        });

        return {
          name: sheetName,
          rows: buildExcelRows(sheet, rowCount, columnCount, merges),
          columnWidths,
          rowHeights: Array.from({ length: rowCount }).map((_, index) =>
            getExcelRowHeight(sheet?.["!rows"]?.[index]),
          ),
          totalRows,
          totalCols,
        };
      });
    };

    renderExcel()
      .then((nextSheets) => {
        if (!isMounted) return;

        setSheets(nextSheets);
        setActiveSheetName(nextSheets[0]?.name ?? "");
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
    };
  }, [blob]);

  const activeSheet =
    sheets.find((sheet) => sheet.name === activeSheetName) ?? sheets[0];
  const columnCount = Math.max(
    1,
    activeSheet?.columnWidths.length ??
      activeSheet?.rows.reduce((max, row) => Math.max(max, row.length), 0) ??
      1,
  );

  if (renderError) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-6 text-center">
        <FileText className="h-16 w-16 text-muted-foreground" />

        <h2 className="mt-4 text-xl font-bold text-card-foreground">
          {t("excel.cannotPreview", "Cannot preview this spreadsheet")}
        </h2>

        <p className="mt-2 max-w-md text-muted-foreground">
          {t("excel.cannotPreviewDesc", "The spreadsheet content could not be rendered in the browser.")}
        </p>
      </div>
    );
  }

  return (
    <div
      aria-label={`Preview of ${title}`}
      className="flex h-full flex-col overflow-hidden bg-slate-50 border border-slate-200 rounded-2xl shadow-sm"
    >
      {/* Top Metadata Bar */}
      {activeSheet && (
        <div className="flex h-9 items-center justify-between border-b border-slate-200 bg-slate-50/80 px-4 text-[11px] font-medium text-slate-500 backdrop-blur-sm select-none">
          <span className="flex items-center gap-1.5 font-bold">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Excel Preview
          </span>
          {/* Zoom controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex size-6 items-center justify-center rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              onClick={() => setZoom((v) => Math.max(0.5, v - 0.1))}
              title="Zoom out"
            >
              <Minus className="h-3 w-3" />
            </button>
            <button
              type="button"
              className="min-w-[40px] text-center text-[10px] font-bold text-slate-600 hover:text-slate-900 transition cursor-pointer"
              onClick={() => setZoom(1)}
              title="Reset Zoom"
            >
              {Math.round(zoom * 100)}%
            </button>
            <button
              type="button"
              className="flex size-6 items-center justify-center rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              onClick={() => setZoom((v) => Math.min(1.8, v + 0.1))}
              title="Zoom in"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}

      {/* Main Grid View Container */}
      <div className="relative min-h-0 flex-1 overflow-auto scrollbar-document">
        {isRendering ? (
          <div className="absolute inset-0 z-40 flex items-center justify-center bg-white/80 px-6 text-center">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
              <p className="text-sm font-semibold text-slate-700">
                {t("excel.rendering", "Rendering spreadsheet preview...")}
              </p>
            </div>
          </div>
        ) : null}

        {!isRendering && !activeSheet ? (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center">
            <FileText className="h-16 w-16 text-muted-foreground" />
            <h2 className="mt-4 text-xl font-bold text-card-foreground">
              {t("excel.empty", "This spreadsheet is empty")}
            </h2>
          </div>
        ) : null}

        {activeSheet ? (
          <table
            style={{ zoom }}
            className="border-collapse text-sm text-slate-900 w-full table-fixed origin-top-left"
          >
            <colgroup>
              <col style={{ width: "48px" }} />
              {Array.from({ length: columnCount }).map((_, columnIndex) => (
                <col
                  key={columnIndex}
                  style={{
                    width:
                      activeSheet.columnWidths[columnIndex] ??
                      DEFAULT_EXCEL_COLUMN_WIDTH,
                  }}
                />
              ))}
            </colgroup>
            <thead>
              <tr className="h-8">
                {/* Top-Left Corner sticky cell */}
                <th className="sticky left-0 top-0 z-30 border border-slate-200 bg-slate-100 px-2 py-1 text-center text-xs font-bold text-slate-500 select-none shadow-[1px_1px_0_#e2e8f0]" />
                {Array.from({ length: columnCount }).map((_, columnIndex) => (
                  <th
                    key={columnIndex}
                    className="sticky top-0 z-20 border border-slate-200 bg-slate-50 px-3 py-1 text-center text-xs font-bold text-slate-500 select-none shadow-[0_1px_0_#e2e8f0]"
                  >
                    {getExcelColumnName(columnIndex)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {activeSheet.rows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  style={{
                    height: activeSheet.rowHeights[rowIndex],
                  }}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  {/* Row Numbers sticky headers */}
                  <th className="sticky left-0 z-20 border border-slate-200 bg-slate-50 px-2 py-1 text-center text-xs font-bold text-slate-400 select-none shadow-[1px_0_0_#e2e8f0]">
                    {rowIndex + 1}
                  </th>
                  {Array.from({ length: columnCount }).map((_, columnIndex) => {
                    const cell = row[columnIndex] ?? {
                      value: "",
                      hidden: false,
                      rowSpan: 1,
                      colSpan: 1,
                    };

                    if (cell.hidden) return null;

                    return (
                      <td
                        key={columnIndex}
                        rowSpan={cell.rowSpan}
                        colSpan={cell.colSpan}
                        className="whitespace-pre-wrap break-words border border-slate-200 bg-white px-3 py-1.5 align-top text-[13px] leading-normal text-slate-900 select-text"
                      >
                        {cell.value}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
      </div>

      {/* Sheets Tab Selection Bar at bottom */}
      {sheets.length > 0 && (
        <div className="flex h-10 items-center overflow-x-auto border-t border-slate-200 bg-[#f8f9fa] px-4 select-none shrink-0 scrollbar-tabs">
          {sheets.map((sheet) => (
            <button
              key={sheet.name}
              type="button"
              className={`h-full shrink-0 px-5 text-xs font-bold transition-all border-r border-slate-200 outline-none flex items-center gap-1.5 cursor-pointer ${
                sheet.name === activeSheet?.name
                  ? "bg-white text-emerald-700 border-t-2 border-t-emerald-600 shadow-sm"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              }`}
              onClick={() => setActiveSheetName(sheet.name)}
            >
              <span className={`h-1.5 w-1.5 rounded-full transition-colors ${sheet.name === activeSheet?.name ? 'bg-emerald-500' : 'bg-slate-300'}`} />
              {sheet.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default DocumentPreview;
