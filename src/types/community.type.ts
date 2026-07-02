// NOTE TYPE: Dữ liệu cho card "Trending Subjects" ở sidebar Community.
// Backend nên trả code, tên môn và số tài liệu public thuộc môn đó.
export interface TrendingSubject {
  code: string;
  name: string;
  docCount: number;
}

// NOTE TYPE: Dữ liệu cho card "Top Contributors".
// rank có thể do backend trả hoặc được communityService tính lại sau khi sort.
export interface TopContributor {
  id: string;
  name: string;
  avatar: string;
  role: string;
  points: number;
  rank: number;
}
