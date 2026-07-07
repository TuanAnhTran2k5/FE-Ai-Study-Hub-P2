import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface SyllabusJsonEditorProps {
  initialJson: string;
  onSave: (jsonContent: string, reason: string) => void;
  isPending: boolean;
}

export default function SyllabusJsonEditor({
  initialJson,
  onSave,
  isPending,
}: SyllabusJsonEditorProps) {
  const [jsonText, setJsonText] = useState(initialJson);
  const [editReason, setEditReason] = useState("");

  // Sync state when initialJson changes
  useEffect(() => {
    setJsonText(initialJson);
  }, [initialJson]);

  const handleSave = () => {
    try {
      JSON.parse(jsonText);
    } catch (e) {
      toast.error("Invalid JSON syntax. Please check brackets and quotes.");
      return;
    }

    if (!editReason.trim()) {
      toast.error("Please provide a reason for this update");
      return;
    }

    onSave(jsonText, editReason.trim());
    setEditReason(""); // Clear reason input
  };

  return (
    <div className="flex-1 flex flex-col gap-4">
      <div className="flex-1 flex flex-col min-h-[300px]">
        <label className="block text-xs font-black uppercase text-muted-foreground mb-1.5">
          Structured Syllabus JSON Data
        </label>
        <Textarea
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
          className="flex-1 font-mono text-sm p-4 rounded-2xl border border-border bg-secondary/10 resize-none min-h-[250px] focus-visible:ring-1"
          disabled={isPending}
          placeholder="Enter raw structured JSON syllabus content..."
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-12 items-end">
        <div className="sm:col-span-9 space-y-1.5">
          <label className="block text-xs font-black uppercase text-muted-foreground">
            Reason for modification *
          </label>
          <Input
            placeholder="e.g. Correct credits count, update materials edition..."
            value={editReason}
            onChange={(e) => setEditReason(e.target.value)}
            className="h-10 rounded-xl"
            disabled={isPending}
          />
        </div>
        <Button
          onClick={handleSave}
          disabled={isPending}
          className="sm:col-span-3 h-10 rounded-xl font-bold cursor-pointer"
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save & Re-sync
        </Button>
      </div>
    </div>
  );
}
