import React from "react";
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Footer Navigation */}
          <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 mb-4 md:mb-0">
            <NavLink to="/" className="text-sm hover:text-white transition-colors">
              Home
            </NavLink>
            <NavLink to="/user/auth" className="text-sm hover:text-white transition-colors">
              User Portal
            </NavLink>
            <NavLink to="/admin/auth" className="text-sm hover:text-white transition-colors">
              Admin Login
            </NavLink>
            <NavLink to="/staff/login" className="text-sm hover:text-white transition-colors">
              Staff Login
            </NavLink>
          </div>

          {/* Copyright */}
          <div className="text-center md:text-right">
            <p className="text-sm">
              &copy; {new Date().getFullYear()} Bangladesh Vaccination Program (EPI)
            </p>
            <p className="text-xs opacity-75 mt-1">
              e-vaccine - Electronic Vaccination Management System
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
