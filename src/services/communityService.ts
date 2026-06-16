import axios from "axios";
import type {
  TopContributor,
  TrendingSubject,
} from "@/types/community.type";

const API_URL = import.meta.env.VITE_COMMUNITY_API_URL || import.meta.env.VITE_API_URL;

export const getTrendingSubjects = async (): Promise<TrendingSubject[]> => {
  const response = await axios.get<TrendingSubject[]>(
    `${API_URL}/trending-subjects`
  );
  
  const subjects = response.data || [];
  return subjects
    .sort((a, b) => (b.docCount || 0) - (a.docCount || 0))
    .slice(0, 5);
};

export const getTopContributors = async (): Promise<TopContributor[]> => {
  const response = await axios.get<TopContributor[]>(
    `${API_URL}/top-contributors`
  );
  
  const contributors = response.data || [];
  return contributors
    .sort((a, b) => (b.points || 0) - (a.points || 0))
    .slice(0, 3)
    .map((contributor, index) => ({
      ...contributor,
      rank: index + 1,
    }));
};
