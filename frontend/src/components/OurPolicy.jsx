import React from "react";
import { ShieldCheck, Headset, BadgeCheck } from "lucide-react";

const policies = [
  {
    icon: BadgeCheck,
    title: "Quality assurance",
    desc: "Every product is checked for quality before it reaches you.",
  },
  {
    icon: ShieldCheck,
    title: "Secure payments",
    desc: "Your payments are encrypted and protected at every step.",
  },
  {
    icon: Headset,
    title: "24/7 support",
    desc: "Our team is available around the clock to help with anything.",
  },
];

const OurPolicy = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100 my-16 sm:my-20">
      {policies.map(({ icon: Icon, title, desc }, index) => (
        <div
          key={index}
          className="flex flex-row sm:flex-col items-center sm:items-start gap-5 sm:gap-4 px-8 py-8 sm:py-10 text-left"
        >
          <Icon
            className="w-6 h-6 text-gray-700 flex-shrink-0"
            strokeWidth={1.75}
          />
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-1">{title}</p>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed max-w-[220px]">
              {desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OurPolicy;
