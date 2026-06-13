import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="mt-24 sm:mt-40">
      {/* ── Main Footer Grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-[3fr_1fr_1fr] gap-10 sm:gap-14 pb-12 text-sm">
        {/* Brand Column — full width on mobile */}
        <div className="col-span-2 sm:col-span-1">
          <Link to="/">
            <img src={assets.logo} className="mb-5 w-28 sm:w-32" alt="ZYRA" />
          </Link>

          <p className="text-gray-500 leading-relaxed max-w-xs text-[13px]">
            ZYRA brings modern fashion to your fingertips. Discover stylish
            clothing for every occasion with quality, comfort, and affordability
            at the heart of every collection.
          </p>
        </div>

        {/* Company Links */}
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-5">
            Company
          </p>
          <ul className="flex flex-col gap-2.5">
            {[
              { label: "Home", to: "/" },
              { label: "About Us", to: "/about" },
              { label: "Delivery", to: "/delivery" },
              { label: "Privacy Policy", to: "/privacy" },
            ].map(({ label, to }) => (
              <li key={label}>
                <Link
                  to={to}
                  className="text-gray-500 hover:text-black transition-colors duration-150 text-[13px]"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-5">
            Get in Touch
          </p>
          <ul className="flex flex-col gap-2.5">
            <li>
              <a
                href="tel:+919876543210"
                className="text-gray-500 hover:text-black transition-colors duration-150 text-[13px]"
              >
                +91 98765 43210
              </a>
            </li>
            <li>
              <a
                href="mailto:support@zyra.com"
                className="text-gray-500 hover:text-black transition-colors duration-150 text-[13px]"
              >
                support@zyra.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div className="border-t border-gray-100 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-[11px] text-gray-400">
          © 2026 ZYRA. All rights reserved.
        </p>
        <div className="flex items-center gap-4 text-[11px] text-gray-400">
          <Link to="/privacy" className="hover:text-black transition-colors">
            Privacy Policy
          </Link>
          <span className="w-px h-3 bg-gray-200" />
          <Link to="/terms" className="hover:text-black transition-colors">
            Terms of Use
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
