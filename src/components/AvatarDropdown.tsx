import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AvatarFrame from "./avatarFrame/AvatarFrame";

import { ROUTE } from "@/models/routePath";
import type { User } from "@/models/user";
import { logout } from "@/redux/features/userSlice";
import { authLogout } from "@/services/authService";

import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

type AvatarDropdownProps = {
  user: User;
};

export function AvatarDropdown({ user }: AvatarDropdownProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const clearAuthAndRedirect = () => {
    localStorage.removeItem("accessToken");
    dispatch(logout());
    navigate(ROUTE.HOME);
  };

  const logoutMutation = useMutation<boolean, Error, { token: string }>({
    mutationFn: authLogout,

    onSuccess: () => {
      clearAuthAndRedirect();
    },

    onError: () => {
      clearAuthAndRedirect();
    },
  });

  const handleLogout = () => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      clearAuthAndRedirect();
      return;
    }

    logoutMutation.mutate({
      token: accessToken,
    });
  };

  const handleProfile = () => {
    navigate(`/${ROUTE.APP}/${ROUTE.PROFILE}`);
  };

  const handleSettings = () => {
    navigate(`/${ROUTE.APP}/${ROUTE.SETTINGS}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
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
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-40" align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem className=" cursor-pointer" onClick={handleProfile}>
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem
            className=" cursor-pointer"
            onClick={handleSettings}
          >
            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="text-destructive cursor-pointer"
          disabled={logoutMutation.isPending}
          onClick={handleLogout}
        >
          {logoutMutation.isPending ? "Logging out..." : "Log out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
