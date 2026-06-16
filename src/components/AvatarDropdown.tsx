import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/redux/features/userSlice";
import type { User } from "@/models/user";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ROUTE } from "@/models/routePath";

type AvatarDropdownProps = {
  user: User;
};

export function AvatarDropdown({ user }: AvatarDropdownProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(logout());
    navigate(ROUTE.HOME);
  };

  const fallbackName = user.fullName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className=" cursor-pointer flex h-11 items-center gap-3 rounded-full px-3 hover:bg-accent"
        >
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.avatarUrl} alt={user.fullName} />
            <AvatarFallback>{fallbackName}</AvatarFallback>
             <AvatarBadge className="w-3 h-3 bg-success" />
          </Avatar>

          <span className="max-w-[130px] truncate text-sm font-semibold text-foreground">
            {user.fullName}
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-40" align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="text-destructive" onClick={handleLogout}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
