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
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { Toaster } from "@/components/ui/toaster";
import CheckWorkTime from "./pages/checkWorkTime.tsx";
import EditCalendar from "./pages/editCalender.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ChakraProvider value={defaultSystem}>
      <BrowserRouter>
        <Routes>
          <Route element={<App />} path="/" />
          <Route element={<OnlineStamping />} path="/stamping" />
          <Route element={<Calender />} path="/calender" />
          <Route element={<StampingHome />} path="/owner/stampingHome" />
          <Route element={<Stamping />} path="/owner/stamping" />
          <Route element={<Owner />} path="/owner" />
          <Route element={<CheckWorkTime />} path="/checkWorkTime" />
          <Route element={<EditCalendar />} path="/editCalender" />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </ChakraProvider>
  </StrictMode>
);
