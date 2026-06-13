import React from "react";
import { assets } from "../assets/assets";

const policies = [
  {
    icon: assets.exchange_icon,
    title: "Easy Exchange Policy",
    desc: "Hassle-free exchanges on all orders, no questions asked.",
  },
  {
    icon: assets.quality_icon,
    title: "7 Days Return Policy",
    desc: "Changed your mind? Return any item within 7 days for free.",
  },
  {
    icon: assets.support_img,
    title: "Best Customer Support",
    desc: "Our team is available 24/7 to help with anything you need.",
  },
];

const OurPolicy = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100 border border-gray-100 my-16 sm:my-20">
      {policies.map(({ icon, title, desc }, index) => (
        <div
          key={index}
          className="flex flex-row sm:flex-col items-center sm:items-center gap-5 sm:gap-0 px-8 py-8 sm:py-10 text-left sm:text-center"
        >
          <img
            src={icon}
            className="w-10 sm:w-11 sm:mb-5 flex-shrink-0 opacity-80"
            alt={title}
          />
          <div>
            <p className="text-sm font-semibold text-gray-800 mb-1">{title}</p>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed max-w-[180px] sm:max-w-none mx-auto">
              {desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OurPolicy;
