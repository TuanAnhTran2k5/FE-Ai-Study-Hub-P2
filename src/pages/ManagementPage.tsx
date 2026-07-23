import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { BookOpen, Layers, BookMarked, RotateCcw } from "lucide-react";

import { ROUTE } from "@/models/routePath";
import type { User as AuthUser } from "@/models/user";
import type { RootState } from "@/redux/store";
import { Card, CardContent } from "@/components/ui/card";

// Import Components con
import SemesterTable from "@/components/management/SemesterTable";
import SemesterDialog from "@/components/management/SemesterDialog";
import ComboAccordion from "@/components/management/ComboAccordion";
import ComboDialog from "@/components/management/ComboDialog";
import DeleteConfirmDialog from "@/components/management/DeleteConfirmDialog";
import SubjectDialog from "@/components/management/SubjectDialog";
import SyllabusManageDialog from "@/components/management/SyllabusManageDialog";
import SubjectTable from "@/components/management/SubjectTable";
import DeletedHistoryTable from "@/components/management/DeletedHistoryTable";

// Import API Services
import {
  getAllSemesters,
  createSemester,
  updateSemester,
  deleteSemester,
  getAllComboSubjects,
  createComboSubject,
  updateComboSubject,
  deleteComboSubject,
  getAllSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
  restoreComboSubject,
  restoreSubject,
} from "@/services/adminCurriculumService";

// Import Types & Constants
import type {
  SemesterRequest,
  SemesterResponse,
  ComboSubjectRequest,
  ComboSubjectResponse,
  SubjectRequest,
  SubjectResponse,
} from "@/types/curriculum.type";
import { ERROR_CODE } from "@/constants/errorCode";

function ManagementPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  
  // 1. Phân quyền Admin
  const currentUser = useSelector(
    (state: RootState) => state.user as AuthUser | null
  );

  const hasToken = !!localStorage.getItem("accessToken");

  // Nếu người dùng đã logout (xóa token), chuyển hướng lặng lẽ về trang chủ mà không báo lỗi
  if (!hasToken) {
    return <Navigate to={`/${ROUTE.HOME}`} replace />;
  }

  if (!currentUser || currentUser.role !== "AD") {
    toast.error(t("curriculum.accessDenied", "Access denied. Admin role required."));
    return <Navigate to={`/${ROUTE.APP}/${ROUTE.DASHBOARD}`} replace />;
  }

  // 2. State điều hướng Tabs & Tìm kiếm
  const [activeTab, setActiveTab] = useState<
    "semesters" | "combos" | "subjects" | "deleted-subjects"
  >("semesters");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [subjectSearchKeyword, setSubjectSearchKeyword] = useState("");
  const [deletedSubjectSearchKeyword, setDeletedSubjectSearchKeyword] =
    useState("");

  // 3. State điều khiển Semester Dialog
  const [isSemesterDialogOpen, setIsSemesterDialogOpen] = useState(false);
  const [editingSemester, setEditingSemester] = useState<SemesterResponse | null>(null);

  // 4. State điều khiển Combo Dialog
  const [isComboDialogOpen, setIsComboDialogOpen] = useState(false);
  const [editingCombo, setEditingCombo] = useState<ComboSubjectResponse | null>(null);

  // 5. State điều khiển Delete Dialog
  const [deleteConfirm, setDeleteConfirm] = useState<{
    id: number;
    type: "semester" | "combo" | "subject";
    identifier: string;
  } | null>(null);

  // 6. State điều khiển Subject Dialog (Sửa/Thêm nhanh riêng lẻ)
  const [isSubjectDialogOpen, setIsSubjectDialogOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<{
    subject: any | null;
    combo: ComboSubjectResponse;
  } | null>(null);

  const [subjectDeleteConfirm, setSubjectDeleteConfirm] = useState<{
    subject: any;
    combo: ComboSubjectResponse;
  } | null>(null);

  // 7. State quản lý Đề Cương (Syllabus)
  const [selectedSyllabusSubject, setSelectedSyllabusSubject] = useState<SubjectResponse | null>(null);
  const [isSyllabusDialogOpen, setIsSyllabusDialogOpen] = useState(false);

  // 8. State quản lý Môn học độc lập (Tab All Subjects)
  const [isSingleSubjectDialogOpen, setIsSingleSubjectDialogOpen] = useState(false);
  const [editingSingleSubject, setEditingSingleSubject] = useState<SubjectResponse | null>(null);

  // ==========================================
  // FETCHING DATA (React Query)
  // ==========================================
  
  // Get Semesters
  const { data: semesters = [], isLoading: isLoadingSemesters } = useQuery({
    queryKey: ["admin-semesters"],
    queryFn: getAllSemesters,
  });

  // Get Combo Subjects
  const { data: combos = [], isLoading: isLoadingCombos } = useQuery({
    queryKey: ["admin-combos"],
    queryFn: () => getAllComboSubjects(),
  });

  // Get All Subjects (Core & Combo)
  const { data: subjects = [], isLoading: isLoadingSubjects } = useQuery({
    queryKey: ["admin-subjects"],
    queryFn: () => getAllSubjects(),
  });

  const normalizedSubjectSearch = subjectSearchKeyword.trim().toLowerCase();
  const normalizedComboSearch = searchKeyword.trim().toLowerCase();
  const normalizedDeletedSubjectSearch = deletedSubjectSearchKeyword
    .trim()
    .toLowerCase();

  const activeSubjects = subjects.filter(
    (subject) =>
      !subject.isDeleted &&
      (!normalizedSubjectSearch ||
        subject.subjectCode.toLowerCase().includes(normalizedSubjectSearch) ||
        subject.subjectName.toLowerCase().includes(normalizedSubjectSearch)),
  );

  const deletedSubjects = subjects.filter(
    (subject) =>
      subject.isDeleted &&
      (!normalizedDeletedSubjectSearch ||
        subject.subjectCode
          .toLowerCase()
          .includes(normalizedDeletedSubjectSearch) ||
        subject.subjectName
          .toLowerCase()
          .includes(normalizedDeletedSubjectSearch)),
  );

  const activeCombos = combos.filter(
    (combo) =>
      !combo.isDeleted &&
      (!normalizedComboSearch ||
        combo.comboCode.toLowerCase().includes(normalizedComboSearch) ||
        combo.comboName.toLowerCase().includes(normalizedComboSearch)),
  );
  const deletedCombos = combos.filter(
    (combo) =>
      combo.isDeleted &&
      (!normalizedDeletedSubjectSearch ||
        combo.comboCode
          .toLowerCase()
          .includes(normalizedDeletedSubjectSearch) ||
        combo.comboName
          .toLowerCase()
          .includes(normalizedDeletedSubjectSearch)),
  );

  // ==========================================
  // MUTATIONS (React Query)
  // ==========================================
  
  // 1. Semester Mutations
  const createSemesterMutation = useMutation({
    mutationFn: createSemester,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-semesters"] });
      queryClient.invalidateQueries({ queryKey: ["admin-combos"] });
      queryClient.invalidateQueries({ queryKey: ["admin-subjects"] });
      toast.success(t("success.createSemester"));
      setIsSemesterDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t(ERROR_CODE.CREATE_SEMESTER_FAILED));
    },
  });

  const updateSemesterMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: SemesterRequest }) =>
      updateSemester(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-semesters"] });
      queryClient.invalidateQueries({ queryKey: ["admin-combos"] });
      queryClient.invalidateQueries({ queryKey: ["admin-subjects"] });
      toast.success(t("success.updateSemester"));
      setIsSemesterDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t(ERROR_CODE.UPDATE_SEMESTER_FAILED));
    },
  });

  const deleteSemesterMutation = useMutation({
    mutationFn: deleteSemester,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-semesters"] });
      queryClient.invalidateQueries({ queryKey: ["admin-combos"] });
      queryClient.invalidateQueries({ queryKey: ["admin-subjects"] });
      toast.success(t("success.deleteSemester"));
      setDeleteConfirm(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t(ERROR_CODE.DELETE_SEMESTER_FAILED));
    },
  });

  // 2. Combo Mutations
  const createComboMutation = useMutation({
    mutationFn: createComboSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-combos"] });
      queryClient.invalidateQueries({ queryKey: ["admin-subjects"] });
      toast.success(t("success.createCombo"));
      setIsComboDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t(ERROR_CODE.CREATE_COMBO_FAILED));
    },
  });

  const updateComboMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ComboSubjectRequest }) =>
      updateComboSubject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-combos"] });
      queryClient.invalidateQueries({ queryKey: ["admin-subjects"] });
      toast.success(t("success.updateCombo"));
      setIsComboDialogOpen(false);
      setIsSubjectDialogOpen(false);
      setEditingSubject(null);
      setSubjectDeleteConfirm(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t(ERROR_CODE.UPDATE_COMBO_FAILED));
    },
  });

  const deleteComboMutation = useMutation({
    mutationFn: deleteComboSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-combos"] });
      queryClient.invalidateQueries({ queryKey: ["admin-subjects"] });
      toast.success(t("success.deleteCombo"));
      setDeleteConfirm(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t(ERROR_CODE.DELETE_COMBO_FAILED));
    },
  });

  const restoreComboMutation = useMutation({
  mutationFn: restoreComboSubject,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["admin-combos"] });
    queryClient.invalidateQueries({ queryKey: ["admin-subjects"] });

    toast.success(t("success.restoreCombo", "Combo restored successfully!"));
  },
  onError: (error: any) => {
    toast.error(
      error.response?.data?.message || "Failed to restore combo",
    );
  },
});

  // 3. Subject CRUD Mutations (Tab All Subjects)
  const createSubjectMutation = useMutation({
    mutationFn: createSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-subjects"] });
      queryClient.invalidateQueries({ queryKey: ["admin-combos"] });
      toast.success(t("curriculum.subjectCreateSuccess", "Subject created successfully!"));
      setIsSingleSubjectDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t("curriculum.subjectCreateFailed", "Failed to create subject"));
    },
  });

  const updateSubjectMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: SubjectRequest }) =>
      updateSubject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-subjects"] });
      queryClient.invalidateQueries({ queryKey: ["admin-combos"] });
      toast.success(t("curriculum.subjectUpdateSuccess", "Subject updated successfully!"));
      setIsSingleSubjectDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t("curriculum.subjectUpdateFailed", "Failed to update subject"));
    },
  });

  const deleteSubjectMutation = useMutation({
    mutationFn: deleteSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-subjects"] });
      queryClient.invalidateQueries({ queryKey: ["admin-combos"] });
      toast.success(t("curriculum.subjectDeleteSuccess", "Subject deleted successfully!"));
      setDeleteConfirm(null);
      setSubjectDeleteConfirm(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t("curriculum.subjectDeleteFailed", "Failed to delete subject"));
    },
  });

  const restoreSubjectMutation = useMutation({
  mutationFn: restoreSubject,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["admin-subjects"] });
    queryClient.invalidateQueries({ queryKey: ["admin-combos"] });

    toast.success(t("curriculum.subjectRestoreSuccess", "Subject restored successfully!"));
  },
  onError: (error: any) => {
    toast.error(
      error.response?.data?.message || t("curriculum.subjectRestoreFailed", "Failed to restore subject"),
    );
  },
});

  // ==========================================
  // SAVING / DELETING ACTION DISPATCHERS
  // ==========================================

  const handleSemesterSubmit = (data: SemesterRequest) => {
    if (editingSemester) {
      updateSemesterMutation.mutate({
        id: editingSemester.semesterId,
        data,
      });
    } else {
      createSemesterMutation.mutate(data);
    }
  };

  const handleComboSubmit = (data: ComboSubjectRequest) => {
    if (editingCombo) {
      updateComboMutation.mutate({
        id: editingCombo.comboId,
        data,
      });
    } else {
      createComboMutation.mutate(data);
    }
  };

  const handleSubjectSubmit = (data: any) => {
    if (!editingSubject) return;
    const { combo, subject } = editingSubject;

    let updatedSubjects = [...combo.subjects];

    if (subject) {
      // Sửa môn học hiện có
      updatedSubjects = updatedSubjects.map((sub) => {
        if (
          (sub.subjectId && sub.subjectId === subject.subjectId) ||
          sub.subjectCode === subject.subjectCode
        ) {
          return {
            ...sub,
            ...data,
          };
        }
        return sub;
      });
    } else {
      // Thêm mới môn học
      updatedSubjects.push({
        ...data,
      });
    }

    updateComboMutation.mutate({
      id: combo.comboId,
      data: {
        comboCode: combo.comboCode,
        comboName: combo.comboName,
        subjects: updatedSubjects.map((sub) => ({
          subjectCode: sub.subjectCode,
          subjectName: sub.subjectName,
          description: sub.description || "",
          subjectType: sub.subjectType,
          semesterId: sub.semesterId,
        })),
      },
    });
  };

  const handleSubjectDelete = () => {
    if (!subjectDeleteConfirm) return;
    deleteSubjectMutation.mutate(subjectDeleteConfirm.subject.subjectId);

    // Lọc bỏ subject được xóa
  };

  const handleSingleSubjectSubmit = (data: SubjectRequest) => {
    if (editingSingleSubject) {
      updateSubjectMutation.mutate({
        id: editingSingleSubject.subjectId,
        data,
      });
    } else {
      createSubjectMutation.mutate(data);
    }
  };

  const handleDeleteConfirm = () => {
    if (!deleteConfirm) return;
    if (deleteConfirm.type === "semester") {
      deleteSemesterMutation.mutate(deleteConfirm.id);
    } else if (deleteConfirm.type === "combo") {
      deleteComboMutation.mutate(deleteConfirm.id);
    } else if (deleteConfirm.type === "subject") {
      deleteSubjectMutation.mutate(deleteConfirm.id);
    }
  };

  const isPendingSemester =
    createSemesterMutation.isPending || updateSemesterMutation.isPending;
  const isPendingCombo =
    createComboMutation.isPending || updateComboMutation.isPending;
  const isPendingDelete =
    deleteSemesterMutation.isPending || deleteComboMutation.isPending || deleteSubjectMutation.isPending;

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-10">
      {/* HEADER SECTION */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-primary">
            <BookOpen className="h-5 w-5" />
            {t("curriculum.dashboard", "Admin Dashboard")}
          </div>
          <h1 className="mt-2 text-4xl font-black text-card-foreground">
            {t("curriculum.title", "Curriculum Management")}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {t("curriculum.description", "Manage student learning semesters, core/combo subjects, and curriculum configurations.")}
          </p>
        </div>
      </div>

      {/* TABS CONTROL */}
      <div className="mb-6 flex border-b border-border">
        <button
          onClick={() => setActiveTab("semesters")}
          className={`flex cursor-pointer items-center gap-2 px-6 py-3.5 text-sm font-bold border-b-2 transition-all duration-300 ${
            activeTab === "semesters"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-card-foreground"
          }`}
        >
          <Layers className="h-4 w-4" />
          {t("curriculum.tabSemesters", "Semesters List")}
          <span className="ml-1.5 px-2 py-0.5 text-[10px] font-black rounded-full bg-secondary text-secondary-foreground border border-border">
            {semesters.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("combos")}
          className={`flex cursor-pointer items-center gap-2 px-6 py-3.5 text-sm font-bold border-b-2 transition-all duration-300 ${
            activeTab === "combos"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-card-foreground"
          }`}
        >
          <BookMarked className="h-4 w-4" />
          {t("curriculum.tabCombos", "Combo Subjects")}
          <span className="ml-1.5 px-2 py-0.5 text-[10px] font-black rounded-full bg-secondary text-secondary-foreground border border-border">
            {combos.filter((combo) => !combo.isDeleted).length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("subjects")}
          className={`flex cursor-pointer items-center gap-2 px-6 py-3.5 text-sm font-bold border-b-2 transition-all duration-300 ${
            activeTab === "subjects"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-card-foreground"
          }`}
        >
          <BookOpen className="h-4 w-4" />
          {t("curriculum.tabSubjects", "All Subjects")}
          <span className="ml-1.5 px-2 py-0.5 text-[10px] font-black rounded-full bg-secondary text-secondary-foreground border border-border">
            {subjects.filter((subject) => !subject.isDeleted).length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("deleted-subjects")}
          className={`flex cursor-pointer items-center gap-2 px-6 py-3.5 text-sm font-bold border-b-2 transition-all duration-300 ${
            activeTab === "deleted-subjects"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-card-foreground"
          }`}
        >
          <RotateCcw className="h-4 w-4" />
          {t("curriculum.tabDeleted", "Deleted History")}
          <span className="ml-1.5 px-2 py-0.5 text-[10px] font-black rounded-full bg-secondary text-secondary-foreground border border-border">
            {subjects.filter((subject) => subject.isDeleted).length +
              combos.filter((combo) => combo.isDeleted).length}
          </span>
        </button>
      </div>

      {/* CONTENT CARDS */}
      <Card className="rounded-3xl border border-border bg-card shadow-sm">
        <CardContent className="p-6">
          {activeTab === "semesters" ? (
            <SemesterTable
              semesters={semesters}
              isLoading={isLoadingSemesters}
              onAddClick={() => {
                setEditingSemester(null);
                setIsSemesterDialogOpen(true);
              }}
              onEditClick={(semester) => {
                setEditingSemester(semester);
                setIsSemesterDialogOpen(true);
              }}
              onDeleteClick={(id, identifier) => {
                setDeleteConfirm({ id, type: "semester", identifier });
              }}
            />
          ) : activeTab === "combos" ? (
            <ComboAccordion
              combos={activeCombos}
              isLoading={isLoadingCombos}
              searchKeyword={searchKeyword}
              onSearchChange={setSearchKeyword}
              onAddClick={() => {
                setEditingCombo(null);
                setIsComboDialogOpen(true);
              }}
              onEditClick={(combo) => {
                setEditingCombo(combo);
                setIsComboDialogOpen(true);
              }}
              onDeleteClick={(id, identifier) => {
                setDeleteConfirm({ id, type: "combo", identifier });
              }}
              onEditSubjectClick={(subject, combo) => {
                setEditingSubject({ subject, combo });
                setIsSubjectDialogOpen(true);
              }}
              onDeleteSubjectClick={(subject, combo) => {
                setSubjectDeleteConfirm({ subject, combo });
              }}
              onRestoreSubjectClick={(id) => {
                restoreSubjectMutation.mutate(id);
              }}
              onRestoreClick={(id) => {
                restoreComboMutation.mutate(id);
              }}
              onAddSubjectClick={(combo) => {
                setEditingSubject({ subject: null, combo });
                setIsSubjectDialogOpen(true);
              }}
              onManageSyllabusClick={(subject) => {
                setSelectedSyllabusSubject(subject);
                setIsSyllabusDialogOpen(true);
              }}
            />
          ) : activeTab === "subjects" ? (
            <SubjectTable
              subjects={activeSubjects}
              isLoading={isLoadingSubjects}
              searchKeyword={subjectSearchKeyword}
              onSearchChange={setSubjectSearchKeyword}
              onAddClick={() => {
                setEditingSingleSubject(null);
                setIsSingleSubjectDialogOpen(true);
              }}
              onEditClick={(subj) => {
                setEditingSingleSubject(subj);
                setIsSingleSubjectDialogOpen(true);
              }}
              onDeleteClick={(id, identifier) => {
                setDeleteConfirm({ id, type: "subject", identifier });
              }}
              onRestoreClick={(id) => {
                restoreSubjectMutation.mutate(id);
              }}
              onManageSyllabusClick={(subject) => {
                setSelectedSyllabusSubject(subject);
                setIsSyllabusDialogOpen(true);
              }}
            />
          ) : (
            <DeletedHistoryTable
              combos={deletedCombos}
              subjects={deletedSubjects}
              isLoading={isLoadingSubjects || isLoadingCombos}
              searchKeyword={deletedSubjectSearchKeyword}
              onSearchChange={setDeletedSubjectSearchKeyword}
              onRestoreCombo={(id) => {
                restoreComboMutation.mutate(id);
              }}
              onRestoreSubject={(id) => {
                restoreSubjectMutation.mutate(id);
              }}
              isRestoring={
                restoreSubjectMutation.isPending ||
                restoreComboMutation.isPending
              }
            />
          )}
        </CardContent>
      </Card>

      {/* DIALOGS */}
      <SemesterDialog
        isOpen={isSemesterDialogOpen}
        onOpenChange={setIsSemesterDialogOpen}
        editingSemester={editingSemester}
        onSubmit={handleSemesterSubmit}
        isPending={isPendingSemester}
      />

      <ComboDialog
        isOpen={isComboDialogOpen}
        onOpenChange={setIsComboDialogOpen}
        editingCombo={editingCombo}
        semesters={semesters}
        onSubmit={handleComboSubmit}
        isPending={isPendingCombo}
      />

      <DeleteConfirmDialog
        isOpen={!!deleteConfirm}
        onOpenChange={(v) => {
          if (!v) setDeleteConfirm(null);
        }}
        onConfirm={handleDeleteConfirm}
        isPending={isPendingDelete}
        type={deleteConfirm?.type || null}
        identifier={deleteConfirm?.identifier || ""}
      />

      <SubjectDialog
        isOpen={isSubjectDialogOpen}
        onOpenChange={setIsSubjectDialogOpen}
        editingSubject={editingSubject}
        semesters={semesters}
        onSubmit={handleSubjectSubmit}
        isPending={updateComboMutation.isPending}
      />

      <SubjectDialog
        isOpen={isSingleSubjectDialogOpen}
        onOpenChange={setIsSingleSubjectDialogOpen}
        editingSubject={editingSingleSubject ? { subject: editingSingleSubject } : null}
        semesters={semesters}
        onSubmit={handleSingleSubjectSubmit}
        isPending={createSubjectMutation.isPending || updateSubjectMutation.isPending}
      />

      <DeleteConfirmDialog
        isOpen={!!subjectDeleteConfirm}
        onOpenChange={(v) => {
          if (!v) setSubjectDeleteConfirm(null);
        }}
        onConfirm={handleSubjectDelete}
        isPending={updateComboMutation.isPending}
        type="subject"
        identifier={subjectDeleteConfirm?.subject.subjectCode || ""}
      />

      <SyllabusManageDialog
        isOpen={isSyllabusDialogOpen}
        onOpenChange={setIsSyllabusDialogOpen}
        subject={selectedSyllabusSubject}
      />
    </div>
  );
}

export default ManagementPage;
