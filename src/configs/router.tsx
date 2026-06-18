import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import AuthLayout from "@/layouts/AuthLayout";
import MainLayout from "@/layouts/PublicLayout";
import { ROUTE } from "@/models/routePath";
import { createBrowserRouter } from "react-router-dom";
import UserLayout from "@/layouts/UserLayout";
import MyDocumentsPage from "@/pages/MyDocumentsPage";
import CommunityPage from "@/pages/CommunityPage";
import AIChatPage from "@/pages/AIChatPage";
import BookmarksPage from "@/pages/BookmarksPage";
import LeaderboardPage from "@/pages/LeaderboardPage";
import ProfilePage from "@/pages/ProfilePage";
import DocumentDetailPage from "@/pages/DocumentDetailPage";

export const router = createBrowserRouter([
  {
    path: ROUTE.AUTH,
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
    path: ROUTE.HOME,
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: ROUTE.COMMUNITY,
        element: <CommunityPage />,
      },
    ],
  },
  {
    path: ROUTE.APP,
    element: <UserLayout />,
    children: [
      {
        path: ROUTE.MY_DOCUMENTS,
        element: <MyDocumentsPage />,
      },
      {
        path: ROUTE.DOCUMENT_DETAIL,
        element: <DocumentDetailPage />,
      },
      {
        path: ROUTE.DASHBOARD,
        element: <div></div>,
      },
      {
        path: ROUTE.COMMUNITY,
        element: <CommunityPage />,
      },
      {
        path: ROUTE.AI_CHAT,
        element: <AIChatPage />,
      },
      {
        path: ROUTE.BOOKMARKS,
        element: <BookmarksPage />,
      },
      {
        path: ROUTE.NOTIFICATIONS,
        element: <div> </div>,
      },
      {
        path: ROUTE.LEADERBOARD,
        element: <LeaderboardPage />,
      },
      {
        path: ROUTE.PROFILE,
        element: <ProfilePage />,
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
    name: "Community",
    path: ROUTE.COMMUNITY,
  },
];
