import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import AuthLayout from "@/layouts/AuthLayout";
import PublicLayout from "@/layouts/PublicLayout";
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
import NotificationPage from "@/pages/NotificationPage";
import NotificationDetailPage from "@/pages/NotificationDetailPage";
import VerifyOtpForm from "@/components/auth/VerifyOtpForm";
import RegisterForm from "@/components/auth/RegisterForm";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import ForgotPasswordVerifyOtpForm from "@/components/auth/ForgotPasswordVerifyOtpForm";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import SettingsPage from "@/pages/SettingsPage";

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
        path: ROUTE.FORGOT_PASSWORD,
        element: <ForgotPasswordPage />,
        children: [
          {
            index: true,
            element: <ForgotPasswordForm />,
          },
          {
            path: ROUTE.FORGOT_PASSWORD_VERIFY_OTP,
            element: <ForgotPasswordVerifyOtpForm />,
          },
          {
            path: ROUTE.FORGOT_PASSWORD_RESET,
            element: <ResetPasswordForm />,
          },
        ],
      },
      {
        path: ROUTE.REGISTER,
        element: <RegisterPage />,
        children: [
          {
            index: true,
            element: <RegisterForm />,
          },
          {
            path: ROUTE.VERIFY_OTP,
            element: <VerifyOtpForm />,
          },
        ],
      },
    ],
  },
  {
    path: ROUTE.HOME,
    element: <PublicLayout />,
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
        path: ROUTE.COMMUNITY_DETAIL,
        element: <DocumentDetailPage />,
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
        element: <NotificationPage />,
      },
      {
        path: ROUTE.NOTIFICATION_DETAIL,
        element: <NotificationDetailPage />,
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
        element: <SettingsPage />,
      },
    ],
  },
]);

export const NAVIGATE_KEY = [
  {
    nameKey: "nav.home",
    path: ROUTE.HOME,
  },
  {
    nameKey: "nav.community",
    path: ROUTE.COMMUNITY,
  },
];
