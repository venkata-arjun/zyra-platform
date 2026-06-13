import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";

const ProductItem = ({ id, image, name, price }) => {
  const { currency } = useContext(ShopContext);

  return (
    <Link className="group block text-gray-700" to={`/product/${id}`}>
      {/* ── Image ── */}
      <div className="overflow-hidden bg-gray-50 aspect-[3/4] w-full">
        <img
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          src={image[0]}
          alt={name}
        />
      </div>

      {/* ── Info ── */}
      <div className="pt-3 space-y-0.5">
        <p className="text-[13px] text-gray-700 leading-snug line-clamp-2 group-hover:text-black transition-colors duration-150">
          {name}
        </p>
        <p className="text-sm font-semibold text-gray-900">
          {currency}
          {price}
        </p>
      </div>
    </Link>
  );
};

export default ProductItem;
