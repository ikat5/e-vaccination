import React from "react";
import { NavLink } from "react-router-dom";

// --- SVG Icons ---
const VaccineLogo = () => (
  <svg
    className="h-10 w-10 text-white"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M12 11h4M12 11v4M12 11H8M12 11V7" />
  </svg>
);

const navItems = [
  { name: "Home", path: "/", icon: "🏠" },
  { name: "User", path: "/user/auth", icon: "👤" },
  { name: "Admin", path: "/admin/auth", icon: "🛡️" },
  { name: "Staff", path: "/staff/login", icon: "💼" },
];

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <NavLink to="/" className="flex items-center space-x-4">
            <VaccineLogo />
            <div className="flex flex-col text-left">
              <span className="text-xl font-bold tracking-wide">e-vaccine</span>
              <span className="text-xs font-light opacity-90">
                Bangladesh Vaccination Program (EPI)
              </span>
            </div>
          </NavLink>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "bg-blue-900 text-white"
                      : "text-blue-100 hover:bg-blue-700 hover:text-white"
                  }`
                }
              >
                <span className="mr-1">{item.icon}</span>
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* Mobile Menu (can be expanded later) */}
          <div className="md:hidden">
            <button className="p-2 rounded-md text-blue-200 hover:text-white hover:bg-blue-700">
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
