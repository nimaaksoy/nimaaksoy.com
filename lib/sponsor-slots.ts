export type SponsorSlot = {
  id: string;
  rail: "left" | "right";
  name: string;
  line: string;
  href: string;
  logo: string;
  status: "taken" | "open";
  impressions?: number;
  clicks?: number;
  reservedUntil?: string;
};

export const sponsorSlots: SponsorSlot[] = [
  {
    id: "L1",
    rail: "left",
    name: "Open slot",
    line: "Fixed placement for a builder audience.",
    href: "#buy-L1",
    logo: "/sponsor-assets/logos/open-l3.svg",
    status: "open",
  },
  {
    id: "L2",
    rail: "left",
    name: "Open slot",
    line: "Fixed placement for a builder audience.",
    href: "#buy-L2",
    logo: "/sponsor-assets/logos/open-l4.svg",
    status: "open",
  },
  {
    id: "L3",
    rail: "left",
    name: "Open slot",
    line: "Fixed placement for a builder audience.",
    href: "#buy-L3",
    logo: "/sponsor-assets/logos/open-l3.svg",
    status: "open",
  },
  {
    id: "L4",
    rail: "left",
    name: "Open slot",
    line: "Fixed placement for a builder audience.",
    href: "#buy-L4",
    logo: "/sponsor-assets/logos/open-l4.svg",
    status: "open",
  },
  {
    id: "R1",
    rail: "right",
    name: "Open slot",
    line: "For tools builders should notice.",
    href: "#buy-R1",
    logo: "/sponsor-assets/logos/open-r2.svg",
    status: "open",
  },
  {
    id: "R2",
    rail: "right",
    name: "Open slot",
    line: "For tools builders should notice.",
    href: "#buy-R2",
    logo: "/sponsor-assets/logos/open-r2.svg",
    status: "open",
  },
  {
    id: "R3",
    rail: "right",
    name: "Open slot",
    line: "For tools builders should notice.",
    href: "#buy-R3",
    logo: "/sponsor-assets/logos/open-r2.svg",
    status: "open",
  },
  {
    id: "R4",
    rail: "right",
    name: "Open slot",
    line: "For tools builders should notice.",
    href: "#buy-R4",
    logo: "/sponsor-assets/logos/open-r4.svg",
    status: "open",
  },
];

export const openSponsorSlots = sponsorSlots.filter((slot) => slot.status === "open");
export const openSponsorSlotIds = new Set(openSponsorSlots.map((slot) => slot.id));

export function getOpenSponsorSlotIds(slots: SponsorSlot[]) {
  return new Set(
    slots.filter((slot) => slot.status === "open").map((slot) => slot.id),
  );
}
