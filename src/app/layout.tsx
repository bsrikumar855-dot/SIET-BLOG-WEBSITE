import type { Metadata } from "next";
import { Fraunces, Newsreader, Space_Grotesk } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-fraunces",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-newsreader",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "SIET News",
  description:
    "AI news, student writing, and the record of what we build at Sri Shakthi Institute of Engineering and Technology.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${newsreader.variable} ${spaceGrotesk.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
