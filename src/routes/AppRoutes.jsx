import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AppLayout from "../components/layout/AppLayout";
import Spinner from "../components/ui/Spinner";
import { ROLES } from "../utils/roles";

const LoginPage = lazy(() => import("../pages/auth/LoginPage"));
const PatientsListPage = lazy(() => import("../pages/patients/PatientsListPage"));
const MasterDataPage = lazy(() => import("../pages/master-data/MasterDataPage"));
const RegistrationsListPage = lazy(() => import("../pages/registrations/RegistrationsListPage"));
const QueueBoardPage = lazy(() => import("../pages/queue/QueueBoardPage"));
const ExamQueuePage = lazy(() => import("../pages/exams/ExamQueuePage"));
const ForbiddenPage = lazy(() => import("../pages/ForbiddenPage"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));

function PageFallback() {
  return (
    <div className="flex h-full items-center justify-center py-20">
      <Spinner label="Memuat halaman..." />
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageFallback />}>
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

          <Route
            path="/exams"
            element={
              <ProtectedRoute roles={[ROLES.DOKTER]}>
                <ExamQueuePage />
              </ProtectedRoute>
            }
          />

          {/* Dashboard menyusul. */}
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
