import storage from "redux-persist/es/storage"; // defaults to localStorage for web ***note: đổi đường dẫn lib thành es
import rootReducer from "./rootReducer";
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from "redux-persist";
import { configureStore } from "@reduxjs/toolkit";

//bước đầu import reducer VD: file có chữ Slice cuối cùng : couterSlice.ts
//xóa dấu ngoặc nhọn để nó biến thằng 1 object Reducer<State>

// export const store = configureStore({
//   reducer: {
//     counter: counterSlice, //reducer, feature
//     user: userSlice, //user phải trùng với tên name nằm trong userSlice
//   },
// });

//persistConfig nó sẽ lưu vào localStorage với key là root, VD value của counter là 8 thi ở trong localStorage sẽ có 1 key là root và value là 1 object có counter: 8

const persistConfig = {
  key: "root",
  storage, //storage: là nơi lưu trữ dữ liệu, mặc định là localStorage
};
//bọc reducer vào trong persistedReducer: lý do bọc để khi f5 không mất dữ liệu, nó để dữ liệu vào trong localStorage
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),

});

export const persistor = persistStore(store);
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
//mặc định store của anh khi f5 là mất hết dữ liệu
//redux-persist: nâng cấp store của anh lên thành 1 store khi mà anh f5 lại trang dữ liệu trong store không bị mất
