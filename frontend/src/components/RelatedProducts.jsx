import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const RelatedProducts = ({ category, subCategory }) => {
  const { products } = useContext(ShopContext);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      const filteredProducts = products
        .filter((item) => item.category === category)
        .filter((item) => item.subCategory === subCategory);

      const shuffled = shuffleArray(filteredProducts).slice(0, 5);

      setRelated(shuffled);
    }
  }, [products, category, subCategory]);

  if (!related.length) return null;

  return (
    <section className="mt-24 border-t border-gray-100 pt-16">
      <div className="text-center mb-10">
        <Title text1={"RELATED"} text2={"PRODUCTS"} />

        <p className="mt-2 text-sm text-gray-500">
          Discover similar products you may like
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
        {related.map((item) => (
          <div
            key={item._id}
            className="group transition-all duration-300 hover:-translate-y-1"
          >
            <ProductItem
              id={item._id}
              name={item.name}
              price={item.price}
              image={item.image}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;
