import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import {
  Trophy,
  Plus,
  Search,
  Edit2,
  Trash2,
  Download,
  Loader2,
  Medal,
} from "lucide-react";

import { ROUTE } from "@/models/routePath";
import type { User as AuthUser } from "@/models/user";
import type { RootState } from "@/redux/store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// Import Components con
import BadgeDialog from "@/components/management/BadgeDialog";
import DeleteConfirmDialog from "@/components/management/DeleteConfirmDialog";

// Import API Services
import {
  getAllBadges,
  createBadge,
  updateBadge,
  deleteBadge,
} from "@/services/adminBadgeService";
import type { BadgeResponse } from "@/types/badge.type";

export default function BadgesManagementPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  // 1. Phân quyền Admin
  const currentUser = useSelector(
    (state: RootState) => state.user as AuthUser | null
  );
  const hasToken = !!localStorage.getItem("accessToken");

  if (!hasToken) {
    return <Navigate to={`/${ROUTE.HOME}`} replace />;
  }

  if (!currentUser || currentUser.role !== "AD") {
    toast.error("Access denied. Admin role required.");
    return <Navigate to={`/${ROUTE.APP}/${ROUTE.DASHBOARD}`} replace />;
  }

  // 2. States quản lý giao diện
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBadge, setEditingBadge] = useState<BadgeResponse | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    id: number;
    identifier: string;
  } | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  // ==========================================
  // FETCHING DATA (React Query)
  // ==========================================
  const { data: badges = [], isLoading } = useQuery({
    queryKey: ["admin-badges", searchKeyword],
    queryFn: () => getAllBadges(searchKeyword),
  });

  // ==========================================
  // MUTATIONS (React Query)
  // ==========================================
  
  // 1. Create Badge Mutation
  const createMutation = useMutation({
    mutationFn: createBadge,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-badges"] });
      setImageErrors({});
      toast.success(t("badges.messages.createSuccess"));
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t("badges.messages.createFailed"));
    },
  });

  // 2. Update Badge Mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) =>
      updateBadge(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-badges"] });
      setImageErrors({});
      toast.success(t("badges.messages.updateSuccess"));
      setIsDialogOpen(false);
      setEditingBadge(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t("badges.messages.updateFailed"));
    },
  });

  // 3. Delete Badge Mutation
  const deleteMutation = useMutation({
    mutationFn: deleteBadge,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-badges"] });
      setImageErrors({});
      toast.success(t("badges.messages.deleteSuccess"));
      setDeleteConfirm(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t("badges.messages.deleteFailed"));
    },
  });

  // ==========================================
  // HANDLERS
  // ==========================================
  const handleFormSubmit = (formData: FormData) => {
    if (editingBadge) {
      updateMutation.mutate({
        id: editingBadge.badgeId,
        data: formData,
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDeleteConfirm = () => {
    if (!deleteConfirm) return;
    deleteMutation.mutate(deleteConfirm.id);
  };

  const isPendingAction =
    createMutation.isPending || updateMutation.isPending;

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-10">
      {/* HEADER SECTION */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-primary">
            <Trophy className="h-5 w-5" />
            {t("badges.title.dashboard")}
          </div>
          <h1 className="mt-2 text-4xl font-black text-card-foreground">
            {t("badges.title.main")}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {t("badges.title.description")}
          </p>
        </div>
      </div>

      {/* FILTER & TOP ACTIONS */}
      <Card className="rounded-3xl border border-border bg-card shadow-sm mb-8">
        <CardContent className="p-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t("badges.placeholders.search")}
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="h-11 rounded-xl pl-10"
              />
            </div>
            <Badge
              variant="outline"
              className="h-11 px-3 rounded-xl border border-border font-bold text-xs bg-secondary/10 flex items-center justify-center shrink-0"
            >
              {t("badges.stats.total")}: {badges.length}
            </Badge>
          </div>

          <Button
            onClick={() => {
              setEditingBadge(null);
              setIsDialogOpen(true);
            }}
            className="cursor-pointer rounded-xl font-bold h-11"
          >
            <Plus className="mr-2 h-4 w-4" />
            {t("badges.actions.add")}
          </Button>
        </CardContent>
      </Card>

      {/* BADGES DISPLAY GRID */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="mt-3 text-sm font-semibold">
            {t("badges.messages.loading")}
          </p>
        </div>
      ) : badges.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border py-20 text-center bg-card/50">
          <Medal className="mx-auto h-16 w-16 text-muted-foreground opacity-60" />
          <h4 className="mt-4 font-bold text-card-foreground text-lg">
            {t("badges.messages.emptyTitle")}
          </h4>
          <p className="mt-1 text-sm text-muted-foreground max-w-sm mx-auto">
            {t("badges.messages.emptyDesc")}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {badges.map((badge) => (
            <Card
              key={badge.badgeId}
              className="group relative overflow-hidden rounded-3xl border border-border bg-card shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
            >
              {/* TOP BACKGROUND GRADIENT */}
              <div className="h-2 w-full bg-gradient-to-r from-primary/60 via-primary to-primary/60" />

              <CardContent className="p-6 flex-1 flex flex-col">
                <div className="flex items-start gap-4 mb-4">
                  {/* Badge logo icon */}
                  <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-secondary/20 p-2 border border-border/50 overflow-hidden text-primary">
                    {imageErrors[badge.badgeId] || !badge.iconUrl ? (
                      <Medal className="h-8 w-8 opacity-60" />
                    ) : (
                      <img
                        src={
                          badge.iconUrl.startsWith("data:")
                            ? badge.iconUrl
                            : `${badge.iconUrl}?t=${Date.now()}`
                        }
                        alt={badge.badgeName}
                        className="size-full object-contain transition-transform duration-300 group-hover:scale-105"
                        onError={() => {
                          setImageErrors((prev) => ({
                            ...prev,
                            [badge.badgeId]: true,
                          }));
                        }}
                      />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-card-foreground truncate">
                      {badge.badgeName}
                    </h3>
                    {badge.requiredDownloads !== null &&
                      badge.requiredDownloads !== undefined &&
                      badge.requiredDownloads > 0 && (
                        <Badge className="bg-primary/10 text-primary hover:bg-primary/10 gap-1 rounded-full mt-1 font-bold text-[10px]">
                          <Download className="h-3 w-3" />
                          {badge.requiredDownloads} {t("badges.condition.downloads")}
                        </Badge>
                      )}
                  </div>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-3 mb-6 flex-1">
                  {badge.description}
                </p>

                {/* CONDITION HINT */}
                {badge.conditionText && (
                  <p className="text-[10px] text-muted-foreground bg-secondary/20 border border-border/55 p-2 rounded-xl mb-4 italic">
                    {badge.conditionText}
                  </p>
                )}

                {/* BOTTOM ACTION BUTTONS */}
                <div className="flex justify-end gap-2 border-t border-border/50 pt-4 mt-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingBadge(badge);
                      setIsDialogOpen(true);
                    }}
                    className="cursor-pointer rounded-xl text-xs font-bold gap-1.5"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    {t("common.edit")}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setDeleteConfirm({
                        id: badge.badgeId,
                        identifier: badge.badgeName,
                      })
                    }
                    className="cursor-pointer rounded-xl text-xs font-bold text-destructive hover:bg-destructive/10 hover:text-destructive gap-1.5"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    {t("common.delete")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* DIALOGS */}
      <BadgeDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingBadge={editingBadge}
        onSubmit={handleFormSubmit}
        isPending={isPendingAction}
      />

      <DeleteConfirmDialog
        isOpen={!!deleteConfirm}
        onOpenChange={(v) => {
          if (!v) setDeleteConfirm(null);
        }}
        onConfirm={handleDeleteConfirm}
        isPending={deleteMutation.isPending}
        type="badge"
        identifier={deleteConfirm?.identifier || ""}
      />
    </div>
  );
}
