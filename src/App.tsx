import { RouterProvider } from "react-router-dom";
import { router } from "./configs/router";
import { queryClient } from "./configs/queryClient";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from 'react-toastify';
import AuthInit from "@/components/auth/AuthInit";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <AuthInit>
          <RouterProvider router={router} />
        </AuthInit>
        {/* Thêm ToastContainer để hiển thị thông báo toast */}
        <ToastContainer />
      </Provider>
    </QueryClientProvider>
  );
}

export default App;
