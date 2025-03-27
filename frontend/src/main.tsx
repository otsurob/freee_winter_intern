import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App.tsx";
import Calender from "./pages/calender.tsx";
import Stamping from "./pages/stamping.tsx";
import Owner from "./pages/owner.tsx";
import OnlineStamping from "./pages/onlineStamping.tsx";
import StampingHome from "./pages/stampingHome.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<App />} path="/" />
        <Route element={<OnlineStamping />} path="/stamping" />
        <Route element={<Calender />} path="/calender" />
        <Route element={<StampingHome />} path="/owner/stampingHome" />
        <Route element={<Stamping />} path="/owner/stamping" />
        <Route element={<Owner />} path="/owner" />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
