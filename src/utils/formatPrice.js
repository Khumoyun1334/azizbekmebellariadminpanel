export const formatPrice = (price) => {
  if (!price && price !== 0) return '0 so\'m';
  const numPrice = Number(price);
  const formattedNumber = numPrice.toLocaleString('uz-UZ');
  return formattedNumber + ' so\'m';
};

export const getDiscountPercent = (oldPrice, newPrice) => {
  if (!oldPrice || !newPrice) return 0;
  const old = Number(oldPrice);
  const newPriceNum = Number(newPrice);
  if (old <= newPriceNum) return 0;
  return Math.round(((old - newPriceNum) / old) * 100);
};