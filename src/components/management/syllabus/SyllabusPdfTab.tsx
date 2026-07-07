import { useState, useRef } from "react";
import { FileText, Download, Upload, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";

interface SyllabusPdfTabProps {
  pdfUrl: string;
  onUploadNewVersion: (file: File) => void;
  isPending: boolean;
}

export default function SyllabusPdfTab({
  pdfUrl,
  onUploadNewVersion,
  isPending,
}: SyllabusPdfTabProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === "application/pdf") {
        setSelectedFile(file);
      } else {
        toast.error("Please upload a PDF file only");
      }
    }
  };

  const handleSubmit = () => {
    if (!selectedFile) return;
    onUploadNewVersion(selectedFile);
    setSelectedFile(null); // Clear selected file after submit
  };

  return (
    <div className="flex-1 flex flex-col items-center py-6 gap-6">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="application/pdf"
        className="hidden"
      />

      <div className="flex flex-col items-center gap-3">
        <FileText className="h-16 w-16 text-primary opacity-70" />
        <div className="text-center">
          <h5 className="font-bold text-card-foreground">
            Official Syllabus Document (PDF)
          </h5>
          <p className="text-xs text-muted-foreground mt-1 max-w-md truncate">
            URL: {pdfUrl}
          </p>
        </div>
        <div className="flex gap-3">
          <a
            href={pdfUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center h-10 px-5 rounded-xl bg-secondary/80 text-secondary-foreground font-bold hover:bg-secondary transition-all"
          >
            Open in Tab
          </a>
          <a
            href={pdfUrl}
            download
            className="flex items-center justify-center h-10 px-5 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/95 transition-all gap-2"
          >
            <Download className="h-4 w-4" />
            Download File
          </a>
        </div>
      </div>

      {/* Upload đè phiên bản mới */}
      <div className="w-full max-w-md border-t border-border pt-6 mt-2">
        <h6 className="text-xs font-black uppercase text-muted-foreground mb-3 text-center">
          Upload New Version (Overwrites Current)
        </h6>

        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-border rounded-2xl p-4 text-center cursor-pointer hover:bg-secondary/20 transition-all"
        >
          <Upload className="mx-auto h-5 w-5 text-muted-foreground opacity-60 mb-2" />
          {selectedFile ? (
            <div className="space-y-1">
              <p className="text-xs font-bold text-card-foreground truncate max-w-[250px] mx-auto">
                {selectedFile.name}
              </p>
              <Button
                size="sm"
                variant="link"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFile(null);
                }}
                className="h-6 text-[10px] text-destructive hover:no-underline font-bold"
              >
                Remove
              </Button>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              Click to select new PDF to update syllabus
            </p>
          )}
        </div>

        {selectedFile && (
          <div className="flex justify-center mt-3">
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={isPending}
              className="rounded-lg font-bold"
            >
              {isPending && (
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              )}
              Upload & Sync New Version
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
