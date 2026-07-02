import {
  Sidebar,
  SidebarContent,
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
import { useQuery } from "@tanstack/react-query";

import {
  LayoutDashboard,
  FileText,
  Users,
  Bot,
  Bookmark,
  Bell,
  Trophy,
  User as UserIcon,
  Settings,
} from "lucide-react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  {
    title: "My Documents",
    url: ROUTE.MY_DOCUMENTS,
    icon: FileText,
  },
  {
    title: "Community",
    url: ROUTE.COMMUNITY,
    icon: Users,
  },
  {
    title: "AI Chat",
    url: ROUTE.AI_CHAT,
    icon: Bot,
  },
  {
    title: "Bookmarks",
    url: ROUTE.BOOKMARKS,
    icon: Bookmark,
  },
  {
    title: "Notifications",
    url: ROUTE.NOTIFICATIONS,
    icon: Bell,
  },
  {
    title: "Leaderboard",
    url: ROUTE.LEADERBOARD,
    icon: Trophy,
  },
  {
    title: "Profile",
    url: ROUTE.PROFILE,
    icon: UserIcon,
  },
  {
    title: "Dashboard",
    url: ROUTE.DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    title: "Settings",
    url: ROUTE.SETTINGS,
    icon: Settings,
  },
];

function AppSidebar() {
  const location = useLocation();
  const currentUser = useSelector(
    (state: RootState) => state.user as AuthUser | null,
  );
  const currentUserId = currentUser?.userId;

  // NOTE API: Badge Notifications lay so unread that tu backend.
  // Khong hard-code so 3 nua, va query key co userId de tranh hien cache cua account cu.
  const { data: unreadNotificationCount = 0 } = useQuery({
    queryKey: ["notifications", currentUserId, "unread-count"],
    queryFn: getUnreadNotificationCount,
    enabled: !!currentUserId,
  });

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
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname.startsWith(
                  `/app/${item.url}`,
                );
                const badge =
                  item.url === ROUTE.NOTIFICATIONS
                    ? unreadNotificationCount
                    : 0;

                return (
                  <SidebarMenuItem
                    key={item.title}
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
                          {item.title}
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
    </Sidebar>
  );
}

export default AppSidebar;
