import { headers } from "next/headers";

import { getOpenSponsorSlotIds } from "@/lib/sponsor-slots";
import { getSponsorSlots } from "@/lib/sponsor-slots-live";
import { getSponsorPriceId, getStripe } from "@/lib/stripe";

type SponsorCheckoutBody = {
  slotId?: string;
  months?: number;
  company?: string;
  url?: string;
  logoUrl?: string;
  text?: string;
  email?: string;
};

export async function POST(request: Request) {
  let body: SponsorCheckoutBody;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid checkout request." }, { status: 400 });
  }

  const slotId = body.slotId?.trim().toUpperCase();
  const months = body.months === 3 ? 3 : 1;
  const company = body.company?.trim();
  const url = body.url?.trim();
  const logoUrl = body.logoUrl?.trim();
  const text = body.text?.trim();
  const email = body.email?.trim();

  const sponsorSlots = await getSponsorSlots();
  const openSponsorSlotIds = getOpenSponsorSlotIds(sponsorSlots);

  if (!slotId || !openSponsorSlotIds.has(slotId)) {
    return Response.json({ error: "That sponsor slot is not open." }, { status: 400 });
  }

  if (!company || !url || !logoUrl || !text || !email) {
    return Response.json(
      { error: "Name, text, image, URL, and email are required." },
      { status: 400 },
    );
  }

  if (company.length > 28 || text.length > 72 || email.length > 80) {
    return Response.json({ error: "One of the fields is over the limit." }, { status: 400 });
  }

  let parsedUrl: URL;

  let parsedLogoUrl: URL;

  try {
    parsedUrl = new URL(url);
    parsedLogoUrl = new URL(logoUrl);
  } catch {
    return Response.json({ error: "Enter a valid URL." }, { status: 400 });
  }

  if (
    !["http:", "https:"].includes(parsedUrl.protocol) ||
    !["http:", "https:"].includes(parsedLogoUrl.protocol)
  ) {
    return Response.json({ error: "Enter a valid website URL." }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "Enter a valid email." }, { status: 400 });
  }

  const headersList = await headers();
  const origin =
    process.env.NEXT_PUBLIC_APP_URL ||
    headersList.get("origin") ||
    new URL(request.url).origin;

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      allow_promotion_codes: true,
      managed_payments: {
        enabled: false,
      },
      customer_email: email,
      line_items: [
        {
          price: getSponsorPriceId(months),
          quantity: 1,
        },
      ],
      success_url: `${origin}/sponsor?checkout=success&slot=${encodeURIComponent(
        slotId,
      )}&months=${months}&company=${encodeURIComponent(company)}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/sponsor?checkout=cancelled&slot=${encodeURIComponent(slotId)}`,
      client_reference_id: slotId,
      metadata: {
        kind: "sponsor_banner",
        slotId,
        months: String(months),
        company,
        text,
        url: parsedUrl.toString(),
        logoUrl: parsedLogoUrl.toString(),
        email,
      },
      payment_intent_data: {
        metadata: {
          kind: "sponsor_banner",
          slotId,
          months: String(months),
          company,
          email,
        },
      },
    });

    if (!session.url) {
      return Response.json({ error: "Checkout could not be started." }, { status: 500 });
    }

    return Response.json({
      checkoutUrl: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Checkout could not be started.";
    return Response.json({ error: message }, { status: 500 });
  }
}
