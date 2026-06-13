import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { X, ShieldCheck, BadgeCheck, Truck } from "lucide-react";
import { getProductReviews } from "../utils/reviewUtils";

const SizeChartModal = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState("clothes");

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-[15px] font-semibold text-gray-900">
            Size guide
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-black transition-colors"
          >
            <X size={18} strokeWidth={1.75} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 px-5 gap-0">
          {[
            { id: "clothes", label: "Clothing" },
            { id: "waist", label: "Waist / Bottoms" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2.5 px-4 text-[11px] font-semibold uppercase tracking-[0.08em] border-b-2 transition-all -mb-px ${
                activeTab === tab.id
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="p-5">
          <p className="text-[12px] text-gray-400 mb-4 leading-relaxed">
            All measurements are in centimetres. Measure over your base layer
            for the best fit.
          </p>

          {activeTab === "clothes" ? (
            <table className="w-full text-[13px]">
              <thead>
                <tr className="bg-gray-50">
                  {["Size", "Chest (cm)", "Waist (cm)", "Hip (cm)"].map((h) => (
                    <th
                      key={h}
                      className="text-left px-3 py-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-400 border-b border-gray-100"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["S", "86 – 91", "71 – 76", "91 – 96"],
                  ["M", "91 – 96", "76 – 81", "96 – 101"],
                  ["L", "96 – 101", "81 – 86", "101 – 107"],
                  ["XL", "101 – 107", "86 – 94", "107 – 114"],
                  ["XXL", "107 – 114", "94 – 102", "114 – 122"],
                ].map(([size, chest, waist, hip]) => (
                  <tr
                    key={size}
                    className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors"
                  >
                    <td className="px-3 py-2.5 font-semibold text-gray-900">
                      <span className="inline-block px-2 py-0.5 rounded-lg bg-gray-100 text-[11px]">
                        {size}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-gray-600">{chest}</td>
                    <td className="px-3 py-2.5 text-gray-600">{waist}</td>
                    <td className="px-3 py-2.5 text-gray-600">{hip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-[13px]">
              <thead>
                <tr className="bg-gray-50">
                  {["Waist (in)", "Waist (cm)", "Hip (cm)", "Inseam (cm)"].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left px-3 py-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-400 border-b border-gray-100"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {[
                  ["26", "66", "91", "76"],
                  ["28", "71", "96", "78"],
                  ["30", "76", "101", "79"],
                  ["32", "81", "106", "80"],
                  ["34", "86", "112", "81"],
                ].map(([inch, cm, hip, inseam]) => (
                  <tr
                    key={inch}
                    className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors"
                  >
                    <td className="px-3 py-2.5 font-semibold text-gray-900">
                      <span className="inline-block px-2 py-0.5 rounded-lg bg-gray-100 text-[11px]">
                        {inch}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-gray-600">{cm}</td>
                    <td className="px-3 py-2.5 text-gray-600">{hip}</td>
                    <td className="px-3 py-2.5 text-gray-600">{inseam}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div className="mt-4 flex gap-2 items-start rounded-xl bg-gray-50 border border-gray-100 px-4 py-3">
            <span className="text-gray-400 text-sm mt-0.5">💡</span>
            <p className="text-[12px] text-gray-500 leading-relaxed">
              Not sure? Size up. Our garments are cut slim — if you're between
              sizes, the larger one will give you a better fit.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart, token } = useContext(ShopContext);
  const navigate = useNavigate();

  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [showSizeChart, setShowSizeChart] = useState(false);
  const productReviews = productData ? getProductReviews(productData._id) : [];
  const reviewCount = productData
    ? 50 +
      (productData._id
        .split("")
        .reduce((sum, char) => sum + char.charCodeAt(0), 0) %
        450)
    : 0;

  const fetchProductData = async () => {
    const product = products.find((item) => item._id === productId);
    if (product) {
      setProductData(product);
      setImage(product.image[0]);
      setSize("");
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [productId, products]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setSize("");
  }, [productId]);

  const handleAddToCart = () => {
    if (!token) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }

    if (!size) {
      toast.error("Please select a size");
      return;
    }

    addToCart(productData._id, size);
    toast.success("Added to cart", { duration: 2000 });
  };

  return productData ? (
    <div className="border-t border-gray-200 pt-6 sm:pt-10 transition-opacity duration-500 opacity-100">
      {/* ── Main Product Section ── */}
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 xl:gap-20">
        {/* ══════════════════════════════
            IMAGE GALLERY
        ══════════════════════════════ */}
        <div className="w-full lg:w-[52%] xl:w-[50%]">
          {/* Desktop: side-by-side thumbnail rail + main image */}
          <div className="hidden sm:flex flex-row gap-3 h-[560px] lg:h-[620px]">
            {/* Vertical thumbnail rail */}
            <div
              className="flex flex-col gap-2.5 w-[82px] flex-shrink-0 overflow-y-auto pr-0.5 scroll-smooth"
              style={{ scrollbarWidth: "none" }}
            >
              {productData.image.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setImage(item)}
                  className={`w-full aspect-square flex-shrink-0 rounded-xl overflow-hidden focus:outline-none transition-all duration-200 border ${
                    image === item
                      ? "border-gray-900"
                      : "border-gray-200 hover:border-gray-500"
                  }`}
                >
                  <img
                    src={item}
                    alt={`${productData.name} ${index + 1}`}
                    className={`w-full h-full object-cover transition-all duration-200 ${
                      image === item
                        ? "opacity-100"
                        : "opacity-55 hover:opacity-80"
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Main image */}
            <div className="flex-1 rounded-2xl overflow-hidden bg-[#f5f5f3] relative group">
              <img
                src={image}
                alt={productData.name}
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.04]"
              />
            </div>
          </div>

          {/* Mobile: full-width main image + horizontal thumbnail strip */}
          <div className="sm:hidden flex flex-col gap-3">
            {/* Main image */}
            <div className="w-full rounded-2xl overflow-hidden bg-[#f5f5f3] aspect-[3/4]">
              <img
                src={image}
                alt={productData.name}
                className="w-full h-full object-cover object-center"
              />
            </div>

            {/* Horizontal thumbnail strip */}
            <div
              className="flex gap-2 overflow-x-auto pb-1"
              style={{ scrollbarWidth: "none" }}
            >
              {productData.image.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setImage(item)}
                  className={`flex-shrink-0 w-[70px] h-[70px] rounded-xl overflow-hidden focus:outline-none transition-all duration-200 border ${
                    image === item
                      ? "border-gray-900"
                      : "border-gray-200 hover:border-gray-500"
                  }`}
                >
                  <img
                    src={item}
                    alt={`${productData.name} ${index + 1}`}
                    className={`w-full h-full object-cover transition-all duration-200 ${
                      image === item
                        ? "opacity-100"
                        : "opacity-55 hover:opacity-80"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════
            PRODUCT INFO
        ══════════════════════════════ */}
        <div className="flex-1 flex flex-col justify-start py-0 sm:py-2">
          {/* Category tag */}
          <span className="text-[10.5px] tracking-[0.2em] uppercase text-gray-400 font-medium mb-3">
            {productData.category} / {productData.subCategory}
          </span>

          {/* Name */}
          <h1 className="text-2xl sm:text-[1.75rem] lg:text-[2rem] font-semibold leading-tight tracking-tight text-gray-900">
            {productData.name}
          </h1>

          {/* Stars + review count */}
          <div className="flex items-center gap-1.5 mt-3">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4].map((i) => (
                <img
                  key={i}
                  src={assets.star_icon}
                  alt="star"
                  className="w-[14px] h-[14px]"
                />
              ))}
              <img
                src={assets.star_dull_icon}
                alt="star"
                className="w-[14px] h-[14px]"
              />
            </div>
            <span className="text-[12px] text-gray-400 tracking-wide">4.0</span>
            <span className="text-gray-200 text-xs">|</span>
            <span className="text-[12px] text-gray-400">
              {reviewCount} Ratings
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 mt-5">
            <span className="text-[2rem] font-bold tracking-tight text-gray-900 leading-none">
              {currency}
              {productData.price}
            </span>
          </div>

          {/* Divider */}
          <div className="mt-5 mb-4 h-px w-full bg-gray-100" />

          {/* Description */}
          <p className="text-[13.5px] text-gray-500 leading-[1.9]">
            {productData.description}
          </p>

          {/* Size Selector */}
          <div className="mt-7">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold tracking-[0.15em] uppercase text-gray-800">
                  Select Size
                </span>
                {size && (
                  <span className="text-[11px] text-gray-400 font-normal normal-case tracking-normal">
                    — {size}
                  </span>
                )}
              </div>
              <button
                onClick={() => setShowSizeChart(true)}
                className="text-[11px] text-gray-400 hover:text-gray-800 underline underline-offset-2 transition-colors tracking-wide"
              >
                Size Guide
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {productData.sizes.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setSize(item)}
                  className={`w-[54px] h-[48px] text-[13px] font-medium rounded-xl border-[1.5px] transition-all duration-200 focus:outline-none ${
                    item === size
                      ? "border-gray-900 bg-gray-900 text-white shadow-lg shadow-gray-200"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-700 hover:text-gray-900"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Size error hint */}
            <p
              className={`mt-2 text-[11px] tracking-wide transition-all duration-200 ${size ? "opacity-0 select-none" : "text-gray-400 opacity-100"}`}
            >
              Please select a size to continue
            </p>
          </div>

          {/* Add to Cart CTA */}
          <button
            onClick={handleAddToCart}
            disabled={!size}
            className={`mt-4 w-full py-[15px] text-[11.5px] tracking-[0.22em] font-semibold rounded-2xl transition-all duration-200 uppercase ${
              size
                ? "bg-gray-900 text-white hover:bg-black active:scale-[0.985] shadow-md shadow-gray-200"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            Add to Cart
          </button>

          {/* Trust badges */}
          <div className="mt-5 grid grid-cols-3 gap-2">
            {[
              { Icon: BadgeCheck, label: "100% Original" },
              { Icon: Truck, label: "Cash on Delivery" },
              { Icon: ShieldCheck, label: "Secure Checkout" },
            ].map(({ Icon, label }, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-1.5 rounded-xl border border-gray-100 bg-gray-50/70 px-2 py-3 text-center"
              >
                <Icon size={15} strokeWidth={1.6} className="text-gray-400" />
                <span className="text-[10.5px] text-gray-500 leading-tight font-medium">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════
          DESCRIPTION & REVIEWS TABS
      ══════════════════════════════ */}
      <div className="mt-20 sm:mt-28">
        {/* Tab bar */}
        <div className="flex gap-0 border-b border-gray-100">
          <button className="px-5 sm:px-8 py-3.5 text-[11px] sm:text-[12px] uppercase tracking-[0.14em] font-semibold border-b-2 border-gray-900 text-gray-900 -mb-px focus:outline-none whitespace-nowrap">
            Reviews ({productReviews.length})
          </button>
        </div>
        {/* Reviews */}
        <div className="py-8 max-w-2xl flex flex-col gap-6">
          {productReviews.map((r, i) => (
            <div
              key={i}
              className="flex flex-col gap-2 pb-6 border-b border-gray-100 last:border-0 last:pb-0"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-[11px] font-semibold text-gray-500">
                    {r.name[0]}
                  </div>
                  <span className="text-[13px] font-semibold text-gray-800">
                    {r.name}
                  </span>
                </div>
                <span className="text-[11px] text-gray-400">{r.date}</span>
              </div>
              <div className="flex items-center gap-0.5 ml-9">
                {[1, 2, 3, 4, 5].map((star) => (
                  <img
                    key={star}
                    src={
                      star <= r.rating
                        ? assets.star_icon
                        : assets.star_dull_icon
                    }
                    alt=""
                    className="w-[12px] h-[12px]"
                  />
                ))}
              </div>
              <p className="text-[13px] text-gray-500 leading-[1.85] ml-9">
                {r.review}
              </p>
            </div>
          ))}
        </div>

        {/* Tab content */}
      </div>

      <RelatedProducts
        category={productData.category}
        subCategory={productData.subCategory}
      />

      {/* Size Chart Modal — rendered at root level of the page so overlay covers everything */}
      {showSizeChart && (
        <SizeChartModal onClose={() => setShowSizeChart(false)} />
      )}
    </div>
  ) : (
    <div className="opacity-0" />
  );
};

export default Product;
