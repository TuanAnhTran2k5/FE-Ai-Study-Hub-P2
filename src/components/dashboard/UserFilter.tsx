import { Search, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserFilterProps {
  search: string;
  setSearch: (val: string) => void;
  status: string;
  setStatus: (val: string) => void;
  totalAccounts: number;
}

export function UserFilter({
  search,
  setSearch,
  status,
  setStatus,
  totalAccounts,
}: UserFilterProps) {
  const { t } = useTranslation();

  return (
    <Card className="rounded-3xl border border-slate-400/80 dark:border-border/80 bg-card shadow-sm">
      <CardContent className="p-5 flex flex-col md:flex-row gap-4 items-center w-full justify-between">
        <div className="relative w-full flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-muted-foreground" />
          <Input
            type="text"
            placeholder={t("admin.searchUsersPlaceholder", "Search by name or email...")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10 rounded-2xl bg-secondary/15 hover:bg-secondary/25 dark:bg-background border border-slate-300 dark:border-border text-xs font-bold text-card-foreground focus:bg-background focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/10 transition-all duration-300 placeholder:text-slate-400 dark:placeholder:text-muted-foreground/60 shadow-sm"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto items-center">
          {/* Status Select Box */}
          <Select
            value={status || "ALL"}
            onValueChange={(val) => setStatus(val === "ALL" ? "" : val)}
          >
            <SelectTrigger className="h-10 w-full md:w-[180px] rounded-2xl border border-slate-300 dark:border-border bg-background text-xs font-bold text-card-foreground cursor-pointer focus:ring-0 focus:ring-offset-0 focus:border-primary">
              <SelectValue placeholder={t("admin.filterAll", "All Statuses")} />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border border-slate-300 dark:border-border bg-popover text-popover-foreground shadow-lg z-50">
              <SelectItem value="ALL" className="text-xs font-bold cursor-pointer">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.5)]" />
                  <span>{t("admin.filterAll", "All Statuses")}</span>
                </div>
              </SelectItem>
              <SelectItem value="ACTIVE" className="text-xs font-bold cursor-pointer">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-teal-500 shadow-[0_0_6px_rgba(20,184,166,0.5)]" />
                  <span>{t("admin.filterActive", "Active")}</span>
                </div>
              </SelectItem>
              <SelectItem value="BANNED" className="text-xs font-bold cursor-pointer">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.5)]" />
                  <span>{t("admin.filterBanned", "Banned")}</span>
                </div>
              </SelectItem>
              <SelectItem value="PENDING" className="text-xs font-bold cursor-pointer">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.5)]" />
                  <span>{t("admin.filterPending", "Pending")}</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Total Accounts Badge */}
          <div className="flex items-center gap-2 px-4 h-10 rounded-2xl border border-slate-300 dark:border-border bg-secondary/15 dark:bg-secondary/10 shrink-0 text-xs font-bold text-card-foreground shadow-sm select-none">
            <Users className="h-4 w-4 text-primary" />
            <span>
              {t("admin.totalAccountsLabel", "Total:")}{" "}
              <span className="text-primary font-black">{totalAccounts}</span>
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
