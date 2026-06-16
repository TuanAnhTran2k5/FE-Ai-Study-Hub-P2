import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import AuthLayout from "@/layouts/AuthLayout";
import MainLayout from "@/layouts/MainLayout";
import { ROUTE } from "@/models/routePath";
import { createBrowserRouter } from "react-router-dom";
import DocumentsPage from "@/pages/DocumentsPage";

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
        path: "",
        element: <HomePage />,
      },
      {
        path: ROUTE.DOCUMENTS,
        element: <DocumentsPage />,
      },
    ],
  },
]);

export const NAVIGATE_KEY = [
  {
    name: "Document",
    path: ROUTE.DOCUMENTS,
  },
  {
    name: "Community",
    path: <div></div>,
  },
  {
    name: "AI Chat",
    path: <div></div>,
  },
  {
    name: "Leaderboard",
    path: <div></div>,
  },
];

// export const NAVIGATE_KEY = [
//   {
//     name: "Document",
//     path: "/documents",
//   },
//   {
//     name: "Community",
//     path: "/community",
//   },
//   {
//     name: "AI Chat",
//     path: "/chat",
//   },
//   {
//     name: "Leaderboard",
//     path: "/leaderboard",
//   },
// ];
