import api from "@/configs/api";
import type { LeaderboardUser } from "@/types/leaderboard.type";
import type { UserResponse } from "@/types/user.type";
import type { DocumentResponse } from "@/types/document.type";

function getRankTitle(score: number) {
  if (score >= 700) return "Elite Scholar";
  if (score >= 301) return "Gold Mentor";
  if (score >= 101) return "Silver Contributor";
  return "Bronze Student";
}

export const getLeaderboard = async (): Promise<LeaderboardUser[]> => {
  const [usersResponse, documentsResponse] = await Promise.all([
    api.get<UserResponse[]>("/users"),
    api.get<DocumentResponse[]>("/documents"),
  ]);

  const users = usersResponse.data;
  const documents = documentsResponse.data;

  return users
    .filter((user) => user.role === "USER" && user.status === "ACTIVE")
    .map((user) => {
      const userDocuments = documents.filter(
        (document) => String(document.ownerId) === String(user.id),
      );

      const totalDownloads = userDocuments.reduce(
        (sum, document) => sum + (document.downloadCount ?? 0),
        0,
      );

      const totalBookmarks = userDocuments.reduce(
        (sum, document) => sum + (document.bookmarkCount ?? 0),
        0,
      );

      return {
        id: user.id,
        rank: 0,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl,
        title: getRankTitle(user.totalScore ?? 0),
        points: user.totalScore ?? 0,
        documents: userDocuments.length,
        bookmarks: totalBookmarks,
        downloads: totalDownloads,
      };
    })
    .sort((a, b) => b.points - a.points)
    .map((user, index) => ({
      ...user,
      rank: index + 1,
    }));
};