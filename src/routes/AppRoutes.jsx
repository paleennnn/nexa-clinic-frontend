import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AppLayout from "../components/layout/AppLayout";
import LoginPage from "../pages/auth/LoginPage";
import PatientsListPage from "../pages/patients/PatientsListPage";
import MasterDataPage from "../pages/master-data/MasterDataPage";
import RegistrationsListPage from "../pages/registrations/RegistrationsListPage";
import QueueBoardPage from "../pages/queue/QueueBoardPage";
import ForbiddenPage from "../pages/ForbiddenPage";
import NotFoundPage from "../pages/NotFoundPage";
import { ROLES } from "../utils/roles";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forbidden" element={<ForbiddenPage />} />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/patients" replace />} />

        <Route
          path="/patients"
          element={
            <ProtectedRoute roles={[ROLES.ADMIN, ROLES.PETUGAS_PENDAFTARAN]}>
              <PatientsListPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/master-data"
          element={
            <ProtectedRoute roles={[ROLES.ADMIN]}>
              <MasterDataPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/registrations"
          element={
            <ProtectedRoute roles={[ROLES.ADMIN, ROLES.PETUGAS_PENDAFTARAN]}>
              <RegistrationsListPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/queue"
          element={
            <ProtectedRoute>
              <QueueBoardPage />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
