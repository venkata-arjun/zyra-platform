import React, { useContext } from "react";
import Title from "./Title";
import { ShopContext } from "../context/ShopContext";

const CartTotal = () => {
  const { currency, delivery_fee, getCartAmount } = useContext(ShopContext);

  const subtotal = getCartAmount();
  const total = subtotal === 0 ? 0 : subtotal + delivery_fee;

  return (
    <div className="w-full">
      {/* Section Header */}
      <div className="text-2xl mb-5">
        <Title text1={"CART"} text2={"TOTALS"} />
      </div>

      {/* Summary Rows */}
      <div className="flex flex-col text-sm rounded-lg border border-gray-100 overflow-hidden">
        {/* Subtotal */}
        <div className="flex items-center justify-between px-4 py-3.5 bg-white hover:bg-gray-50/70 transition-colors">
          <span className="text-gray-500 tracking-wide">Subtotal</span>
          <span className="font-medium text-gray-800 tabular-nums">
            {currency}
            {subtotal}.00
          </span>
        </div>

        <div className="h-px bg-gray-100 mx-4" />

        {/* Shipping */}
        <div className="flex items-center justify-between px-4 py-3.5 bg-white hover:bg-gray-50/70 transition-colors">
          <span className="text-gray-500 tracking-wide">Shipping Fee</span>
          {subtotal === 0 ? (
            <span className="text-xs text-gray-400 italic">—</span>
          ) : (
            <span className="font-medium text-gray-800 tabular-nums">
              {currency}
              {delivery_fee}.00
            </span>
          )}
        </div>

        {/* Total */}
        <div className="flex items-center justify-between px-4 py-4 bg-gray-900 mt-0">
          <span className="text-sm font-semibold text-white tracking-widest uppercase">
            Total
          </span>
          <span className="text-base font-bold text-white tabular-nums">
            {currency}
            {total}.00
          </span>
        </div>
      </div>

      
    </div>
  );
};

export default CartTotal;
