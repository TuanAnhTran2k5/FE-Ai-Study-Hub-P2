import { User } from "lucide-react";
import { useTranslation } from "react-i18next";

import EditProfileDialog from "@/components/profile/EditProfileDialog";
import type { UserResponse } from "@/types/user.type";

interface ProfileHeaderProps {
  user: UserResponse;
}

function ProfileHeader({ user }: ProfileHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div>
        <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-primary">
          <User className="h-5 w-5" />
          {t("profile.title", "My Profile")}
        </p>

        <h1 className="mt-2 text-4xl font-black text-card-foreground">
          {t("profile.personalInfo", "Personal Information")}
        </h1>

        <p className="mt-3 max-w-2xl text-muted-foreground">
          {t("profile.description", "Manage your account, cloud storage, reputation points, badges, and learning activity.")}
        </p>
      </div>

      <EditProfileDialog user={user} />
    </div>
  );
}

export default ProfileHeader;