import { Route, Routes } from "react-router-dom";
import { Home } from "../page/Home";
import { Register } from "../page/Register";
import { Admin } from "../page/Admin";
import { Private } from "../routes/Private";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/admin"
        element={
          <Private>
            <Admin />
          </Private>
        }
      />
    </Routes>
  );
}
