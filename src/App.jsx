import { Routes, Route, Navigate } from "react-router-dom"
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


function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/features" element={<Features />} />
        <Route path="/users" element={<Users />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register-parent" element={<RegisterParent />} />
        <Route path="/login-driver" element={<LoginDriver />} />
        <Route path="/login-admin" element={<AdminLogin />} />
        <Route path="/driver-profile" element={<DriverProfile />} />
        <Route path="/parent-profile" element={
          // <RouteGuard allowedRoles={["parent"]}>
            <ParentProfile />
          // </RouteGuard>
        } />
        <Route path="/admin-dashboard" element={
          <RouteGuard allowedRoles={["admin"]}>
            <AdminDashboard />
          </RouteGuard>
        } />
        <Route path="/manager-dashboard" element={
          <RouteGuard allowedRoles={["manager"]}>
            <ManagerDashboard />
          </RouteGuard>
        } />
        <Route path="/driver-dashboard" element={
          // <RouteGuard allowedRoles={["driver"]}>
            <DriverDashboard />
          // </RouteGuard>
        } />
        <Route path="/dashboard/user" element={<UserDashboard />} />
        <Route path="/dashboard/parent" element={<ParentDashboard />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/booking-confirmation" element={<BookingConfirmation />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/map-view" element={<MapView />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/help" element={<Help />} />
        <Route path="/profile" element={
          <RouteGuard>
            <Profile />
          </RouteGuard>
        } />
        <Route path="/bookings" element={<BookingsPage />} />
        <Route path="/admin/bookings" element={<AdminBookings />} />
        <Route path="/admin/booking-reports" element={<BookingReports />} />
        <Route path="/admin/driver-reports" element={<DriverReports />} />
        <Route path="/attendance" element={
          <RouteGuard allowedRoles={["admin", "manager"]}>
            <AttendanceManagement />
          </RouteGuard>
        } />
        {/* Catch all route - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
