import OffCanvasSidebar from "../components/OffCanvasSidebar";
import { Outlet } from "react-router-dom";
import { FaHome, FaUsers, FaBus, FaRoute, FaChartBar, FaClipboardCheck, FaUser, FaBell, FaMapMarkerAlt, FaChild, FaTicketAlt, FaCog, FaQuestionCircle } from "react-icons/fa";
import { useState } from "react";
import { useSelector } from "react-redux";

const adminButtons = [
  { icon: <FaHome />, label: "Dashboard", page: "/admin-dashboard" },
  { icon: <FaUsers />, label: "Users", page: "/admin/users" },
  { icon: <FaBus />, label: "Buses", page: "/admin/buses" },
  { icon: <FaRoute />, label: "Routes", page: "/admin/routes" },
  { icon: <FaClipboardCheck />, label: "Attendance", page: "/attendance" },
  { icon: <FaTicketAlt />, label: "Bookings", page: "/admin/bookings" },
  { icon: <FaChartBar />, label: "Reports", page: "/admin/reports" },
  { icon: <FaChartBar />, label: "Booking Reports", page: "/admin/booking-reports" },
  { icon: <FaChartBar />, label: "Driver Reports", page: "/admin/driver-reports" },
  { icon: <FaBell />, label: "Notifications", page: "/notifications" },
  { icon: <FaMapMarkerAlt />, label: "Map View", page: "/map-view" },
  { icon: <FaUser />, label: "Profile", page: "/profile" },
  { icon: <FaCog />, label: "Settings", page: "/settings" },
  { icon: <FaQuestionCircle />, label: "Help", page: "/help" },
];

const managerButtons = [
  { icon: <FaHome />, label: "Dashboard", page: "/manager-dashboard" },
  { icon: <FaUsers />, label: "Users", page: "/admin/users" },
  { icon: <FaBus />, label: "Buses", page: "/admin/buses" },
  { icon: <FaRoute />, label: "Routes", page: "/admin/routes" },
  { icon: <FaClipboardCheck />, label: "Attendance", page: "/attendance" },
  { icon: <FaChartBar />, label: "Reports", page: "/admin/reports" },
  { icon: <FaBell />, label: "Notifications", page: "/notifications" },
  { icon: <FaMapMarkerAlt />, label: "Map View", page: "/map-view" },
  { icon: <FaUser />, label: "Profile", page: "/profile" },
  { icon: <FaCog />, label: "Settings", page: "/settings" },
  { icon: <FaQuestionCircle />, label: "Help", page: "/help" },
];

const driverButtons = [
  { icon: <FaHome />, label: "Dashboard", page: "/driver-dashboard" },
  { icon: <FaMapMarkerAlt />, label: "Live Tracking", page: "/map-view" },
  { icon: <FaUser />, label: "Profile", page: "/driver-profile" },
  { icon: <FaBell />, label: "Notifications", page: "/notifications" },
  { icon: <FaChartBar />, label: "Reports", page: "/reports" },
  { icon: <FaCog />, label: "Settings", page: "/settings" },
  { icon: <FaQuestionCircle />, label: "Help", page: "/help" },
];

const parentButtons = [
  { icon: <FaHome />, label: "Dashboard", page: "/dashboard/parent" },
  // { icon: <FaChild />, label: "Children", page: "/children" }, // غير موجودة فعليًا
  { icon: <FaBell />, label: "Notifications", page: "/notifications" },
  { icon: <FaTicketAlt />, label: "Book Trip", page: "/booking" },
  { icon: <FaMapMarkerAlt />, label: "Tracking", page: "/map-view" },
  { icon: <FaUser />, label: "Profile", page: "/parent-profile" },
  // { icon: <FaChartBar />, label: "Reports", page: "/reports" }, // خاص بالإدارة فقط
  { icon: <FaCog />, label: "Settings", page: "/settings" },
  { icon: <FaQuestionCircle />, label: "Help", page: "/help" },
];

const userButtons = [
  { icon: <FaHome />, label: "Dashboard", page: "/dashboard/user" },
  { icon: <FaTicketAlt />, label: "Book Trip", page: "/booking" },
  { icon: <FaMapMarkerAlt />, label: "Live Tracking", page: "/map-view" },
  { icon: <FaUser />, label: "Profile", page: "/profile" },
  { icon: <FaBell />, label: "Notifications", page: "/notifications" },
  { icon: <FaCog />, label: "Settings", page: "/settings" },
  { icon: <FaQuestionCircle />, label: "Help", page: "/help" },
];

export default function OffCanvasLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const user = useSelector((state) => state.user.user);
  let buttons = [];
  if (user?.role === "admin") buttons = adminButtons;
  else if (user?.role === "manager") buttons = managerButtons;
  else if (user?.role === "driver") buttons = driverButtons;
  else if (user?.role === "parent") buttons = parentButtons;
  else if (user?.role === "user" || user?.role === "student") buttons = userButtons;

  return (
    <div className="min-h-screen">
      <OffCanvasSidebar buttons={buttons} collapsed={collapsed} setCollapsed={setCollapsed} />
      <main
        className="bg-gray-50 min-h-screen transition-all duration-300"
        style={{
          marginLeft: collapsed ? 64 : 256,
          padding: 0,
          overflowY: "auto"
        }}
      >
        <Outlet />
      </main>
    </div>
  );
} 