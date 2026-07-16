import { createSlice } from "@reduxjs/toolkit";
import type { UserResponse } from "@/types/user.type";

// Dữ liệu user ban đầu.
// Khi chưa đăng nhập => null
const initialState: UserResponse | null = null;

// User Slice: quản lý thông tin người dùng trong Redux
export const userSlice = createSlice({
  name: "user",
  initialState: initialState as UserResponse | null,

  reducers: {
    // Lưu toàn bộ thông tin user vào Redux sau khi login
    login: (_, action) => action.payload,

    // Cập nhật profile sau khi gọi API thành công
    // Giữ lại accessToken để không bị mất phiên đăng nhập
    updateProfile: (state, action) => {
      const currentState = state as UserResponse | null;
      if (!currentState) return action.payload;

      return {
        ...currentState,
        ...action.payload,
        accessToken: currentState.accessToken,
      };
    },

    // Xóa thông tin user khi logout
    logout: () => null,
  },
});

export const { login, updateProfile, logout } = userSlice.actions;
export default userSlice.reducer;