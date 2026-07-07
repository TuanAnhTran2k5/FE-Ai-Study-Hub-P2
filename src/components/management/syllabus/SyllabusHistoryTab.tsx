import { Loader2, History, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import type { SyllabusHistoryResponse } from "@/types/syllabus.type";

interface SyllabusHistoryTabProps {
  historyList: SyllabusHistoryResponse[];
  isLoading: boolean;
  onRollback: (historyId: number) => void;
  isPending: boolean;
}

export default function SyllabusHistoryTab({
  historyList,
  isLoading,
  onRollback,
  isPending,
}: SyllabusHistoryTabProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-2 text-xs">Loading history data...</p>
      </div>
    );
  }

  if (historyList.length === 0) {
    return (
      <div className="text-center py-16 border border-dashed border-border rounded-3xl">
        <History className="mx-auto h-10 w-10 text-muted-foreground opacity-60" />
        <p className="mt-2 text-sm text-muted-foreground">
          No change history available. This is the initial version.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <Table>
        <TableHeader className="bg-secondary/40">
          <TableRow>
            <TableHead className="w-[80px] font-bold">Ver</TableHead>
            <TableHead className="w-[150px] font-bold">Updated By</TableHead>
            <TableHead className="font-bold">Reason</TableHead>
            <TableHead className="w-[180px] font-bold">Time</TableHead>
            <TableHead className="w-[120px] text-right font-bold">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {historyList.map((hist) => (
            <TableRow key={hist.id}>
              <TableCell className="font-black text-primary">
                v{hist.version}
              </TableCell>
              <TableCell className="font-semibold text-card-foreground truncate max-w-[150px]">
                {hist.updatedBy}
              </TableCell>
              <TableCell className="text-muted-foreground max-w-sm truncate">
                {hist.updatedReason || "No details provided."}
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {new Date(hist.createdAt).toLocaleString()}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onRollback(hist.id)}
                  disabled={isPending}
                  className="cursor-pointer rounded-lg text-xs font-bold gap-1.5"
                >
                  {isPending ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <RotateCcw className="h-3 w-3" />
                  )}
                  Rollback
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
