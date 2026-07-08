import api from "@/configs/api";
import type { APIResponse } from "@/types/auth";
import { searchPublicDocuments } from "@/services/documentService";
import type { TopContributor, TrendingSubject } from "@/types/community.type";

const getApiResult = async <T>(url: string, params?: Record<string, unknown>): Promise<T> => {
  const response = await api.get<T | APIResponse<T>>(url, { params });
  const payload = response.data as T | APIResponse<T>;

  return (payload as APIResponse<T>).result ?? (payload as T);
};

export const getTrendingSubjects = async (): Promise<TrendingSubject[]> => {
  const documents = await searchPublicDocuments("");

  const subjectMap = new Map<string, TrendingSubject>();

  documents.forEach((document) => {
    const subjectKey = document.subjectName || document.subjectCode || `subject-${document.subjectId}`;
    const existing = subjectMap.get(subjectKey);

    if (existing) {
      existing.docCount += 1;
      return;
    }

    subjectMap.set(subjectKey, {
      code: document.subjectCode || `SBJ-${document.subjectId}`,
      name: document.subjectName || subjectKey,
      docCount: 1,
    });
  });

  return Array.from(subjectMap.values())
    .sort((a, b) => (b.docCount || 0) - (a.docCount || 0))
    .slice(0, 5);
};

export const getTopContributors = async (): Promise<TopContributor[]> => {
  const contributors = await getApiResult<Array<{
    userId?: number;
    fullName?: string;
    avatarUrl?: string;
    score?: number;
  }>>("/user/top-weekly", { limit: 10 });

  return (contributors || [])
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, 3)
    .map((contributor, index) => ({
      id: String(contributor.userId ?? index + 1),
      name: contributor.fullName || `User ${index + 1}`,
      avatar: contributor.avatarUrl || "",
      role: "Contributor",
      points: contributor.score || 0,
      rank: index + 1,
    }));
};