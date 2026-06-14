import React, { useContext, useState } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-hot-toast";
import axios from "axios";

// ✅ Defined OUTSIDE PlaceOrder — prevents remount on every render
const FloatingInput = ({ id, label, type = "text", maxLength, ...rest }) => (
  <div className="relative w-full">
    <input
      id={id}
      type={type}
      placeholder={label}
      maxLength={maxLength}
      className="peer w-full border border-gray-200 rounded-lg py-3 px-4 text-sm text-gray-800 placeholder-transparent focus:outline-none focus:border-gray-900 transition-colors bg-white"
      {...rest}
    />
    <label
      htmlFor={id}
      className="absolute left-4 -top-2 text-[10px] text-gray-400 tracking-wider uppercase bg-white px-1 pointer-events-none transition-all
                 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:tracking-normal
                 peer-focus:-top-2 peer-focus:text-[10px] peer-focus:text-gray-700 peer-focus:tracking-wider peer-focus:uppercase"
    >
      {label}
    </label>
  </div>
);

const PlaceOrder = () => {
  const navigate = useNavigate();
  const [method, setMethod] = useState("cod");

  const {
    backendUrl,
    token,
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_fee,
    products,
  } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const initPay = (order, userId) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      order_id: order.id,
      handler: async (response) => {
        const verifyResponse = await axios.post(
          backendUrl + "/api/order/verifyRazorpay",
          {
            razorpay_order_id: response.razorpay_order_id,
            userId,
          },
          { headers: { token } },
        );
        if (verifyResponse.data.success) {
          setCartItems({});
          navigate("/orders");
        }
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "street",
      "city",
      "state",
      "zipcode",
      "country",
      "phone",
    ];

    const hasEmptyField = requiredFields.some((key) => !formData[key].trim());
    if (hasEmptyField) {
      toast.error("Please fill in all required details");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    if (getCartAmount() === 0) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      let orderItems = [];

      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(
              products.find((product) => product._id === items),
            );
            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = cartItems[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      }

      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
      };

      switch (method) {
        case "cod": {
          const response = await axios.post(
            backendUrl + "/api/order/place",
            orderData,
            { headers: { token } },
          );
          if (response.data.success) {
            setCartItems({});
            navigate("/orders");
          } else {
            toast.error(response.data.message);
          }
          break;
        }

        case "stripe": {
          const responseStripe = await axios.post(
            backendUrl + "/api/order/stripe",
            orderData,
            { headers: { token } },
          );
          if (responseStripe.data.success) {
            const { session_url } = responseStripe.data;
            window.location.replace(session_url);
          } else {
            toast.error(responseStripe.data.message);
          }
          break;
        }

        case "razorpay": {
          const responseRazorpay = await axios.post(
            backendUrl + "/api/order/razorpay",
            orderData,
            { headers: { token } },
          );
          if (responseRazorpay.data.success) {
            console.log(responseRazorpay.data.order);
            initPay(responseRazorpay.data.order);
          } else {
            toast.error(responseRazorpay.data.message);
          }
          break;
        }

        default:
          break;
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col sm:flex-row justify-between gap-8 sm:gap-12 pt-8 sm:pt-14 border-t border-gray-200 px-4 sm:px-0 pb-20 sm:pb-24"
    >
      {/* ── Left: Delivery Information ── */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl mb-1">
          <Title text1={"DELIVERY"} text2={"INFORMATION"} />
        </div>

        {/* Name Row */}
        <div className="flex gap-3">
          <FloatingInput
            id="firstName"
            name="firstName"
            label="First Name"
            value={formData.firstName}
            onChange={onChangeHandler}
            required
          />
          <FloatingInput
            id="lastName"
            name="lastName"
            label="Last Name"
            value={formData.lastName}
            onChange={onChangeHandler}
            required
          />
        </div>

        <FloatingInput
          id="email"
          name="email"
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={onChangeHandler}
          required
        />

        <FloatingInput
          id="street"
          name="street"
          label="Street"
          value={formData.street}
          onChange={onChangeHandler}
          required
        />

        {/* City + State */}
        <div className="flex gap-3">
          <FloatingInput
            id="city"
            name="city"
            label="City"
            value={formData.city}
            onChange={onChangeHandler}
            required
          />
          <FloatingInput
            id="state"
            name="state"
            label="State"
            value={formData.state}
            onChange={onChangeHandler}
            required
          />
        </div>

        {/* Zipcode + Country */}
        <div className="flex gap-3">
          <FloatingInput
            id="zipcode"
            name="zipcode"
            label="Zipcode"
            value={formData.zipcode}
            onChange={onChangeHandler}
            required
          />
          <FloatingInput
            id="country"
            name="country"
            label="Country"
            value={formData.country}
            onChange={onChangeHandler}
            required
          />
        </div>

        <FloatingInput
          id="phone"
          name="phone"
          label="Phone"
          type="tel"
          maxLength={10}
          value={formData.phone}
          onChange={onChangeHandler}
          required
        />
      </div>

      {/* ── Right: Order Summary + Payment ── */}
      <div className="w-full sm:min-w-80 sm:max-w-[380px]">
        <CartTotal />

        {/* Payment Method */}
        <div className="mt-10">
          <div className="text-xl sm:text-2xl mb-5">
            <Title text1={"PAYMENT"} text2={"METHOD"} />
          </div>

          <div className="flex flex-col gap-3">
            {/* Stripe */}
            <div
              onClick={() => setMethod("stripe")}
              className={`flex items-center gap-4 border rounded-lg p-3.5 px-4 cursor-pointer transition-all duration-200 ${
                method === "stripe"
                  ? "border-gray-900 bg-gray-50 shadow-sm"
                  : "border-gray-200 hover:border-gray-400"
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-colors ${method === "stripe" ? "border-gray-900 bg-gray-900" : "border-gray-300"}`}
              />
              <img className="h-5" src={assets.stripe_logo} alt="Stripe" />
            </div>

            {/* Razorpay */}
            <div
              onClick={() => setMethod("razorpay")}
              className={`flex items-center gap-4 border rounded-lg p-3.5 px-4 cursor-pointer transition-all duration-200 ${
                method === "razorpay"
                  ? "border-gray-900 bg-gray-50 shadow-sm"
                  : "border-gray-200 hover:border-gray-400"
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-colors ${method === "razorpay" ? "border-gray-900 bg-gray-900" : "border-gray-300"}`}
              />
              <img className="h-5" src={assets.razorpay_logo} alt="Razorpay" />
            </div>

            {/* Cash on Delivery */}
            <div
              onClick={() => setMethod("cod")}
              className={`flex items-center gap-4 border rounded-lg p-3.5 px-4 cursor-pointer transition-all duration-200 ${
                method === "cod"
                  ? "border-gray-900 bg-gray-50 shadow-sm"
                  : "border-gray-200 hover:border-gray-400"
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-colors ${method === "cod" ? "border-gray-900 bg-gray-900" : "border-gray-300"}`}
              />
              <p className="text-sm font-medium text-gray-700 tracking-wider uppercase">
                Cash on Delivery
              </p>
            </div>
          </div>

          {/* Place Order Button */}
          <div className="mt-7 mb-2">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white text-xs tracking-[0.15em] uppercase font-semibold px-10 py-4 rounded-lg hover:bg-black active:scale-[0.98] transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Place Order
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
    </form>
  );
};

export default PlaceOrder;
