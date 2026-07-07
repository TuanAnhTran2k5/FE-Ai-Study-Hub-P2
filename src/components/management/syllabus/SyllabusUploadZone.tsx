import React, { useState, useRef } from "react";
import { Upload, FileText, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";

interface SyllabusUploadZoneProps {
  onUpload: (file: File) => void;
  isPending: boolean;
}

export default function SyllabusUploadZone({
  onUpload,
  isPending,
}: SyllabusUploadZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf") {
        setSelectedFile(file);
      } else {
        toast.error("Please upload a PDF file only");
      }
    }
  };

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
    onUpload(selectedFile);
  };

  return (
    <div className="space-y-6 py-6">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="application/pdf"
        className="hidden"
      />

      <div className="text-center max-w-lg mx-auto">
        <Upload className="mx-auto h-12 w-12 text-muted-foreground opacity-60" />
        <h4 className="mt-4 text-lg font-black text-card-foreground">
          No Syllabus Configured
        </h4>
        <p className="mt-2 text-sm text-muted-foreground">
          To enable **AI Coach RAG Chat** for students in this subject, you
          must upload the official Syllabus document in PDF format.
        </p>
      </div>

      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-3xl p-10 text-center cursor-pointer transition-all ${
          dragActive
            ? "border-primary bg-primary/5"
            : "border-border bg-secondary/10 hover:bg-secondary/20"
        }`}
      >
        {selectedFile ? (
          <div className="flex flex-col items-center space-y-3">
            <FileText className="h-10 w-10 text-primary animate-bounce" />
            <p className="font-bold text-card-foreground text-base max-w-sm truncate">
              {selectedFile.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • PDF Document
            </p>
            <Button
              type="button"
              variant="link"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedFile(null);
              }}
              className="text-destructive font-bold text-xs"
            >
              Remove File
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="font-bold text-card-foreground">
              Drag and drop your syllabus PDF here, or{" "}
              <span className="text-primary hover:underline">browse</span>
            </p>
            <p className="text-xs text-muted-foreground">
              Only official PDF documents are accepted
            </p>
          </div>
        )}
      </div>

      {selectedFile && (
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => setSelectedFile(null)}
            disabled={isPending}
            className="rounded-xl font-bold cursor-pointer"
          >
            Clear
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isPending}
            className="rounded-xl font-bold cursor-pointer"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Upload & Analyze
          </Button>
        </div>
      )}
    </div>
  );
}
