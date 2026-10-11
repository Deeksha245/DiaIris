
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";


import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Detection from "./pages/Detection";
import History from "./pages/History";
import Appointments from "./pages/Appointments";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Report from "./pages/Report";
import Profile from "./pages/Profile";
import Medications from "./pages/Medications";
import DoctorDashboard from "./pages/DoctorDashboard";
import ForgotPassword from "./pages/ForgotPassword";

import AdminDashboard from "./pages/AdminDashboard";
import AdminPatients from "./pages/admin/Patients";
import AdminScreenings from "./pages/admin/Screenings";
import AdminAppointments from "./pages/admin/Appointments";
import AdminMedications from "./pages/admin/Medications";

// Require a signed-in user.
function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Allow only administrators.
function AdminRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

// Allow administrators and users with the doctor role.
function DoctorRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin" && user.role !== "doctor") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/history" element={<History />} />
<Route path="/report/:id" element={<Report />} />
        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        {/* Shared pages for signed-in patients and admins */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/detection"
          element={
            <ProtectedRoute>
              <Detection />
            </ProtectedRoute>
          }
        />

        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }
        />

        <Route
          path="/appointments"
          element={
            <ProtectedRoute>
              <Appointments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/medications"
          element={
            <ProtectedRoute>
              <Medications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/report"
          element={
            <ProtectedRoute>
              <Report />
            </ProtectedRoute>
          }
        />

        {/* Admin-only pages */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/patients"
          element={
            <AdminRoute>
              <AdminPatients />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/screenings"
          element={
            <AdminRoute>
              <AdminScreenings />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/appointments"
          element={
            <AdminRoute>
              <AdminAppointments />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/medications"
          element={
            <AdminRoute>
              <AdminMedications />
            </AdminRoute>
          }
        />

        {/* Doctor-only dashboard; admins may also access it */}
        <Route
          path="/doctor"
          element={
            <DoctorRoute>
              <DoctorDashboard />
            </DoctorRoute>
          }
        />

        {/* Unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
