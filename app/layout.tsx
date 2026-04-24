import type { Metadata } from "next";
import { JetBrains_Mono, Manrope } from "next/font/google";
import "./globals.css";

const monroe = Manrope({
  variable: "--font-monroe",
  subsets: ["latin"],
  weight: ["300", "400"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nimaaksoy.com"),
  title: {
    default: "Nima Aksoy",
    template: "%s | Nima Aksoy",
  },
  description:
    "Building quietly. Connecting selectively. Working on things that matter.",
  applicationName: "Nima Aksoy",
  keywords: [
    "Nima Aksoy",
    "founder",
    "products",
    "startups",
    "technology",
    "writing",
  ],
  authors: [{ name: "Nima Aksoy", url: "https://nimaaksoy.com" }],
  creator: "Nima Aksoy",
  publisher: "Nima Aksoy",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://nimaaksoy.com",
    title: "Nima Aksoy",
    description:
      "Building quietly. Connecting selectively. Working on things that matter.",
    siteName: "Nima Aksoy",
    locale: "en_US",
    images: [
      {
        url: "https://res.cloudinary.com/dzu2boxnl/image/upload/v1777052489/og-image_hnypog.png",
        width: 1200,
        height: 630,
        alt: "Nima Aksoy site preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nima Aksoy",
    description:
      "Building quietly. Connecting selectively. Working on things that matter.",
    images: ["https://res.cloudinary.com/dzu2boxnl/image/upload/v1777052489/og-image_hnypog.png"],
    creator: "@Nima1980",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${monroe.variable} ${jetbrains.variable} dark h-full scroll-smooth`}
    >
      <body className="min-h-full bg-[#0A0A0A] text-[#EAEAEA] antialiased">
        {children}
      </body>
    </html>
  );
}
