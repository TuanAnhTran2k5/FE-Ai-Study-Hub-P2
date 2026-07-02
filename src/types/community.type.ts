export interface TrendingSubject {
  code: string;
  name: string;
  docCount: number;
}

export interface TopContributor {
  id: string;
  name: string;
  avatar: string;
  role: string;
  points: number;
  rank: number;
}