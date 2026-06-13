import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 rounded-lg overflow-hidden bg-[#FCFAF7]">
      {/* Left */}
      <div className="flex items-center justify-center bg-[#FCFAF7] px-8 sm:px-12 lg:px-20 py-14 lg:py-20">
        <div className="max-w-lg text-center md:text-left">
          <p className="mb-5 text-xs font-medium uppercase tracking-[0.35em] text-gray-400">
            New Collection 2026
          </p>

          <h1 className="text-5xl sm:text-6xl lg:text-[64px] font-semibold leading-[0.95] tracking-tight text-gray-900">
            Discover
            <br />
            Your Style
          </h1>

          <p className="mt-8 max-w-md mx-auto md:mx-0 text-base leading-8 text-gray-500">
            Premium fashion designed for everyday comfort. Explore the latest
            arrivals and timeless essentials curated for every occasion.
          </p>

          <Link
            to="/collection"
            className="inline-flex items-center justify-center mt-10 px-9 py-4 border border-gray-900 bg-transparent text-sm font-semibold uppercase tracking-[0.18em] text-gray-900 transition-all duration-300 hover:bg-gray-900 hover:text-white hover:-translate-y-0.5 shadow-sm"
          >
            Shop Collection
          </Link>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center justify-center bg-[#FCFAF7] p-6 sm:p-8 lg:p-10">
        <img
          src={assets.hero_img}
          alt="Latest Collection"
          className="w-full max-w-[560px] h-auto object-contain transition-transform duration-700 hover:scale-[1.03]"
        />
      </div>
    </section>
  );
};

export default Hero;
