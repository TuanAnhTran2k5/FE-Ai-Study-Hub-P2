import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  X,
  Plus
} from "lucide-react";

const CONTEXT_DOCUMENTS = [
  { name: "OOP in Java - Complete Guide.pdf", size: "2.4 MB", pages: "Page 1-45", type: "pdf", color: "text-red-500 bg-red-100" },
  { name: "Java OOP Notes.docx", size: "1.8 MB", pages: "Page 1-23", type: "docx", color: "text-blue-500 bg-blue-100" },
  { name: "OOP Concepts.pptx", size: "3.2 MB", pages: "Page 1-18", type: "pptx", color: "text-orange-500 bg-orange-100" },
];

const SUGGESTED_PROMPTS = [
  "Explain inheritance with an example",
  "What is polymorphism in Java?",
  "Differences between abstract class and interface",
  "Create a UML class diagram for a library system",
  "Generate quiz about OOP in Java"
];



function ContextSidebar() {
  console.log("ContextSidebar is rendering! If you don't see the Add Document button, please HARD REFRESH (Ctrl+F5) or restart the dev server.");
  return (
    <div className="h-full flex flex-col gap-4 overflow-y-auto pr-2 pb-4">

      {/* Context Documents */}
      <Card className="shadow-sm border-border/50 shrink-0">
        <CardHeader className="p-4 pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-bold">Context Documents (3)</CardTitle>
          <button className="text-xs text-primary font-medium hover:underline">Manage</button>
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-3">
          <div className="space-y-2">
            {CONTEXT_DOCUMENTS.map((doc, idx) => (
              <div key={idx} className="flex items-start justify-between group rounded-lg p-2 hover:bg-muted/50 transition-colors">
                <div className="flex gap-3 overflow-hidden">
                  <div className={`mt-0.5 shrink-0 flex items-center justify-center size-8 rounded-lg ${doc.color}`}>
                    <FileText className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold truncate" title={doc.name}>{doc.name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {doc.size} · {doc.pages}
                    </p>
                  </div>
                </div>
                <button className="shrink-0 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity p-1">
                  <X className="size-3.5" />
                </button>
              </div>
            ))}
          </div>

          <button className="flex items-center text-primary hover:underline h-9 text-xs font-semibold mt-1 px-1">
            <Plus className="mr-1.5 size-4" />
            Add More Documents
          </button>
        </CardContent>
      </Card>

      {/* Suggested Prompts */}
      <Card className="shadow-sm border-border/50 shrink-0">
        <CardHeader className="p-4 pb-3">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            Suggested Prompts
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="space-y-2">
            {SUGGESTED_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                className="w-full text-left text-xs text-muted-foreground hover:text-foreground bg-muted/30 hover:bg-muted/60 p-2.5 rounded-lg transition-colors truncate"
                title={prompt}
              >
                {prompt}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>



    </div>
  );
}

export default ContextSidebar;
