import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App.tsx";
import Calender from "./pages/calender.tsx";
import Stamping from "./pages/stamping.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<App />} path="/" />
        <Route element={<Calender />} path="/calender" />
        <Route element={<Stamping />} path="/stamping" />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
