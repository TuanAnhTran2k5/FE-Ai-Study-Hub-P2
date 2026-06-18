import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History, Maximize2 } from "lucide-react";

const HISTORY_DATA = [
  {
    group: "Today",
    items: [
      { title: "Explain OOP in Java", time: "10:30 AM", active: true },
      { title: "Database Normalization", time: "9:15 AM" },
    ],
  },
  {
    group: "Yesterday",
    items: [
      { title: "What is Software Testing?", time: "Yesterday" },
      { title: "Explain Normal Forms", time: "Yesterday" },
    ],
  },
  {
    group: "2 days ago",
    items: [
      { title: "Difference between Array & List", time: "2 days ago" },
      { title: "How does JWT work?", time: "2 days ago" },
    ],
  },
  {
    group: "3 days ago",
    items: [{ title: "Project Management Steps", time: "3 days ago" }],
  },
];

function ChatHistorySidebar() {
  return (
    <Card className="h-full flex flex-col shadow-sm border-sidebar-border bg-card overflow-hidden">
      <CardHeader className="p-4 pb-2 shrink-0 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          Chat History
        </CardTitle>
        <History className="size-4 text-muted-foreground" />
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto p-4 pt-2 space-y-6">
        {HISTORY_DATA.map((group, i) => (
          <div key={i} className="space-y-2">
            <h4 className="text-xs font-semibold text-muted-foreground">
              {group.group}
            </h4>
            <ul className="space-y-1">
              {group.items.map((item, j) => (
                <li key={j}>
                  <button
                    className={`w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-xl transition-colors ${
                      item.active
                        ? "bg-primary/20 text-primary font-bold"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    <span className="truncate max-w-[140px] text-left">{item.title}</span>
                    <span className="text-[10px] shrink-0 text-muted-foreground whitespace-nowrap">
                      {item.time}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </CardContent>

      <div className="p-4 pt-2 shrink-0">
        <Button className="w-full bg-primary/20 hover:bg-primary/30 text-primary font-semibold shadow-none flex items-center justify-center gap-2 rounded-xl">
          <Maximize2 className="size-4" />
          View All History
        </Button>
      </div>
    </Card>
  );
}

export default ChatHistorySidebar;