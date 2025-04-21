interface NumberToCurrency {
  amount: number;
  withCents?: boolean;
}

export const numberToCurrency = ({
  amount,
  withCents = false,
}: NumberToCurrency) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: withCents ? 2 : 0,
    maximumFractionDigits: withCents ? 2 : 0,
  }).format(amount);
};
