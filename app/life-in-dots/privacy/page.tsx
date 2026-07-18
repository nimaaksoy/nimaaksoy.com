import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Life in Dots Privacy Policy",
  description:
    "Privacy policy for the Life in Dots Chrome extension, including its local data storage and data handling practices.",
  alternates: {
    canonical: "/life-in-dots/privacy",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const sectionClassName = "space-y-3";
const headingClassName =
  "font-jetbrains text-xs font-medium uppercase tracking-[0.14em] text-[#2CFF05]";

export default function LifeInDotsPrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#EAEAEA]">
      <header className="border-b border-[#1F1F1F]">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-6">
          <Link
            href="/life-in-dots"
            className="font-jetbrains text-xs font-medium uppercase tracking-[0.2em] transition-colors hover:text-[#2CFF05]"
          >
            Life in Dots
          </Link>
          <Link
            href="/life-in-dots"
            className="font-jetbrains text-[11px] uppercase tracking-[0.12em] text-[#9A9A9A] transition-colors hover:text-[#EAEAEA]"
          >
            Back to product
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-14 md:py-20">
        <article className="space-y-10 font-monroe text-[15px] leading-7 text-[#B8B8B8]">
          <div className="space-y-4 border-b border-[#1F1F1F] pb-10">
            <p className="font-jetbrains text-[11px] uppercase tracking-[0.16em] text-[#7F7F7F]">
              Chrome extension privacy policy
            </p>
            <h1 className="text-3xl font-normal tracking-tight text-[#EAEAEA] md:text-4xl">
              Life in Dots Privacy Policy
            </h1>
            <p>
              Effective date: July 18, 2026
              <br />
              Last updated: July 18, 2026
            </p>
          </div>

          <section className={sectionClassName}>
            <h2 className={headingClassName}>Overview</h2>
            <p>
              Life in Dots is a Chrome new-tab extension created by Nima Aksoy. It
              helps you visualize a personal timeline and record a daily intention.
              The extension works locally in your browser and does not require an
              account.
            </p>
          </section>

          <section className={sectionClassName}>
            <h2 className={headingClassName}>Information handled</h2>
            <p>The extension handles only information you enter or select:</p>
            <ul className="list-disc space-y-1 pl-6 marker:text-[#555]">
              <li>Your name, if you choose to provide it</li>
              <li>Your date of birth</li>
              <li>Your selected timeline age and sleep-hours setting</li>
              <li>Your display preferences</li>
              <li>Your daily intentions</li>
            </ul>
            <p>
              Life in Dots does not collect browsing history, website content,
              authentication information, financial information, health records, or
              precise location data. It does not use analytics, advertising trackers,
              or cookies.
            </p>
          </section>

          <section className={sectionClassName}>
            <h2 className={headingClassName}>How the information is used</h2>
            <p>
              The information is used only to provide the extension&apos;s visible
              features: calculating and displaying your timeline, personalizing the
              greeting, remembering your settings, and showing your saved daily
              intentions.
            </p>
          </section>

          <section className={sectionClassName}>
            <h2 className={headingClassName}>Storage and retention</h2>
            <p>
              All information is stored locally on your device using
              <code className="mx-1 rounded bg-[#151515] px-1.5 py-0.5 font-jetbrains text-xs text-[#D0D0D0]">
                chrome.storage.local
              </code>
              . The extension does not transmit this information to Nima Aksoy or to
              any external server. Information remains in local Chrome storage until
              you delete it, reset the extension, uninstall the extension, or Chrome
              otherwise clears the extension&apos;s storage.
            </p>
          </section>

          <section className={sectionClassName}>
            <h2 className={headingClassName}>Sharing and sale of data</h2>
            <p>
              Life in Dots does not sell, share, transfer, or disclose your information
              to third parties. The developer cannot view the information stored by the
              extension on your device. The information is not used for advertising,
              creditworthiness, lending, or any purpose unrelated to the extension&apos;s
              single purpose.
            </p>
          </section>

          <section className={sectionClassName}>
            <h2 className={headingClassName}>Chrome permission</h2>
            <p>
              The extension requests only the Chrome
              <code className="mx-1 rounded bg-[#151515] px-1.5 py-0.5 font-jetbrains text-xs text-[#D0D0D0]">
                storage
              </code>
              permission. This permission is used to save the information described
              above between new tabs and browser sessions. The extension requests no
              host permissions and does not access the pages you visit.
            </p>
          </section>

          <section className={sectionClassName}>
            <h2 className={headingClassName}>Your choices</h2>
            <p>
              You can edit your profile and settings at any time. You can remove all
              locally stored Life in Dots information with the “Forget my data” control
              in the extension&apos;s settings. You may also remove it by uninstalling the
              extension.
            </p>
          </section>

          <section className={sectionClassName}>
            <h2 className={headingClassName}>Policy changes</h2>
            <p>
              If the extension&apos;s data practices change, this policy will be updated
              before those changes take effect, and the updated date above will be
              revised. Material changes will also be reflected in the Chrome Web Store
              privacy disclosures.
            </p>
          </section>

          <section className={sectionClassName}>
            <h2 className={headingClassName}>Contact</h2>
            <p>
              For questions or requests about this privacy policy, contact Nima Aksoy
              at{" "}
              <a
                href="mailto:me@nimaaksoy.com?subject=Life%20in%20Dots%20privacy"
                className="text-[#2CFF05] underline decoration-[#2CFF05]/50 underline-offset-4 hover:decoration-[#2CFF05]"
              >
                me@nimaaksoy.com
              </a>
              .
            </p>
          </section>
        </article>
      </main>
    </div>
  );
}
