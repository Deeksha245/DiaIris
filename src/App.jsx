import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

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

import { AuthProvider, useAuth } from "./context/AuthContext";

function Loading() {
return (
<div style={{ padding: "40px", color: "white" }}>
Loading... </div>
);
}

function UserRoute({ children }) {
const { user, loading } = useAuth();

if (loading) {
return <Loading />;
}

if (!user) {
return <Navigate to="/login" replace />;
}

if (user.role === "admin") {
return <Navigate to="/admin" replace />;
}

return children;
}

function AdminRoute({ children }) {
const { user, loading } = useAuth();

if (loading) {
return <Loading />;
}

if (!user) {
return <Navigate to="/login" replace />;
}

if (user.role !== "admin") {
return <Navigate to="/dashboard" replace />;
}

return children;
}

function DoctorRoute({ children }) {
const { user, loading } = useAuth();

if (loading) {
return <Loading />;
}

if (!user) {
return <Navigate to="/login" replace />;
}

if (user.role !== "admin" && user.role !== "doctor") {
return <Navigate to="/dashboard" replace />;
}

return children;
}

function App() {
return ( <AuthProvider> <BrowserRouter> <Navbar />

```
    <Routes>

      {/* PUBLIC */}

      <Route path="/" element={<Home />} />

      <Route path="/about" element={<About />} />

      <Route path="/login" element={<Login />} />

      <Route path="/signup" element={<Signup />} />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />


      {/* PATIENT */}

      <Route
        path="/dashboard"
        element={
          <UserRoute>
            <Dashboard />
          </UserRoute>
        }
      />

      <Route
        path="/detection"
        element={
          <UserRoute>
            <Detection />
          </UserRoute>
        }
      />

      <Route
        path="/history"
        element={
          <UserRoute>
            <History />
          </UserRoute>
        }
      />

      <Route
        path="/appointments"
        element={
          <UserRoute>
            <Appointments />
          </UserRoute>
        }
      />

      <Route
        path="/medications"
        element={
          <UserRoute>
            <Medications />
          </UserRoute>
        }
      />

      <Route
        path="/report/:id"
        element={
          <UserRoute>
            <Report />
          </UserRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <UserRoute>
            <Profile />
          </UserRoute>
        }
      />


      {/* ADMIN MAIN */}

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />


      {/* ADMIN PAGES */}

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


      {/* DOCTOR */}

      <Route
        path="/doctor"
        element={
          <DoctorRoute>
            <DoctorDashboard />
          </DoctorRoute>
        }
      />


      {/* UNKNOWN PAGE */}

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  </BrowserRouter>
</AuthProvider>


);
}

export default App
