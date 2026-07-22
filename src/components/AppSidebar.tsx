import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ROUTE } from "@/models/routePath";
import type { User as AuthUser } from "@/models/user";
import type { RootState } from "@/redux/store";
import { getUnreadNotificationCount } from "@/services/notificationService";
import { logout } from "@/redux/features/userSlice";
import { authLogout } from "@/services/authService";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  LayoutDashboard,
  FileText,
  Users,
  Bot,
  Bookmark,
  Bell,
  Trophy,
  User,
  Settings,
  BookOpen,
  LogOut,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const menuItems = [
  {
    titleKey: "sidebar.myDocuments",
    url: ROUTE.MY_DOCUMENTS,
    icon: FileText,
  },
  {
    titleKey: "sidebar.community",
    url: ROUTE.COMMUNITY,
    icon: Users,
  },
  {
    titleKey: "sidebar.aiChat",
    url: ROUTE.AI_CHAT,
    icon: Bot,
  },
  {
    titleKey: "sidebar.bookmarks",
    url: ROUTE.BOOKMARKS,
    icon: Bookmark,
  },
  {
    titleKey: "sidebar.notifications",
    url: ROUTE.NOTIFICATIONS,
    icon: Bell,
  },
  {
    titleKey: "sidebar.leaderboard",
    url: ROUTE.LEADERBOARD,
    icon: Trophy,
  },
  {
    titleKey: "sidebar.profile",
    url: ROUTE.PROFILE,
    icon: User,
  },
  {
    titleKey: "sidebar.dashboard",
    url: ROUTE.DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    titleKey: "sidebar.settings",
    url: ROUTE.SETTINGS,
    icon: Settings,
  },
  {
    titleKey: "sidebar.curriculum",
    url: ROUTE.ADMIN_CURRICULUM,
    icon: BookOpen,
    isAdminOnly: true,
  },
  {
    titleKey: "sidebar.badges",
    url: ROUTE.ADMIN_BADGES,
    icon: Trophy,
    isAdminOnly: true,
  },
];

function AppSidebar() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const currentUser = useSelector(
    (state: RootState) => state.user as AuthUser | null,
  );

  const currentUserId = currentUser?.userId;

  const { data: unreadNotificationCount = 0 } = useQuery({
    queryKey: ["notifications", currentUserId, "sidebar-unread-count"],
    queryFn: getUnreadNotificationCount,
    enabled: !!currentUserId,
  });

  const clearAuthAndRedirect = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("authUserId");
    queryClient.clear();
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

  return (
    <Sidebar
      collapsible="icon"
      className="static h-full border-r border-sidebar-border bg-sidebar shadow-sm"
    >
      <SidebarHeader className="flex h-16 items-center justify-end border-b border-sidebar-border bg-sidebar px-4 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
        <SidebarTrigger className="flex size-10 items-center justify-center rounded-2xl border border-border bg-card text-primary shadow-sm transition-all duration-300 hover:scale-105 hover:bg-primary-bg-hover active:scale-95" />
      </SidebarHeader>

      <SidebarContent className="bg-sidebar px-4 py-5 text-sidebar-foreground group-data-[collapsible=icon]:px-0">
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu className="flex flex-col items-stretch gap-1 group-data-[collapsible=icon]:items-center">
              {menuItems
                .filter((item) => !item.isAdminOnly || currentUser?.role === "AD")
                .map((item) => {
                  const Icon = item.icon;
                const isActive = location.pathname === `/app/${item.url}`;
                const badge =
                  item.titleKey === "sidebar.notifications"
                    ? unreadNotificationCount
                    : 0;

                return (
                  <SidebarMenuItem
                    key={item.titleKey}
                    className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center"
                  >
                    <SidebarMenuButton asChild>
                      <Link
                        to={item.url}
                        className={`relative flex h-11 items-center gap-3 rounded-2xl px-4 text-[15px] font-semibold transition-all duration-300 group-data-[collapsible=icon]:size-13 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0 ${
                          isActive
                            ? "bg-primary text-primary-foreground shadow-md hover:bg-primary hover:text-primary-foreground"
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        }`}
                      >
                        <Icon className="size-6 shrink-0" />

                        <span className="truncate group-data-[collapsible=icon]:hidden">
                          {t(item.titleKey)}
                        </span>

                        {badge > 0 && (
                          <span className="ml-auto flex size-5 shrink-0 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white group-data-[collapsible=icon]:absolute group-data-[collapsible=icon]:right-1 group-data-[collapsible=icon]:top-1 group-data-[collapsible=icon]:size-3.5 group-data-[collapsible=icon]:text-[8px]">
                            {badge > 99 ? "99+" : badge}
                          </span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="bg-sidebar px-4 py-3 border-t border-sidebar-border group-data-[collapsible=icon]:px-0">
        <SidebarMenu>
          <SidebarMenuItem className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
            <SidebarMenuButton asChild>
              <button
                type="button"
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
                className="relative flex h-11 w-full items-center gap-3 rounded-2xl px-4 text-[15px] font-semibold text-red-500 transition-all duration-300 hover:!bg-red-500/10 hover:!text-red-500 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer group-data-[collapsible=icon]:size-13 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0"
              >
                <LogOut className="size-6 shrink-0" />
                <span className="truncate group-data-[collapsible=icon]:hidden">
                  {logoutMutation.isPending ? t("sidebar.loggingOut", "Logging out...") : t("sidebar.logout", "Log out")}
                </span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;