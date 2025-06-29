import { Routes, Route, Navigate } from "react-router-dom"
import Header from "./components/Header"
import Footer from "./components/Footer"
import Home from "./pages/Home"
import About from "./pages/About"
import Features from "./pages/Features"
import Users from "./pages/Users"
import Contact from "./pages/Contact"
import Login from "./pages/Login"
import DriverProfile from "./pages/DriverProfile"
import ParentProfile from "./pages/ParentProfile"
import AdminDashboard from "./pages/AdminDashboard"
import ManagerDashboard from "./pages/ManagerDashboard"
import DriverDashboard from "./pages/DriverDashboard"
import MapView from "./pages/MapView"
import RouteGuard from './components/RouteGuard'
import Profile from "./pages/Profile"
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
        <Route path="/driver-profile" element={<DriverProfile />} />
        <Route path="/parent-profile" element={
          <RouteGuard allowedRoles={["parent"]}>
            <ParentProfile />
          </RouteGuard>
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
          <RouteGuard allowedRoles={["driver"]}>
            <DriverDashboard />
          </RouteGuard>
        } />
        <Route path="/map-view" element={<MapView />} />
        <Route path="/profile" element={
          <RouteGuard>
            <Profile />
          </RouteGuard>
        } />
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
