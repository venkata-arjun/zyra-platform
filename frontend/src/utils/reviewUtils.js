import { reviews } from "../data/reviews";

export const getProductReviews = (productId, count = 5) => {
  const seed = productId
    .split("")
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);

  const shuffled = [...reviews].sort((a, b) => {
    const aScore = (seed + a.name.charCodeAt(0) + a.review.length) % 100;

    const bScore = (seed + b.name.charCodeAt(0) + b.review.length) % 100;

    return aScore - bScore;
  });

  return shuffled.slice(0, count);
};
