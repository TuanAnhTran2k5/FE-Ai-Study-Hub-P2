import type { TopContributor, TrendingSubject } from "@/types/community.type";
import axios from "axios";


// NOTE CONFIG: Community đang có thể dùng API riêng qua VITE_COMMUNITY_API_URL.
// Nếu không khai báo biến này thì fallback về VITE_API_URL chung của hệ thống.
const API_URL = import.meta.env.VITE_COMMUNITY_API_URL || import.meta.env.VITE_API_URL;

// NOTE API: Lấy danh sách môn học đang phổ biến trong Community.
// Service sẽ sort theo docCount giảm dần và chỉ lấy 5 môn đầu để sidebar gọn.
export const getTrendingSubjects = async (): Promise<TrendingSubject[]> => {
  const response = await axios.get<TrendingSubject[]>(
    `${API_URL}/trending-subjects`
  );
  
  const subjects = response.data || [];
  return subjects
    .sort((a, b) => (b.docCount || 0) - (a.docCount || 0))
    .slice(0, 5);
};

// NOTE API: Lấy danh sách user đóng góp nhiều nhất.
// Service tự gắn rank 1,2,3 sau khi sort để component không phải xử lý logic này.
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
