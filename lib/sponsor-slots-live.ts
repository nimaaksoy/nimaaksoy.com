import type Stripe from "stripe";

import { sponsorSlots, type SponsorSlot } from "@/lib/sponsor-slots";
import { getStripe } from "@/lib/stripe";

const dayMs = 24 * 60 * 60 * 1000;

function addMonths(date: Date, months: number) {
  const next = new Date(date);
  next.setUTCMonth(next.getUTCMonth() + months);
  return next;
}

function formatReservedUntil(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function sponsorFromSession(session: Stripe.Checkout.Session): SponsorSlot | null {
  const metadata = session.metadata || {};
  const slotId = metadata.slotId?.trim().toUpperCase();
  const baseSlot = sponsorSlots.find((slot) => slot.id === slotId);
  const months = metadata.months === "3" ? 3 : 1;
  const reservedUntil = addMonths(new Date(session.created * 1000), months);

  if (
    !baseSlot ||
    metadata.kind !== "sponsor_banner" ||
    session.payment_status !== "paid" ||
    reservedUntil.getTime() <= Date.now()
  ) {
    return null;
  }

  const name = metadata.company?.trim();
  const line = metadata.text?.trim();
  const href = metadata.url?.trim();
  const logo = metadata.logoUrl?.trim();

  if (!name || !line || !href || !logo) {
    return null;
  }

  return {
    ...baseSlot,
    name,
    line,
    href,
    logo,
    status: "taken",
    reservedUntil: formatReservedUntil(reservedUntil),
  };
}

export async function getSponsorSlots(): Promise<SponsorSlot[]> {
  try {
    const stripe = getStripe();
    const earliest = Math.floor((Date.now() - 100 * dayMs) / 1000);
    const sessions = await stripe.checkout.sessions.list({
      created: { gte: earliest },
      limit: 100,
      status: "complete",
    });
    const activeBySlot = new Map<string, SponsorSlot>();

    for (const session of sessions.data) {
      const sponsor = sponsorFromSession(session);

      if (sponsor && !activeBySlot.has(sponsor.id)) {
        activeBySlot.set(sponsor.id, sponsor);
      }
    }

    return sponsorSlots.map((slot) => activeBySlot.get(slot.id) || slot);
  } catch (error) {
    console.error("Sponsor slots could not be loaded from Stripe.", error);
    return sponsorSlots;
  }
}
