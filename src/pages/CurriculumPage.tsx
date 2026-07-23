import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { BookOpen, Layers, BookMarked } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import SemesterTable from "@/components/management/SemesterTable";
import ComboAccordion from "@/components/management/ComboAccordion";
import SubjectTable from "@/components/management/SubjectTable";

// Import types from curriculum.type to match component expectations
import type {
  SemesterResponse,
  ComboSubjectResponse,
  SubjectResponse,
} from "@/types/curriculum.type";

// Import API Services for normal users
import {
  getSemesters,
  getComboSubjects,
  getAllAcademicSubjects,
} from "@/services/academicService";

export default function CurriculumPage() {
  const { t } = useTranslation();

  // Active Tab state
  const [activeTab, setActiveTab] = useState<"semesters" | "combos" | "subjects">("semesters");
  
  // Search state
  const [searchKeyword, setSearchKeyword] = useState("");
  const [subjectSearchKeyword, setSubjectSearchKeyword] = useState("");

  // ==========================================
  // FETCHING DATA (React Query)
  // ==========================================
  
  // Get Semesters
  const { data: semesters = [], isLoading: isLoadingSemesters } = useQuery({
    queryKey: ["user-academic-semesters"],
    queryFn: async () => (await getSemesters()) as unknown as SemesterResponse[],
  });

  // Get Combo Subjects
  const { data: combos = [], isLoading: isLoadingCombos } = useQuery({
    queryKey: ["user-academic-combos"],
    queryFn: async () => (await getComboSubjects()) as unknown as ComboSubjectResponse[],
  });

  // Get All Subjects
  const { data: subjects = [], isLoading: isLoadingSubjects } = useQuery({
    queryKey: ["user-academic-subjects"],
    queryFn: async () => (await getAllAcademicSubjects()) as unknown as SubjectResponse[],
  });

  // ==========================================
  // SEARCH FILTERING (Read-only active items)
  // ==========================================
  const normalizedComboSearch = searchKeyword.trim().toLowerCase();
  const activeCombos = combos.filter(
    (combo) =>
      !combo.isDeleted &&
      (!normalizedComboSearch ||
        combo.comboCode.toLowerCase().includes(normalizedComboSearch) ||
        combo.comboName.toLowerCase().includes(normalizedComboSearch)),
  );

  const normalizedSubjectSearch = subjectSearchKeyword.trim().toLowerCase();
  const activeSubjects = subjects.filter(
    (subject) =>
      !subject.isDeleted &&
      (!normalizedSubjectSearch ||
        subject.subjectCode.toLowerCase().includes(normalizedSubjectSearch) ||
        subject.subjectName.toLowerCase().includes(normalizedSubjectSearch)),
  );

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-primary">
            <BookOpen className="h-5 w-5" />
            {t("sidebar.curriculum", "Curriculum")}
          </div>
          <h1 className="mt-2 text-4xl font-black text-card-foreground">
            {t("sidebar.curriculum", "Curriculum")}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {t(
              "curriculum.userDescription",
              "View the list of semesters, core subjects, and combo subjects of the training curriculum.",
            )}
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
            {activeCombos.length}
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
            {activeSubjects.length}
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
              readOnly={true}
            />
          ) : activeTab === "combos" ? (
            <ComboAccordion
              combos={activeCombos}
              isLoading={isLoadingCombos}
              searchKeyword={searchKeyword}
              onSearchChange={setSearchKeyword}
              readOnly={true}
            />
          ) : (
            <SubjectTable
              subjects={activeSubjects}
              isLoading={isLoadingSubjects}
              searchKeyword={subjectSearchKeyword}
              onSearchChange={setSubjectSearchKeyword}
              readOnly={true}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
