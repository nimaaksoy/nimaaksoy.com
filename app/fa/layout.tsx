import { Vazirmatn } from "next/font/google";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500"],
  display: "swap",
  variable: "--font-vazirmatn",
});

export default function FaLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      lang="fa"
      dir="rtl"
      className={`${vazirmatn.variable} font-[family-name:var(--font-vazirmatn)]`}
    >
      {children}
    </div>
  );
}
