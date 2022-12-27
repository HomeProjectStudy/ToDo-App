import "react-toastify/dist/ReactToastify.css";
import { AppRoutes } from "./routes";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";

export function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
      <ToastContainer autoClose={3000} />
    </BrowserRouter>
  );
}
