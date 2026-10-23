import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { LocaleProvider } from "@/components/LocaleProvider";
import "./globals.css";

// Serif for the big questions, sans for everything you actually have to read.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hẹn hò nhé? · Are you free?",
  description:
    "A tiny interactive invite: say yes, pick a night, pick something to eat, and walk away with a plan you can copy.",
};

export const viewport: Viewport = {
  themeColor: "#f7f3ec",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}
