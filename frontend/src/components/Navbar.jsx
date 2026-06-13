import React, { useState } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import {
  Menu,
  X,
  ChevronRight,
  ShoppingBag,
  Search,
  User,
  Package,
  LogOut,
  UserCircle,
} from "lucide-react";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const {
    showSearch,
    setShowSearch,
    getCartCount,
    token,
    setToken,
    setCartItems,
  } = useContext(ShopContext);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
    navigate("/login");
  };

  const handleCartClick = (e) => {
    if (!token) {
      e.preventDefault();
      navigate("/login");
    }
  };

  const handleOrdersClick = (e) => {
    if (!token) {
      e.preventDefault();
      navigate("/login");
    }
  };

  return (
    <>
      <div className="flex items-center justify-between py-5 sm:py-6 font-medium border-b border-gray-100">
        {/* Logo */}
        <Link to="/">
          <img src={assets.logo} className="w-20 sm:w-24" alt="Logo" />
        </Link>

        {/* Desktop Nav Links */}
        <ul className="hidden sm:flex gap-8 text-sm text-gray-700">
          {[
            { to: "/", label: "HOME" },
            { to: "/collection", label: "COLLECTION" },
            { to: "/about", label: "ABOUT" },
            { to: "/contact", label: "CONTACT" },
          ].map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className="flex flex-col items-center gap-1 group"
            >
              {({ isActive }) => (
                <>
                  <p
                    className={`transition-colors duration-150 text-[11.5px] tracking-[0.15em] ${
                      isActive
                        ? "text-black"
                        : "text-gray-500 group-hover:text-black"
                    }`}
                  >
                    {label}
                  </p>
                  <hr
                    className={`border-none h-[1.5px] bg-black transition-all duration-300 ${
                      isActive ? "w-2/4" : "w-0 group-hover:w-2/4"
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </ul>

        {/* Right Icons */}
        <div className="flex items-center gap-5">
          {/* Search */}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="text-gray-500 hover:text-black transition-colors"
            aria-label="Search"
          >
            <Search size={18} strokeWidth={1.75} />
          </button>

          {/* Profile Dropdown — desktop only */}
          <div className="group relative hidden sm:block">
            <Link to={token ? "#" : "/login"}>
              <User
                size={18}
                strokeWidth={1.75}
                className="text-gray-500 hover:text-black transition-colors cursor-pointer"
              />
            </Link>
            {token && (
              <div className="absolute right-0 pt-4 hidden group-hover:block z-50">
                <div className="flex flex-col w-44 py-2 bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-gray-500 hover:text-black hover:bg-gray-50 transition-colors"
                  >
                    <UserCircle
                      size={14}
                      strokeWidth={1.75}
                      className="text-gray-400"
                    />
                    My Profile
                  </Link>
                  <Link
                    to="/orders"
                    onClick={handleOrdersClick}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-gray-500 hover:text-black hover:bg-gray-50 transition-colors"
                  >
                    <Package
                      size={14}
                      strokeWidth={1.75}
                      className="text-gray-400"
                    />
                    Orders
                  </Link>
                  <div className="my-1 mx-4 border-t border-gray-100" />
                  <button
                    onClick={logout}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-red-500 hover:bg-red-50 transition-colors w-full text-left"
                  >
                    <LogOut
                      size={14}
                      strokeWidth={1.75}
                      className="text-red-400"
                    />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Cart */}
          <Link to="/cart" onClick={handleCartClick} className="relative">
            <ShoppingBag
              size={20}
              strokeWidth={1.75}
              className="text-gray-500 hover:text-black transition-colors"
            />
            {getCartCount() > 0 && (
              <span className="absolute -right-2 -bottom-2 w-4 h-4 bg-black text-white text-[8px] rounded-full flex items-center justify-center leading-none">
                {getCartCount()}
              </span>
            )}
          </Link>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setVisible(true)}
            className="sm:hidden flex items-center justify-center w-8 h-8 text-gray-500 hover:text-black transition-colors"
            aria-label="Open menu"
          >
            <Menu size={20} strokeWidth={1.75} />
          </button>
        </div>
      </div>

      {/* Backdrop */}
      <div
        onClick={() => setVisible(false)}
        className={`fixed inset-0 bg-black/20 z-40 sm:hidden transition-opacity duration-300 ${
          visible
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white z-50 flex flex-col transition-transform duration-300 ease-in-out sm:hidden border-l border-gray-100 ${
          visible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <Link to="/" onClick={() => setVisible(false)}>
            <img src={assets.logo} className="w-20" alt="Logo" />
          </Link>
          <button
            onClick={() => setVisible(false)}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-black transition-colors"
            aria-label="Close menu"
          >
            <X size={18} strokeWidth={1.75} />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col mt-1 px-2">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest px-3 pt-3 pb-1">
            Menu
          </p>
          {[
            { to: "/", label: "Home" },
            { to: "/collection", label: "Collection" },
            { to: "/about", label: "About" },
            { to: "/contact", label: "Contact" },
          ].map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setVisible(false)}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-3 text-sm rounded-lg transition-colors duration-150 ${
                  isActive
                    ? "text-black font-medium bg-gray-50"
                    : "text-gray-500 hover:text-black hover:bg-gray-50"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span>{label}</span>
                  <ChevronRight
                    size={13}
                    strokeWidth={1.75}
                    className={isActive ? "opacity-60" : "opacity-30"}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Drawer Account Section */}
        <div className="mt-auto border-t border-gray-100 px-2 py-3">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest px-3 pt-2 pb-1">
            Account
          </p>

          <Link
            to="/profile"
            onClick={() => setVisible(false)}
            className="flex items-center gap-3 px-3 py-3 text-sm text-gray-500 hover:text-black hover:bg-gray-50 rounded-lg transition-colors"
          >
            <UserCircle
              size={15}
              strokeWidth={1.75}
              className="text-gray-400"
            />
            My Profile
          </Link>

          <Link
            to="/orders"
            onClick={(e) => {
              handleOrdersClick(e);
              setVisible(false);
            }}
            className="flex items-center gap-3 px-3 py-3 text-sm text-gray-500 hover:text-black hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Package size={15} strokeWidth={1.75} className="text-gray-400" />
            Orders
          </Link>

          <div className="mx-3 my-1 border-t border-gray-100" />

          {token ? (
            <button
              onClick={() => {
                logout();
                setVisible(false);
              }}
              className="flex items-center gap-3 w-full px-3 py-3 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={15} strokeWidth={1.75} className="text-red-400" />
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setVisible(false)}
              className="flex items-center gap-3 px-3 py-3 text-sm text-gray-500 hover:text-black hover:bg-gray-50 rounded-lg transition-colors"
            >
              <User size={15} strokeWidth={1.75} className="text-gray-400" />
              Login
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
