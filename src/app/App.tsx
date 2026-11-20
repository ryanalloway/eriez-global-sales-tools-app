import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import HomePage from "../pages/HomePage";
import ManualPage from "../pages/ManualPage";
import ProfilesPage from "../pages/ProfilesPage";
import ContoursPage from "../pages/ContoursPage";
import HelpPage from "../pages/HelpPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="gauss-force" element={<ManualPage />} />
          <Route path="magnet-profiles" element={<ProfilesPage />} />
          <Route path="contour-plots" element={<ContoursPage />} />
          <Route path="help" element={<HelpPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}