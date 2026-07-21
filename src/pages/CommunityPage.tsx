import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { AuthenticatedCommunity } from "@/components/community/AuthenticatedCommunity";
import { GuestCommunity } from "@/components/community/GuestCommunity";
import { ROUTE } from "@/models/routePath";
import type { User } from "@/models/user";
import type { RootState } from "@/redux/store";
import { getAllAcademicSubjects } from "@/services/academicService";
import { searchPublicDocuments } from "@/services/documentService";
import type { SubjectResponse } from "@/types/academic.type";

function CommunityPage() {
  const navigate = useNavigate();

  // Retrieve current user
  const currentUser = useSelector(
    (state: RootState) => state.user as User | null,
  );

  const accessToken = localStorage.getItem("accessToken");
  const authUserId =
    currentUser?.userId != null
      ? String(currentUser.userId)
      : localStorage.getItem("authUserId");
  const isAuthenticated = !!accessToken || !!currentUser?.userId;

  // Fetch public documents from backend
  const {
    data: documents = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      "publicDocuments",
      isAuthenticated ? (authUserId ?? "current-user") : "guest",
    ],
    queryFn: () => searchPublicDocuments(""),
  });

  // Fetch academic subjects from backend
  const { data: academicSubjects = [] } = useQuery({
    queryKey: ["communityAcademicSubjects", authUserId ?? "current-user"],
    queryFn: getAllAcademicSubjects,
  });

  // Map subjectId -> subject for document mapping
  const subjectMap = useMemo(() => {
    return new Map<number, SubjectResponse>(
      academicSubjects.map((subject) => [subject.subjectId, subject]),
    );
  }, [academicSubjects]);

  // Hydrate documents with subject details
  const hydratedDocuments = useMemo(() => {
    return documents
      .filter((document) => !document.moderationStatus || document.moderationStatus === "NORMAL")
      .map((document) => {
        const subject = subjectMap.get(document.subjectId);

        return {
          ...document,
          subjectCode: document.subjectCode ?? subject?.subjectCode,
          subjectName: document.subjectName ?? subject?.subjectName,
          semesterNo: document.semesterNo ?? subject?.semesterNo ?? null,
          comboCode: document.comboCode ?? subject?.comboCode ?? null,
          comboName: document.comboName ?? subject?.comboName ?? null,
        };
      });
  }, [documents, subjectMap]);

  // Handle document viewing and redirection
  const handleViewDocument = (documentId: number) => {
    if (!isAuthenticated) {
      navigate(`/${ROUTE.AUTH}/${ROUTE.LOGIN}`);
      return;
    }

    const selectedDocument = hydratedDocuments.find(
      (document) => document.documentId === documentId,
    );
    const isMyDocument =
      Number(selectedDocument?.ownerId) === Number(currentUser?.userId);

    navigate(
      `/${ROUTE.APP}/${isMyDocument ? ROUTE.MY_DOCUMENTS : ROUTE.COMMUNITY}/${documentId}`,
    );
  };

  if (isLoading) {
    return <div className="p-10 text-muted-foreground">Loading...</div>;
  }

  if (isError) {
    return <div className="p-10 text-destructive">Failed to load data</div>;
  }

  if (!isAuthenticated) {
    return (
      <GuestCommunity
        documents={hydratedDocuments}
        academicSubjects={academicSubjects}
        onViewDocument={handleViewDocument}
      />
    );
  }

  return (
    <AuthenticatedCommunity
      documents={hydratedDocuments}
      academicSubjects={academicSubjects}
      onViewDocument={handleViewDocument}
    />
  );
}

export default CommunityPage;
