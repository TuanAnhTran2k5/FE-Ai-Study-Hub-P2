import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "@/services/userService";
import { getMyDocuments } from "@/services/documentService";

// Import Dashboard views
import UserDashboard from "@/components/dashboard/UserDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton";

export default function DashboardPage() {
  // Fetch User Profile
  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["my-profile"],
    queryFn: getUserProfile,
  });

  // Fetch User Documents
  const { data: documents = [], isLoading: isDocsLoading } = useQuery({
    queryKey: ["my-documents"],
    queryFn: getMyDocuments,
  });

  if (isProfileLoading || isDocsLoading) {
    return <DashboardSkeleton />;
  }

  const user = profile;
  if (!user) return null;

  // Dispatch view based on User Role (AD = Admin, US = User / Student)
  if (user.role === "AD") {
    return <AdminDashboard user={user} documents={documents} />;
  }

  return <UserDashboard user={user} documents={documents} />;
}
