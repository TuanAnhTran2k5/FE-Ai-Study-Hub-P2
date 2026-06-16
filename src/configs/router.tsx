import { ROUTE } from "@/models/routePath";
import { createBrowserRouter } from "react-router-dom";
import UserLayout from "@/layouts/UserLayout";
import MainLayout from "@/layouts/PublicLayout";
import AuthLayout from "@/layouts/AuthLayout";
import HomePage from "@/pages/HomePage";
import DocumentsPage from "@/pages/DocumentsPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import CommunityPage from "@/pages/CommunityPage";

export const router = createBrowserRouter([
  {
    path: ROUTE.HOME,
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: ROUTE.DOCUMENTS,
        element: <DocumentsPage />,
      },
    ],
  },
  {
    path: `/${ROUTE.AUTH}`,
    element: <AuthLayout />,
    children: [
      {
        path: ROUTE.LOGIN,
        element: <LoginPage />,
      },
      {
        path: ROUTE.REGISTER,
        element: <RegisterPage />,
      },
    ],
  },
  {
    path: `/${ROUTE.APP}`,
    element: <UserLayout />,
    children: [
      {
        index: true,
        element: <div> </div>,
      },
      {
        path: ROUTE.DASHBOARD,
        element: <div> </div>,
      },
      {
        path: ROUTE.MY_DOCUMENTS,
        element: <div> </div>,
      },
      {
        path: ROUTE.UPLOAD_DOCUMENT,
        element: <div> </div>,
      },
      {
        path: ROUTE.COMMUNITY,
        element: <CommunityPage />,
      },
      {
        path: ROUTE.AI_CHAT,
        element: <div> </div>,
      },
      {
        path: ROUTE.BOOKMARKS,
        element: <div> </div>,
      },
      {
        path: ROUTE.NOTIFICATIONS,
        element: <div> </div>,
      },
      {
        path: ROUTE.LEADERBOARD,
        element: <div> </div>,
      },
      {
        path: ROUTE.PROFILE,
        element: <div> </div>,
      },
      {
        path: ROUTE.SETTINGS,
        element: <div> </div>,
      },
    ],
  },
]);

export const NAVIGATE_KEY = [
  {
    name: "Home",
    path: ROUTE.HOME,
  },
  {
    name: "Document",
    path: ROUTE.DOCUMENTS,
  },
  {
    name: "Community",
    path: ROUTE.COMMUNITY,
  },
  // {
  //   name: "AI Chat",
  //   path: ROUTE.AI_CHAT,
  // },
  // {
  //   name: "Leaderboard",
  //   path: ROUTE.LEADERBOARD,
  // },
];
