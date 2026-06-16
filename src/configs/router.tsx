import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import AuthLayout from "@/layouts/AuthLayout";
import MainLayout from "@/layouts/PublicLayout";
import { ROUTE } from "@/models/routePath";
import { createBrowserRouter } from "react-router-dom";
import DocumentsPage from "@/pages/DocumentsPage";
import UserLayout from "@/layouts/UserLayout";

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
        path: ROUTE.DOCUMENTS,
        element: <DocumentsPage />,
      },
    ],
  },
  {
    path: ROUTE.APP,
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
        element: <div> </div>,
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
    path: <div></div>,
  },
  // {
  //   name: "AI Chat",
  //   path: <div></div>,
  // },
  // {
  //   name: "Leaderboard",
  //   path: <div></div>,
  // },
];
