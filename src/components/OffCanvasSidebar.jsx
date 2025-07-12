import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaChevronLeft, FaChevronRight, FaSignOutAlt } from "react-icons/fa";

export default function OffCanvasSidebar({ buttons, collapsed, setCollapsed }) {
  const location = useLocation();
  const [tooltip, setTooltip] = useState(null);

  const handleLogout = () => {
    // Placeholder for logout logic
    console.log("Logout clicked");
  };

  return (
    <div
      className={`fixed top-0 left-0 h-screen z-50 transition-all duration-300 flex flex-col justify-between
        ${collapsed ? "w-14" : "w-[200px]"}
        shadow-2xl
      `}
      style={{
        minWidth: collapsed ? 56 : 200,
        background: "linear-gradient(135deg, var(--brand-dark-blue) 0%, var(--brand-medium-blue) 50%, var(--brand-light-blue) 100%)",
        padding: collapsed ? "16px 8px" : "24px 16px"
      }}
    >
      {/* Top section: Logo */}
      <Link to="/" className="flex items-center mb-8 gap-1 cursor-pointer group">
        <span className={`flex items-center justify-center transition-all duration-300 ${collapsed ? "w-8 h-8" : "w-10 h-10"}`}>
          <i className="fas fa-bus text-2xl" style={{ color: "#ead8b1" }}></i>
        </span>
        {!collapsed && <span className="font-display font-bold text-base text-left ml-0.5 group-hover:underline" style={{ color: "#ead8b1" }}>BusTrack</span>}
      </Link>
      {/* Links */}
      <div className="flex-1 flex flex-col gap-1">
        {buttons.map((btn, idx) => {
          const isActive = location.pathname === btn.page;
          return (
            <div key={idx} className="relative flex">
              <Link
                to={btn.page}
                className={`group flex items-center px-2 py-2 rounded-lg transition-all duration-200
                  ${isActive ? "bg-white text-[#3a6d8c] shadow font-bold" : "text-white hover:bg-brand-light-blue/40"}
                  ${collapsed ? "justify-center" : ""}
                  text-left
                `}
                onMouseEnter={() => setTooltip(idx)}
                onMouseLeave={() => setTooltip(null)}
              >
                <span className={`text-lg ${isActive ? "scale-110" : ""} transition`}>{btn.icon}</span>
                {!collapsed && <span className="ml-3 text-left text-sm">{btn.label}</span>}
              </Link>
              {/* Tooltip when collapsed */}
              {collapsed && tooltip === idx && (
                <span className="absolute left-12 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-1 rounded shadow-lg text-xs whitespace-nowrap z-50 animate-fade-in">
                  {btn.label}
                </span>
              )}
            </div>
          );
        })}
      </div>
      {/* Bottom section: Collapse & Logout */}
      <div className="flex flex-col gap-2 items-start w-full">
        <button
          className={`flex items-center bg-gray-100 hover:bg-gray-200 text-gray-700 transition ${
            collapsed
              ? "justify-center w-10 h-10 rounded-full p-0"
              : "px-4 py-2 gap-3 rounded-full"
          }`}
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expand menu" : "Collapse menu"}
          title={collapsed ? "Expand" : "Collapse"}
        >
          {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
          {!collapsed && (
            <span className="text-sm font-medium">Collapse</span>
          )}
        </button>
        <button
          className={`flex items-center bg-gray-100 hover:bg-red-100 text-red-500 transition mt-4 ${
            collapsed
              ? "justify-center w-10 h-10 rounded-full p-0"
              : "px-4 py-2 gap-3 rounded-full"
          }`}
          onClick={handleLogout}
          aria-label="Logout"
          title="Logout"
        >
          <FaSignOutAlt className="text-lg" />
          {!collapsed && (
            <span className="text-sm font-medium">Logout</span>
          )}
        </button>
      </div>
    </div>
  );
} 