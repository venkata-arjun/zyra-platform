import React from "react";
import { assets } from "../assets/assets";

const Navbar = ({ setToken, sidebarOpen, setSidebarOpen }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 sm:px-6 h-16 bg-white border-b border-gray-100 shadow-sm">
      {/* Left: Hamburger (mobile) + Logo */}
      <div className="flex items-center gap-3">
        {/* Hamburger — mobile only */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle menu"
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <span
            className={`block w-5 h-0.5 bg-gray-600 rounded-full transition-all duration-300 origin-center ${
              sidebarOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-gray-600 rounded-full transition-all duration-300 ${
              sidebarOpen ? "opacity-0 scale-x-0" : ""
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-gray-600 rounded-full transition-all duration-300 origin-center ${
              sidebarOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>

        <img
          className="h-9 w-auto object-contain"
          src={assets.logo}
          alt="Logo"
        />
      </div>

      {/* Right: Logout */}
      <button
        onClick={() => setToken("")}
        className="bg-slate-800 px-4 py-1.5 text-[12.5px] font-medium text-white rounded-full transition-all duration-200 hover:bg-slate-900 active:scale-95"
      >
        Logout
      </button>
    </header>
  );
};

export default Navbar;
