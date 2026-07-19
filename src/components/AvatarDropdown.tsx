import { Button } from "@/components/ui/button";
import AvatarFrame from "./avatarFrame/AvatarFrame";
import { ROUTE } from "@/models/routePath";
import type { User } from "@/models/user";
import { useNavigate } from "react-router-dom";

type AvatarDropdownProps = {
  user: User;
};

export function AvatarDropdown({ user }: AvatarDropdownProps) {
  const navigate = useNavigate();

  const handleProfile = () => {
    navigate(`/${ROUTE.APP}/${ROUTE.PROFILE}`);
  };

  return (
    <Button
      variant="ghost"
      onClick={handleProfile}
      className="flex h-11 cursor-pointer items-center gap-3 rounded-full px-3 hover:bg-accent"
    >
      <AvatarFrame
        score={user.totalScore ?? 0}
        avatarUrl={user.avatarUrl}
        fullName={user.fullName}
        size="sm"
        isOnline={!!localStorage.getItem("accessToken")}
      />

      <span className="max-w-[130px] truncate text-sm font-semibold text-foreground">
        {user.fullName}
      </span>
    </Button>
  );
}
