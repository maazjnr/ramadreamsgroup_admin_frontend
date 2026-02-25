import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import CreatePropertyPage from "./pages/CreatePropertyPage";
import DashboardPage from "./pages/DashboardPage";
import EditPropertyPage from "./pages/EditPropertyPage";
import LoginPage from "./pages/LoginPage";

const App = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route element={<ProtectedRoute />}>
      <Route element={<Layout />}>
        <Route index element={<DashboardPage />} />
        <Route path="/properties/new" element={<CreatePropertyPage />} />
        <Route path="/properties/:id/edit" element={<EditPropertyPage />} />
      </Route>
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default App;
