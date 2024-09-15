export const formatPrice = (price: number): string => {
  return (Math.floor(price) / 100).toFixed(2).toString().replace('.', ',');
};
