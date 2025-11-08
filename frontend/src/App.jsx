import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./Layout";
import ConnectionTest from "./components/ConnectionTest";

// Pages
import HomePage from "./pages/HomePage";
import UserAuth from "./pages/user/UserAuth";
import UserDashboard from "./pages/user/UserDashboard";
import ScheduleFirstDose from "./pages/user/ScheduleFirstDose";
import ScheduleNextDose from "./pages/user/ScheduleNextDose";
import StaffLogin from "./pages/staff/StaffLogin";
import StaffDashboard from "./pages/staff/StaffDashboard";
import AdminAuth from "./pages/admin/AdminAuth";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminReport from "./pages/admin/AdminReport";

const ProtectedRoute = ({ children, requireUser, requireStaff, requireAdmin }) => {
  const { user, staff, admin } = useAuth();

  if (requireUser && !user) return <Navigate to="/user/auth" replace />;
  if (requireStaff && !staff) return <Navigate to="/staff/login" replace />;
  if (requireAdmin && !admin) return <Navigate to="/admin/auth" replace />;

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Shared layout for all routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />

            {/* User Routes */}
            <Route path="user">
              <Route path="auth" element={<UserAuth />} />
              <Route
                path="dashboard"
                element={
                  <ProtectedRoute requireUser>
                    <UserDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="schedule-first"
                element={
                  <ProtectedRoute requireUser>
                    <ScheduleFirstDose />
                  </ProtectedRoute>
                }
              />
              <Route
                path="schedule-next"
                element={
                  <ProtectedRoute requireUser>
                    <ScheduleNextDose />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Staff Routes */}
            <Route path="staff">
              <Route path="login" element={<StaffLogin />} />
              <Route
                path="dashboard"
                element={
                  <ProtectedRoute requireStaff>
                    <StaffDashboard />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Admin Routes */}
            <Route path="admin">
              <Route path="auth" element={<AdminAuth />} />
              <Route
                path="dashboard"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="report"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminReport />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Route>
        </Routes>

        {/* Connection test stays outside */}
        <ConnectionTest />
      </Router>
    </AuthProvider>
  );
}

export default App;