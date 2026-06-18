export interface LeaderboardUser {
  id: string;
  rank: number;
  fullName: string;
  avatarUrl: string;
  title: string;
  points: number;
  documents: number;
  bookmarks: number;
  downloads: number;
}