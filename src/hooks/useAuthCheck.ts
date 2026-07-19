import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { verifyToken } from "@/services/authService";
import { login, logout } from "@/redux/features/userSlice";
import type { RootState } from "@/redux/store";

export function useAuthCheck() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.user);
  const token = localStorage.getItem("accessToken");

  const { data, isLoading, isSuccess, isError } = useQuery({
    queryKey: ["verify-token", token],
    queryFn: () => {
      if (!token) return Promise.reject(new Error("No token found"));
      return verifyToken({ token });
    },
    enabled: !!token,
    retry: false,
    staleTime: 1000 * 60 * 10, // Coi như token hợp lệ trong 10 phút sau khi xác thực thành công
  });

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(login(data));
    }
  }, [isSuccess, data, dispatch]);

  useEffect(() => {
    if (isError && token) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("authUserId");
      dispatch(logout());
    }
  }, [isError, token, dispatch]);

  useEffect(() => {
    if (!token && currentUser) {
      dispatch(logout());
    }
  }, [token, currentUser, dispatch]);

  return {
    isChecking: !!token && isLoading,
    isAuthenticated: !!token && isSuccess,
    user: currentUser,
  };
}
