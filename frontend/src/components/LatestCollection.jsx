import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

const LatestCollection = () => {
  const { products } = useContext(ShopContext);

  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    if (!products.length) return;

    // Fisher-Yates Shuffle
    const shuffledProducts = [...products];

    for (let i = shuffledProducts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [shuffledProducts[i], shuffledProducts[j]] = [
        shuffledProducts[j],
        shuffledProducts[i],
      ];
    }

    // Display only 10 randomly mixed products
    setLatestProducts(shuffledProducts.slice(0, 10));
  }, [products]);

  return (
    <div className="my-16 sm:my-20">
      {/* Section Header */}
      <div className="text-center mb-10 sm:mb-12">
        <Title text1={"LATEST"} text2={"COLLECTIONS"} />

        <p className="mt-3 mx-auto max-w-md text-xs sm:text-sm text-gray-500 leading-relaxed px-4 sm:px-0">
          Discover the newest styles at ZYRA, crafted for comfort, confidence,
          and everyday fashion.
        </p>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 gap-y-7 sm:gap-y-8">
        {latestProducts.map((item) => (
          <ProductItem
            key={item._id}
            id={item._id}
            image={item.image}
            name={item.name}
            price={item.price}
          />
        ))}
      </div>
    </div>
  );
};

export default LatestCollection;
