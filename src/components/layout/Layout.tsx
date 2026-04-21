import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import AppRoutes from "@/routes/AppRoutes";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="*" element={<AppRoutes />} />
  )
);
