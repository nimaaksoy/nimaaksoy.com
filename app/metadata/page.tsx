import type { Metadata } from "next";

import { MetadataTool } from "@/components/metadata/MetadataTool";
import { SiteChrome } from "@/components/SiteChrome";
import { SponsorAdFrame } from "@/components/SponsorAdFrame";

export const metadata: Metadata = {
  title: "Metadata",
  description:
    "Inspect image, video, audio, EXIF, GPS, and file fingerprint metadata for free.",
  alternates: {
    canonical: "/metadata",
  },
  openGraph: {
    title: "Metadata | Nima Aksoy",
    description:
      "Free browser-based file metadata inspection for images, video, audio, EXIF, GPS, and hashes.",
    url: "https://nimaaksoy.com/metadata",
  },
};

export default function MetadataPage() {
  return (
    <SiteChrome active="tools">
      <div className="bg-[#0A0A0A] px-6 py-16 md:px-10 md:py-20">
        <SponsorAdFrame>
          <div className="mx-auto max-w-[1180px]">
            <header className="grid gap-8 md:grid-cols-[1fr_390px] md:items-end">
              <div>
                <p className="font-jetbrains text-[11px] uppercase tracking-[0.2em] text-[#7F7F7F]">
                  METADATA
                </p>
                <h1 className="mt-4 font-monroe text-[clamp(42px,9vw,72px)] font-light leading-[1.02] text-[#EAEAEA]">
                  Inspect embedded file data
                </h1>
              </div>
              <p className="font-monroe text-[18px] italic leading-[1.65] text-[#9A9A9A]">
                A free tool for checking what a file reveals before you share it:
                dimensions, duration, EXIF, GPS fields, timestamps, and a SHA-256 fingerprint.
                Uploaded files are deleted after processing.
              </p>
            </header>

            <section className="mt-10 grid gap-x-8 gap-y-6 border-y border-[#1F1F1F] py-6 sm:grid-cols-3">
              <div>
                <p className="font-monroe text-[38px] font-light leading-none text-[#2CFF05]">
                  Free
                </p>
                <p className="mt-2 font-jetbrains text-[10px] uppercase text-[#7F7F7F]">
                  No credits required
                </p>
              </div>
              <div>
                <p className="font-monroe text-[38px] font-light leading-none text-[#EAEAEA]">
                  Clean
                </p>
                <p className="mt-2 font-jetbrains text-[10px] uppercase text-[#7F7F7F]">
                  Strip metadata
                </p>
              </div>
              <div>
                <p className="font-monroe text-[38px] font-light leading-none text-[#EAEAEA]">
                  EXIF
                </p>
                <p className="mt-2 font-jetbrains text-[10px] uppercase text-[#7F7F7F]">
                  Image metadata
                </p>
              </div>
            </section>

            <section className="mt-10">
              <MetadataTool />
            </section>
          </div>
        </SponsorAdFrame>
      </div>
    </SiteChrome>
  );
}
