import { Bell } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const notifications = Array.from({ length: 20 }, (_, index) => ({
  id: index + 1,
  title: `Notification ${index + 1}`,
  description:
    "Your document has a new update. Click to view more details about this notification.",
}));

function NotificationBell() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative flex size-11 cursor-pointer items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm transition-all duration-300 hover:scale-105 hover:border-primary-hover hover:bg-primary-bg-hover hover:text-primary active:scale-95">
          <Bell className="size-5" />

          {notifications.length > 0 && (
            <span className="absolute -right-1 -top-1 flex size-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white shadow-md">
              {notifications.length > 9 ? "9+" : notifications.length}
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={12}
        className="w-[380px] overflow-hidden rounded-3xl border border-border bg-popover p-0 text-popover-foreground shadow-xl"
      >
        <div className="max-h-[420px] overflow-y-auto">
          {notifications.map((item) => (
            <div
              key={item.id}
              className="cursor-pointer border-b border-border px-5 py-4 transition-all duration-300 last:border-b-0 hover:bg-accent"
            >
              <h4 className="text-sm font-semibold text-card-foreground">
                {item.title}
              </h4>

              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default NotificationBell;

//API
// import { Bell } from "lucide-react";
// import { useQuery } from "@tanstack/react-query";
// import { useSelector } from "react-redux";

// import type { RootState } from "@/redux/store";
// import { getNotificationsByUserId } from "@/services/notificationService";

// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";

// function NotificationBell() {
//   const user = useSelector((state: RootState) => state.user);

//   const { data: notifications = [] } = useQuery({
//     queryKey: ["notifications", user?.id],
//     queryFn: () => getNotificationsByUserId(user.id),
//     enabled: !!user?.id,
//   });

//   const unreadCount = notifications.filter((item) => !item.isRead).length;

//   return (
//     <Popover>
//       <PopoverTrigger asChild>
//         <button className="relative flex size-11 cursor-pointer items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm transition-all duration-300 hover:scale-105 hover:border-primary-hover hover:bg-primary-bg-hover hover:text-primary active:scale-95">
//           <Bell className="size-5" />

//           {unreadCount > 0 && (
//             <span className="absolute -right-1 -top-1 flex size-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white shadow-md">
//               {unreadCount > 9 ? "9+" : unreadCount}
//             </span>
//           )}
//         </button>
//       </PopoverTrigger>

//       <PopoverContent
//         align="end"
//         sideOffset={12}
//         className="w-[380px] overflow-hidden rounded-3xl border border-border bg-popover p-0 text-popover-foreground shadow-xl"
//       >
//         <div className="max-h-[420px] overflow-y-auto">
//           {notifications.map((item) => (
//             <div
//               key={item.id}
//               className="cursor-pointer border-b border-border px-5 py-4 transition-all duration-300 last:border-b-0 hover:bg-accent"
//             >
//               <h4 className="text-sm font-semibold text-card-foreground">
//                 {item.title}
//               </h4>

//               <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
//                 {item.message}
//               </p>
//             </div>
//           ))}
//         </div>
//       </PopoverContent>
//     </Popover>
//   );
// }

// export default NotificationBell;