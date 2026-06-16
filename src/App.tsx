import React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./configs/router";
import { queryClient } from "./configs/queryClient";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from 'react-toastify';



function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <RouterProvider router={router} />
        {/* Thêm ToastContainer để hiển thị thông báo toast */}
        <ToastContainer />
      </Provider>
    </QueryClientProvider>
  );
}

export default App;
