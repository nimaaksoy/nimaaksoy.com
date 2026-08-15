import type { Metadata } from "next";
import Link from "next/link";
import { SiteChrome } from "@/components/SiteChrome";

export const metadata: Metadata = {
  title: "Today Privacy Policy",
  description:
    "Privacy policy for Today by Nima Aksoy, including Google Calendar access, local browser storage, and the planned Chrome new-tab extension.",
  alternates: {
    canonical: "/today/privacy",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const sectionClassName = "space-y-3";
const headingClassName =
  "font-jetbrains text-xs font-medium uppercase tracking-[0.14em] text-[#2CFF05]";
const codeClassName = "mx-1 rounded bg-[#151515] px-1.5 py-0.5 font-jetbrains text-xs text-[#D0D0D0]";

export default function TodayPrivacyPage() {
  return (
    <SiteChrome active="tools">
      <div className="mx-auto max-w-3xl px-6 py-14 md:py-20">
        <article className="space-y-10 font-monroe text-[15px] leading-7 text-[#B8B8B8]">
          <div className="space-y-4 border-b border-[#1F1F1F] pb-10">
            <p className="font-jetbrains text-[11px] uppercase tracking-[0.16em] text-[#7F7F7F]">
              Today privacy policy
            </p>
            <h1 className="text-3xl font-normal tracking-tight text-[#EAEAEA] md:text-4xl">
              Today Privacy Policy
            </h1>
            <p>
              Effective date: August 16, 2026
              <br />
              Last updated: August 16, 2026
            </p>
          </div>

          <section className={sectionClassName}>
            <h2 className={headingClassName}>Overview</h2>
            <p>
              Today is a local-first daily dashboard created by Nima Aksoy. It
              provides calendar views, Gregorian and Persian date conversion,
              currency conversion, a private daily note, latest site updates, and
              optional Google Calendar display. A future Chrome extension may use
              Today as the default page shown when opening a new tab or new page.
            </p>
          </section>

          <section className={sectionClassName}>
            <h2 className={headingClassName}>Information you provide or choose</h2>
            <p>Today may handle the following information only when you use the related feature:</p>
            <ul className="list-disc space-y-1 pl-6 marker:text-[#555]">
              <li>Daily note text that you type into the Today note panel</li>
              <li>Your selected language preference</li>
              <li>Currency amounts and selected currency pairs shown in the converter</li>
              <li>Dates selected in the Gregorian and Persian date converter</li>
              <li>Google Calendar event data, only if you choose to connect Google Calendar</li>
            </ul>
          </section>

          <section className={sectionClassName}>
            <h2 className={headingClassName}>Google Calendar data</h2>
            <p>
              Google Calendar connection is optional. If you connect it, Today requests
              the read-only Google Calendar events permission:
              <code className={codeClassName}>https://www.googleapis.com/auth/calendar.events.readonly</code>
              . This access is used only to show your calendar events inside the Today
              calendar view, including event indicators and event tooltips.
            </p>
            <p>
              Today does not create, edit, delete, sell, transfer, or share your Google
              Calendar events. Calendar event data is requested directly from Google in
              your browser and is not stored on Nima Aksoy servers. The Google access
              token is used in the browser session for the visible calendar feature and
              is not saved to the application server.
            </p>
            <p>
              Today&apos;s use of information received from Google Workspace APIs will
              adhere to the Google API Services User Data Policy, including the Limited
              Use requirements.
            </p>
          </section>

          <section className={sectionClassName}>
            <h2 className={headingClassName}>Local storage</h2>
            <p>
              The Today note and language preference are stored locally in your browser
              using
              <code className={codeClassName}>localStorage</code>
              . In the planned Chrome extension, equivalent settings and notes may be
              stored locally using
              <code className={codeClassName}>chrome.storage.local</code>
              . This local information remains on your device unless you clear browser
              storage, reset extension data, or uninstall the extension.
            </p>
          </section>

          <section className={sectionClassName}>
            <h2 className={headingClassName}>Server requests and third-party services</h2>
            <p>
              Today may request currency rates from a server-side endpoint so the
              currency API key is not exposed in the browser. That request does not
              require a user account and is not used to store personal data. Today also
              displays public site content and public Telegram posts from Vahid Online
              as a latest-news panel.
            </p>
          </section>

          <section className={sectionClassName}>
            <h2 className={headingClassName}>No ads, sale, or profiling</h2>
            <p>
              Today does not use Google Calendar data or local note data for advertising,
              retargeting, creditworthiness, lending, data brokerage, or model training.
              Today does not sell personal information.
            </p>
          </section>

          <section className={sectionClassName}>
            <h2 className={headingClassName}>Your choices and deletion</h2>
            <p>
              You can disconnect Today&apos;s Google Calendar access from your Google
              Account permissions page at any time. You can delete local Today data by
              clearing site data for nimaaksoy.com in your browser. In the future Chrome
              extension, you may also delete local data by resetting or uninstalling the
              extension.
            </p>
          </section>

          <section className={sectionClassName}>
            <h2 className={headingClassName}>Policy changes</h2>
            <p>
              If Today&apos;s data practices change, this policy will be updated before
              those changes take effect, and the updated date above will be revised.
              Material changes for the Chrome extension will also be reflected in Chrome
              Web Store privacy disclosures.
            </p>
          </section>

          <section className={sectionClassName}>
            <h2 className={headingClassName}>Contact</h2>
            <p>
              For questions or requests about this privacy policy, contact Nima Aksoy at{" "}
              <a
                href="mailto:me@nimaaksoy.com?subject=Today%20privacy"
                className="text-[#2CFF05] underline decoration-[#2CFF05]/50 underline-offset-4 hover:decoration-[#2CFF05]"
              >
                me@nimaaksoy.com
              </a>
              .
            </p>
          </section>

          <div className="border-t border-[#1F1F1F] pt-8">
            <Link
              href="/today/terms"
              className="font-jetbrains text-[12px] uppercase tracking-[0.14em] text-[#2CFF05] transition-opacity hover:opacity-80"
            >
              Today terms of service
            </Link>
          </div>
        </article>
      </div>
    </SiteChrome>
  );
}
