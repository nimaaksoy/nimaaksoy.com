import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404 | Page not found",
  description: "The page you are looking for does not exist.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0A0A0A] px-6 py-16">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/nimaaksoy-hero-video.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />

      <div className="relative z-10 mx-auto w-full max-w-2xl rounded-2xl border border-[#1F1F1F] bg-[#0A0A0A]/72 p-8 text-center backdrop-blur-[2px] md:p-12">
        <p className="font-jetbrains text-[11px] uppercase tracking-[0.2em] text-[#2CFF05]">
          404 ERROR
        </p>
        <h1 className="mt-4 font-monroe text-[clamp(40px,7vw,64px)] font-light leading-[1.02] text-[#EAEAEA]">
          Page not found
        </h1>
        <p className="mx-auto mt-4 max-w-xl font-monroe text-[18px] italic text-[#9A9A9A]">
          This route is missing or has moved. Use one of the links below.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="signal-button inline-flex items-center rounded-full px-6 py-3 font-jetbrains text-[12px] uppercase tracking-[0.12em]"
          >
            Back home
          </Link>
          <Link
            href="/#connect"
            className="signal-button inline-flex items-center rounded-full px-6 py-3 font-jetbrains text-[12px] uppercase tracking-[0.12em]"
          >
            Connect
          </Link>
        </div>
      </div>
    </main>
  );
}
