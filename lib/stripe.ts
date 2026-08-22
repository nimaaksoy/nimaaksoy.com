import Stripe from "stripe";

export function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is not configured.");
  }

  return new Stripe(secretKey, {
    apiVersion: "2026-07-29.dahlia",
    typescript: true,
  });
}

export function getSponsorPriceId(months: 1 | 3) {
  const priceId =
    months === 3
      ? process.env.STRIPE_SPONSOR_PRICE_3_MONTHS
      : process.env.STRIPE_SPONSOR_PRICE_1_MONTH;

  if (!priceId) {
    throw new Error(`Stripe sponsor ${months}-month price is not configured.`);
  }

  return priceId;
}
