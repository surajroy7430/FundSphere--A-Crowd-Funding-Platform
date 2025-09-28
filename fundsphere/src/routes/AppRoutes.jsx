import { Navigate, Route, Routes } from "react-router-dom";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import DashboardLayout from "../layouts/DashboardLayout";

import SigninPage from "../auth/signin/signin-page";
import SignupPage from "../auth/signup/signup-page";
import ForgotPassword from "../auth/password/forgot-password";
import ResetPassword from "../auth/password/reset-password";

import AdminDashboard from "../pages/extras/AdminDashboard";
import ModeratorDashboard from "../pages/extras/ModeratorDashboard";

import Dashboard from "../pages/dashboard/Dashboard";
import CreateCampaign from "../pages/dashboard/CreateCampaign";
import Payment from "../pages/dashboard/Payment";
import Profile from "../pages/extras/Profile";
import HelpCenter from "../pages/extras/HelpCenter";
import Notifications from "../components/notifications";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<SigninPage />} />
        <Route path="/register" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* Admin Specific Route */}
      <Route element={<PrivateRoute roles={["admin"]} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Route>
      </Route>
      {/* Moderator Specific Route */}
      <Route element={<PrivateRoute roles={["moderator"]} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/moderator-dashboard" element={<ModeratorDashboard />} />
        </Route>
      </Route>

      {/* Protected Routes */}
      <Route element={<PrivateRoute roles={["user", "moderator", "admin"]} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-campaign" element={<CreateCampaign />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/help-center" element={<HelpCenter />} />
          <Route path="/notifications" element={<Notifications />} />
        </Route>
      </Route>

      {/* Invalid Routes */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
