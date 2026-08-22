import { getSponsorSlots } from "@/lib/sponsor-slots-live";

export const dynamic = "force-dynamic";

export async function GET() {
  const slots = await getSponsorSlots();

  return Response.json({ slots });
}
