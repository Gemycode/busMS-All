import OffCanvasSidebar from "../components/OffCanvasSidebar";
import { Outlet } from "react-router-dom";
import { FaHome, FaUsers, FaBus, FaRoute, FaChartBar } from "react-icons/fa";
import { useState } from "react";

const adminButtons = [
  { icon: <FaHome />, label: "Dashboard", page: "/admin-dashboard" },
  { icon: <FaUsers />, label: "Users", page: "/admin/users" },
  { icon: <FaBus />, label: "Buses", page: "/admin/buses" },
  { icon: <FaRoute />, label: "Routes", page: "/admin/routes" },
  { icon: <FaChartBar />, label: "Reports", page: "/admin/reports" },
];

export default function OffCanvasLayout() {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="min-h-screen">
      <OffCanvasSidebar buttons={adminButtons} collapsed={collapsed} setCollapsed={setCollapsed} />
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