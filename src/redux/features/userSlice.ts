import { createSlice } from "@reduxjs/toolkit";

//initialState
const initialState = null;
//1 slice, 1feature chứa những reducers của nó
//tạo ra 1 reducer cụ thể là tạo ra 1 Slice
export const userSlice = createSlice({
  name: "user",
  initialState, //initialState: initialState, viết tắt tên
  reducers: {
    login: (_, action) => action.payload,
    logout: () => null, //state = null
  },
});
export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
