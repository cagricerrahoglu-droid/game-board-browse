type PriceSource = {
  avg_online_sale_price?: number | string | null;
  min_retail_price_gbp?: number | string | null;
  min_retail_price?: number | string | null;
};

const toPositiveNumber = (value: number | string | null | undefined): number | null => {
  const numericValue = typeof value === "string" ? Number(value) : value;
  return typeof numericValue === "number" && Number.isFinite(numericValue) && numericValue > 0
    ? numericValue
    : null;
};

export const getSalePrice = (source: PriceSource): number | null => {
  return (
    toPositiveNumber(source.avg_online_sale_price) ??
    toPositiveNumber(source.min_retail_price_gbp) ??
    toPositiveNumber(source.min_retail_price)
  );
};

export const calculateMonthlyRentalPrice = (source: PriceSource): number => {
  const salePrice = getSalePrice(source);
  return salePrice ? Math.ceil(salePrice * 0.24) : 0;
};