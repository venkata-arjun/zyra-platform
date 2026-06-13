import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);

  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relevant");

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setCategory((prev) => [...prev, e.target.value]);
    }
  };

  const toggleSubCategory = (e) => {
    if (subCategory.includes(e.target.value)) {
      setSubCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setSubCategory((prev) => [...prev, e.target.value]);
    }
  };

  const activeFilterCount = category.length + subCategory.length;

  useEffect(() => {
    let productsCopy = [...products];

    // Search
    if (showSearch && search) {
      productsCopy = productsCopy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase()),
      );
    }

    // Category Filter
    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        category.includes(item.category),
      );
    }

    // Sub Category Filter
    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        subCategory.includes(item.subCategory),
      );
    }

    // Sorting
    switch (sortType) {
      case "low-high":
        productsCopy.sort((a, b) => a.price - b.price);
        break;

      case "high-low":
        productsCopy.sort((a, b) => b.price - a.price);
        break;

      default:
        // Fisher-Yates Shuffle for "Relevant"
        for (let i = productsCopy.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [productsCopy[i], productsCopy[j]] = [
            productsCopy[j],
            productsCopy[i],
          ];
        }
        break;
    }

    setFilterProducts(productsCopy);
  }, [products, category, subCategory, sortType, search, showSearch]);

  // ── Reusable checkbox group ──
  const FilterGroup = ({ title, options, checked, onChange }) => (
    <div className="border-b border-gray-100 py-5">
      <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-4">
        {title}
      </p>
      <div className="flex flex-col gap-3">
        {options.map((opt) => (
          <label
            key={opt}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative w-4 h-4 flex-shrink-0">
              <input
                type="checkbox"
                value={opt}
                checked={checked.includes(opt)}
                onChange={onChange}
                className="peer appearance-none w-4 h-4 border border-gray-300 rounded-sm checked:border-black checked:bg-black transition-all cursor-pointer"
              />
              <svg
                className="absolute inset-0 w-4 h-4 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M3 8l3.5 3.5L13 5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-sm text-gray-600 group-hover:text-black transition-colors">
              {opt}
            </span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col sm:flex-row gap-0 sm:gap-10 pt-10">
      {/* ── Filter Sidebar ── */}
      <div className="w-full sm:w-60 sm:min-w-[15rem] flex-shrink-0">
        {/* Mobile: Filter Toggle Bar */}
        <button
          onClick={() => setShowFilter(!showFilter)}
          className="sm:hidden w-full flex items-center justify-between px-4 py-3 border border-gray-200 bg-gray-50 rounded mb-2"
        >
          <div className="flex items-center gap-2">
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              className="text-gray-600"
            >
              <path
                d="M1 3h12M3 7h8M5 11h4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <span className="text-sm font-medium text-gray-700">Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-black text-white text-[10px] flex items-center justify-center leading-none">
                {activeFilterCount}
              </span>
            )}
          </div>
          <img
            src={assets.dropdown_icon}
            alt=""
            className={`h-3 transition-transform duration-200 ${showFilter ? "rotate-90" : ""}`}
          />
        </button>

        {/* Filter Panel */}
        <div
          className={`overflow-hidden transition-all duration-300 sm:block ${
            showFilter
              ? "max-h-[600px] opacity-100"
              : "max-h-0 opacity-0 sm:max-h-none sm:opacity-100"
          }`}
        >
          {/* Desktop label */}
          <p className="hidden sm:block text-xs font-semibold tracking-widest text-gray-400 uppercase mb-5">
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-2 text-black">({activeFilterCount})</span>
            )}
          </p>

          <FilterGroup
            title="Categories"
            options={["Men", "Women", "Kids"]}
            checked={category}
            onChange={toggleCategory}
          />

          <FilterGroup
            title="Type"
            options={["Topwear", "Bottomwear", "Winterwear"]}
            checked={subCategory}
            onChange={toggleSubCategory}
          />

          {/* Clear filters — only shown when active */}
          {activeFilterCount > 0 && (
            <button
              onClick={() => {
                setCategory([]);
                setSubCategory([]);
              }}
              className="mt-4 text-xs text-gray-400 underline underline-offset-2 hover:text-black transition-colors"
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>

      {/* ── Product Grid ── */}
      <div className="flex-1 min-w-0">
        {/* Header row */}
        <div className="flex items-center justify-between mb-6">
          <Title text1={"ALL"} text2={"COLLECTIONS"} />

          <select
            onChange={(e) => setSortType(e.target.value)}
            value={sortType}
            className="text-xs sm:text-sm border border-gray-200 bg-white text-gray-600 px-3 py-2 rounded outline-none hover:border-gray-400 transition-colors cursor-pointer"
          >
            <option value="relevant">Relevant</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
          </select>
        </div>

        {/* Results count */}
        <p className="text-xs text-gray-400 mb-5">
          {filterProducts.length}{" "}
          {filterProducts.length === 1 ? "product" : "products"}
        </p>

        {/* Grid */}
        {filterProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 gap-y-6 sm:gap-y-8">
            {filterProducts.map((item) => (
              <ProductItem
                key={item._id}
                id={item._id}
                image={item.image}
                name={item.name}
                price={item.price}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-gray-300 text-4xl mb-3">∅</p>
            <p className="text-sm text-gray-400">
              No products match your filters.
            </p>
            {activeFilterCount > 0 && (
              <button
                onClick={() => {
                  setCategory([]);
                  setSubCategory([]);
                }}
                className="mt-4 text-xs underline underline-offset-2 text-gray-400 hover:text-black transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Collection;
