import type { Metadata } from "next";
import Link from "next/link";
import { SiteChrome } from "@/components/SiteChrome";

export const metadata: Metadata = {
  title: "Nima Aksoy Today Terms of Service",
  description:
    "Terms of service for Nima Aksoy Today, including the website dashboard and planned Chrome new-tab extension.",
  alternates: {
    canonical: "/today/terms",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const sectionClassName = "space-y-3";
const headingClassName =
  "font-jetbrains text-xs font-medium uppercase tracking-[0.14em] text-[#2CFF05]";

export default function TodayTermsPage() {
  return (
    <SiteChrome active="today">
      <div className="mx-auto max-w-3xl px-6 py-14 md:py-20">
        <article className="space-y-10 font-monroe text-[15px] leading-7 text-[#B8B8B8]">
          <div className="space-y-4 border-b border-[#1F1F1F] pb-10">
            <p className="font-jetbrains text-[11px] uppercase tracking-[0.16em] text-[#7F7F7F]">
              Nima Aksoy Today terms of service
            </p>
            <h1 className="text-3xl font-normal tracking-tight text-[#EAEAEA] md:text-4xl">
              Nima Aksoy Today Terms of Service
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
              Nima Aksoy Today is a local-first daily dashboard created by Nima Aksoy. It is
              available at nimaaksoy.com/today and may later be offered as a Chrome
              extension that replaces the browser&apos;s default new-tab or new-page
              screen.
            </p>
          </section>

          <section className={sectionClassName}>
            <h2 className={headingClassName}>Using Today</h2>
            <p>
              You may use Nima Aksoy Today for personal productivity, date conversion, calendar
              viewing, currency conversion, private notes, and viewing public site or
              news updates. You are responsible for the information you enter and for
              keeping your browser, Google Account, and device secure.
            </p>
          </section>

          <section className={sectionClassName}>
            <h2 className={headingClassName}>Google Calendar connection</h2>
            <p>
              Google Calendar connection is optional and read-only. If you choose to
              connect Google Calendar, you authorize Nima Aksoy Today to request and display your
              calendar events inside the calendar interface. Today does not create,
              edit, or delete calendar events.
            </p>
            <p>
              You can revoke Nima Aksoy Today&apos;s Google Calendar access at any time from your
              Google Account permissions page.
            </p>
          </section>

          <section className={sectionClassName}>
            <h2 className={headingClassName}>Chrome extension</h2>
            <p>
              If Nima Aksoy Today is offered as a Chrome extension, it is intended to provide the
              same local-first dashboard experience when you open a new tab or new page.
              Extension permissions will be limited to the permissions needed for the
              visible dashboard features and local settings storage.
            </p>
          </section>

          <section className={sectionClassName}>
            <h2 className={headingClassName}>Third-party services and content</h2>
            <p>
              Nima Aksoy Today may rely on third-party services such as Google Calendar for
              optional calendar data, an exchange-rate provider for currency rates, and
              public web sources for news or site updates. Third-party services remain
              subject to their own terms and policies.
            </p>
          </section>

          <section className={sectionClassName}>
            <h2 className={headingClassName}>Accuracy and availability</h2>
            <p>
              Nima Aksoy Today is provided as a convenience tool. Calendar display, currency rates,
              public feeds, and date conversion should be checked before making important
              decisions. The service may change, be interrupted, or be discontinued.
            </p>
          </section>

          <section className={sectionClassName}>
            <h2 className={headingClassName}>Acceptable use</h2>
            <p>
              You agree not to misuse Nima Aksoy Today, interfere with its operation, attempt to
              bypass access controls, scrape the service at abusive volume, or use the
              service in a way that violates applicable laws or third-party rights.
            </p>
          </section>

          <section className={sectionClassName}>
            <h2 className={headingClassName}>No warranties</h2>
            <p>
              Nima Aksoy Today is provided “as is” and “as available,” without warranties of any
              kind. To the fullest extent permitted by law, Nima Aksoy disclaims all
              warranties related to reliability, availability, accuracy, and fitness for
              a particular purpose.
            </p>
          </section>

          <section className={sectionClassName}>
            <h2 className={headingClassName}>Limitation of liability</h2>
            <p>
              To the fullest extent permitted by law, Nima Aksoy will not be liable for
              indirect, incidental, special, consequential, or punitive damages, or for
              loss of data, profits, or business arising from use of Nima Aksoy Today.
            </p>
          </section>

          <section className={sectionClassName}>
            <h2 className={headingClassName}>Changes to these terms</h2>
            <p>
              These terms may be updated as Nima Aksoy Today evolves. If material changes are made,
              the updated date above will be revised. Continued use of Today after an
              update means you accept the updated terms.
            </p>
          </section>

          <section className={sectionClassName}>
            <h2 className={headingClassName}>Contact</h2>
            <p>
              For questions about these terms, contact Nima Aksoy at{" "}
              <a
                href="mailto:me@nimaaksoy.com?subject=Today%20terms"
                className="text-[#2CFF05] underline decoration-[#2CFF05]/50 underline-offset-4 hover:decoration-[#2CFF05]"
              >
                me@nimaaksoy.com
              </a>
              .
            </p>
          </section>

          <div className="border-t border-[#1F1F1F] pt-8">
            <Link
              href="/today/privacy"
              className="font-jetbrains text-[12px] uppercase tracking-[0.14em] text-[#2CFF05] transition-opacity hover:opacity-80"
            >
              Nima Aksoy Today privacy policy
            </Link>
          </div>
        </article>
      </div>
    </SiteChrome>
  );
}
