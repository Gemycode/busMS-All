import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import { useDispatch } from "react-redux";
import React, { useEffect, useState } from 'react';
import { loadUserFromStorage } from './redux/userSlice';
import Header from "./components/Header"
import Footer from "./components/Footer"
import Home from "./pages/Home"
import About from "./pages/About"
import Features from "./pages/Features"
import Users from "./pages/Users"
import Contact from "./pages/Contact"
import Login from "./pages/Login"
import RegisterParent from "./pages/RegisterParent"
import LoginDriver from "./pages/LoginDriver"
import AdminLogin from "./pages/AdminLogin"
import DriverProfile from "./pages/DriverProfile"
import ParentProfile from "./pages/ParentProfile"
import AdminDashboard from "./pages/AdminDashboard"
import ManagerDashboard from "./pages/ManagerDashboard"
import DriverDashboard from "./pages/DriverDashboard"
import UserDashboard from "./pages/UserDashboard"
import ParentDashboard from "./pages/ParentDashboard"
import BookingPage from "./pages/BookingPage"
import BookingConfirmation from "./pages/BookingConfirmation"
import NotificationsPage from "./pages/NotificationsPage"
import MapView from "./pages/MapView"
import Reports from "./pages/Reports"
import Settings from "./pages/Settings"
import Help from "./pages/Help"
import RouteGuard from './components/RouteGuard'
import Profile from "./pages/Profile"
import BookingsPage from './pages/BookingsPage'
import AdminBookings from './pages/AdminBookings'
import BookingReports from './pages/BookingReports'
import DriverReports from './pages/DriverReports'
import AttendanceManagement from "./pages/AttendanceManagement"
import AdminUsers from "./pages/AdminUsers";
import AdminBuses from "./pages/AdminBuses";
import AdminRoutes from "./pages/AdminRoutes";
import RedirectIfAuthenticated from "./components/RedirectIfAuthenticated";
import OffCanvasLayout from "./layouts/OffCanvasLayout";
import AdminTrips from "./pages/AdminTrips";

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

useEffect(() => {
  dispatch(loadUserFromStorage());
}, [dispatch]);

// Check if current path is a dashboard page
const isDashboardPage = () => {
  const dashboardPaths = [
    '/admin-dashboard',
    '/manager-dashboard', 
    '/driver-dashboard',
    '/dashboard/user',
    '/dashboard/parent',
    '/admin/users',
    '/admin/buses',
    '/admin/routes',
    '/admin/reports',
    '/admin/bookings',
    '/admin/booking-reports',
    '/admin/driver-reports',
    '/attendance',
    '/profile',
    '/bookings',
    '/booking',
    '/notifications',
    '/map-view',
    '/reports',
    '/settings',
    '/help',
    '/driver-profile',
    '/parent-profile',
    '/admin/trips'
  ];
  return dashboardPaths.some(path => location.pathname.startsWith(path));
};

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header and Footer للصفحات العامة فقط */}
      {!isDashboardPage() && <Header />}
      <Routes>
        {/* صفحات الأدمن داخل OffCanvasLayout */}
        <Route element={<OffCanvasLayout />}>
          <Route path="/admin-dashboard" element={
            <RouteGuard allowedRoles={["admin", "manager"]}>
              <AdminDashboard />
            </RouteGuard>
          } />
          <Route path="/admin/users" element={
            <RouteGuard allowedRoles={["admin", "manager"]}>
              <AdminUsers />
            </RouteGuard>
          } />
          <Route path="/admin/buses" element={
            <RouteGuard allowedRoles={["admin", "manager"]}>
              <AdminBuses />
            </RouteGuard>
          } />
          <Route path="/admin/routes" element={
            <RouteGuard allowedRoles={["admin", "manager"]}>
              <AdminRoutes />
            </RouteGuard>
          } />
          <Route path="/admin/reports" element={
            <RouteGuard allowedRoles={["admin", "manager"]}>
              <Reports />
            </RouteGuard>
          } />
          <Route path="/manager-dashboard" element={
            <RouteGuard allowedRoles={["admin", "manager"]}>
              <ManagerDashboard />
            </RouteGuard>
          } />
          <Route path="/driver-dashboard" element={
            <RouteGuard allowedRoles={["driver"]}>
              <DriverDashboard />
            </RouteGuard>
          } />
          <Route path="/dashboard/user" element={
            <RouteGuard allowedRoles={["user"]}>
              <UserDashboard />
            </RouteGuard>
          } />
          <Route path="/dashboard/parent" element={
            <RouteGuard allowedRoles={["parent"]}>
              <ParentDashboard />
            </RouteGuard>
          } />
          <Route path="/profile" element={
            <RouteGuard allowedRoles={["admin", "manager", "driver", "parent", "user"]}>
              <Profile />
            </RouteGuard>
          } />
          <Route path="/bookings" element={
            <RouteGuard allowedRoles={["user", "parent"]}>
              <BookingsPage />
            </RouteGuard>
          } />
          <Route path="/booking" element={
            <RouteGuard allowedRoles={["user", "parent"]}>
              <BookingPage />
            </RouteGuard>
          } />
          <Route path="/admin/bookings" element={
            <RouteGuard allowedRoles={["admin", "manager"]}>
              <AdminBookings />
            </RouteGuard>
          } />
          <Route path="/admin/booking-reports" element={
            <RouteGuard allowedRoles={["admin", "manager"]}>
              <BookingReports />
            </RouteGuard>
          } />
          <Route path="/admin/driver-reports" element={
            <RouteGuard allowedRoles={["admin", "manager"]}>
              <DriverReports />
            </RouteGuard>
          } />
          <Route path="/attendance" element={
            <RouteGuard allowedRoles={["admin", "manager"]}>
              <AttendanceManagement />
            </RouteGuard>
          } />
          <Route path="/notifications" element={
            <RouteGuard allowedRoles={["admin", "manager", "driver", "parent", "user"]}>
              <NotificationsPage />
            </RouteGuard>
          } />
          <Route path="/map-view" element={
            <RouteGuard allowedRoles={["admin", "manager", "driver", "parent", "user"]}>
              <MapView />
            </RouteGuard>
          } />
          <Route path="/reports" element={
            <RouteGuard allowedRoles={["admin", "manager", "driver", "parent", "user"]}>
              <Reports />
            </RouteGuard>
          } />
          <Route path="/settings" element={
            <RouteGuard allowedRoles={["admin", "manager", "driver", "parent", "user"]}>
              <Settings />
            </RouteGuard>
          } />
          <Route path="/help" element={
            <RouteGuard allowedRoles={["admin", "manager", "driver", "parent", "user"]}>
              <Help />
            </RouteGuard>
          } />
          <Route path="/driver-profile" element={
            <RouteGuard allowedRoles={["driver"]}>
              <DriverProfile />
            </RouteGuard>
          } />
          <Route path="/parent-profile" element={
            <RouteGuard allowedRoles={["parent"]}>
              <ParentProfile />
            </RouteGuard>
          } />
          <Route path="/admin/trips" element={
            <RouteGuard allowedRoles={["admin", "manager"]}>
              <AdminTrips />
            </RouteGuard>
          } />
        </Route>
        {/* باقي الصفحات العامة كما هي */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/features" element={<Features />} />
        <Route path="/users" element={<Users />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={
          <RedirectIfAuthenticated>
            <Login />
          </RedirectIfAuthenticated>
        } />
        <Route path="/register-parent" element={<RegisterParent />} />
        <Route path="/login-driver" element={
          <RedirectIfAuthenticated>
            <LoginDriver />
          </RedirectIfAuthenticated>
        } />
        <Route path="/login-admin" element={
          <RedirectIfAuthenticated>
            <AdminLogin />
          </RedirectIfAuthenticated>
        } />
        <Route path="/booking-confirmation" element={<BookingConfirmation />} />
        {/* Catch all route - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {!isDashboardPage() && <Footer />}
    </div>
  )
}

export default App
