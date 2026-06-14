import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();
  const { products, currency, cartItems, updateQuantity } =
    useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    const tempData = [];
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        if (cartItems[items][item] > 0) {
          tempData.push({
            _id: items,
            size: item,
            quantity: cartItems[items][item],
          });
        }
      }
    }
    setCartData(tempData);
  }, [cartItems]);

  // Safe quantity change from input — only commit when value is a valid number > 0
  const handleQuantityInput = (id, size, raw) => {
    const value = parseInt(raw, 10);
    if (!isNaN(value) && value > 0) {
      updateQuantity(id, size, value);
    }
  };

  return (
    <div className="border-t border-gray-200 pt-10 sm:pt-14 px-4 sm:px-0">
      {/* Header */}
      <div className="text-2xl mb-6">
        <Title text1={"YOUR"} text2={"CART"} />
      </div>

      {/* Empty State */}
      {cartData.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400 gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-14 h-14 stroke-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
            />
          </svg>
          <p className="text-sm tracking-widest uppercase font-medium text-gray-400">
            Your cart is empty
          </p>
        </div>
      )}

      {/* Cart Items */}
      <div className="divide-y divide-gray-100">
        {cartData.map((item, index) => {
          const productData = products.find(
            (product) => product._id === item._id,
          );

          return (
            <div
              key={index}
              className="py-5 sm:py-6 flex items-center gap-4 sm:gap-6 group transition-colors duration-200 hover:bg-gray-50/60 -mx-3 px-3 rounded-lg"
            >
              {/* Product Image — clickable */}
              <div className="flex-shrink-0">
                <div
                  onClick={() => navigate(`/product/${item._id}`)}
                  className="w-20 h-20 sm:w-24 sm:h-24 overflow-hidden rounded-lg bg-gray-50 border border-gray-100 cursor-pointer"
                >
                  <img
                    className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                    src={productData.image[0]}
                    alt={productData.name}
                  />
                </div>
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                {/* Product name — clickable, full text shown (no truncate) */}
                <p
                  onClick={() => navigate(`/product/${item._id}`)}
                  className="text-sm sm:text-base font-semibold text-gray-900 leading-snug cursor-pointer hover:text-gray-600 transition-colors duration-150"
                >
                  {productData.name}
                </p>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1.5">
                  <span className="text-sm font-medium text-gray-800">
                    {currency}
                    {productData.price}
                  </span>
                  <span className="text-xs px-2.5 py-0.5 border border-gray-200 bg-gray-50 text-gray-600 rounded-sm tracking-wider uppercase font-medium">
                    {item.size}
                  </span>
                </div>

                {/* Mobile: quantity + delete */}
                <div className="flex items-center gap-3 mt-3 sm:hidden">
                  <div className="flex items-center border border-gray-200 rounded overflow-hidden">
                    <button
                      onClick={() =>
                        item.quantity > 1 &&
                        updateQuantity(item._id, item.size, item.quantity - 1)
                      }
                      className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 active:bg-gray-200 transition-colors text-lg leading-none"
                    >
                      −
                    </button>
                    <input
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityInput(item._id, item.size, e.target.value)
                      }
                      className="w-12 h-9 text-center text-sm font-medium text-gray-800 border-x border-gray-200 bg-white focus:outline-none focus:bg-gray-50"
                      type="number"
                      min={1}
                    />
                    <button
                      onClick={() =>
                        updateQuantity(item._id, item.size, item.quantity + 1)
                      }
                      className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 active:bg-gray-200 transition-colors text-lg leading-none"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => updateQuantity(item._id, item.size, 0)}
                    className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    aria-label="Remove item"
                  >
                    <img
                      className="w-4 h-4 opacity-60"
                      src={assets.bin_icon}
                      alt="Remove"
                    />
                  </button>
                </div>
              </div>

              {/* Desktop: Quantity Stepper */}
              <div className="hidden sm:flex items-center border border-gray-200 rounded overflow-hidden flex-shrink-0">
                <button
                  onClick={() =>
                    item.quantity > 1 &&
                    updateQuantity(item._id, item.size, item.quantity - 1)
                  }
                  className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-100 active:bg-gray-200 transition-colors text-lg leading-none"
                >
                  −
                </button>
                <input
                  value={item.quantity}
                  onChange={(e) =>
                    handleQuantityInput(item._id, item.size, e.target.value)
                  }
                  className="w-10 h-8 text-center text-sm font-medium text-gray-800 border-x border-gray-200 bg-white focus:outline-none focus:bg-gray-50"
                  type="number"
                  min={1}
                />
                <button
                  onClick={() =>
                    updateQuantity(item._id, item.size, item.quantity + 1)
                  }
                  className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-100 active:bg-gray-200 transition-colors text-lg leading-none"
                >
                  +
                </button>
              </div>

              {/* Desktop: Delete */}
              <button
                onClick={() => updateQuantity(item._id, item.size, 0)}
                className="hidden sm:flex items-center justify-center w-9 h-9 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200 flex-shrink-0"
                aria-label="Remove item"
              >
                <img className="w-4 h-4" src={assets.bin_icon} alt="Remove" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Cart Summary */}
      {cartData.length > 0 && (
        <div className="flex justify-end mt-10 mb-16 sm:my-20">
          <div className="w-full sm:w-[440px]">
            <div className="h-px bg-gray-100 mb-6" />
            <CartTotal />
            <div className="mt-6">
              <button
                onClick={() => navigate("/place-order")}
                className="w-full sm:w-auto sm:float-right flex items-center justify-center gap-2 bg-gray-900 text-white text-xs tracking-[0.15em] uppercase font-semibold px-10 py-4 rounded hover:bg-black active:scale-[0.98] transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Proceed to Checkout
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
