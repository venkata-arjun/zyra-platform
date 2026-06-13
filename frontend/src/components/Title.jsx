import React from "react";

const Title = ({ text1, text2 }) => {
  return (
    <div className="flex justify-center mb-5">
      <h2 className="text-xl sm:text-2xl font-semibold uppercase tracking-[1px] text-center">
        <span className="text-gray-400">{text1}</span>{" "}
        <span className="text-black">{text2}</span>
      </h2>
    </div>
  );
};

export default Title;
