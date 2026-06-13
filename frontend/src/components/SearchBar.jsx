import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import { useLocation } from "react-router-dom";

const SearchBar = () => {
  const { search, setSearch, showSearch, setShowSearch } =
    useContext(ShopContext);

  const [visible, setVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes("collection") && showSearch) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [location, showSearch]);

  return visible ? (
    <div className="border-b border-gray-100 bg-white">
      <div className="flex items-center gap-3 px-4 sm:px-0 py-3.5 sm:w-3/5 sm:mx-auto">
        {/* Input wrapper */}
        <div className="flex-1 flex items-center gap-3 border border-gray-200 px-4 py-2.5 focus-within:border-black transition-colors duration-200">
          <img
            src={assets.search_icon}
            className="w-4 h-4 flex-shrink-0 opacity-50"
            alt="Search"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full outline-none bg-transparent text-sm text-gray-800 placeholder-gray-400"
            type="text"
            placeholder="Search for products..."
            autoFocus
          />
          {/* Inline clear — only when there's text */}
          {search && (
            <button
              onClick={() => setSearch("")}
              className="flex-shrink-0 text-gray-300 hover:text-black transition-colors"
              aria-label="Clear search"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M1 1l10 10M11 1L1 11"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Close search bar */}
        <button
          onClick={() => setShowSearch(false)}
          className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-black transition-colors"
          aria-label="Close search"
        >
          <img src={assets.cross_icon} className="w-3.5 h-3.5" alt="Close" />
        </button>
      </div>
    </div>
  ) : null;
};

export default SearchBar;
