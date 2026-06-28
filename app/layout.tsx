import type { Metadata } from "next";
import { Bricolage_Grotesque, Instrument_Serif, Inter } from "next/font/google";
import "./globals.css";
import AppWrapper from "./components/AppWrapper";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bricolage",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
  variable: "--font-instrument-serif",
});

export const metadata: Metadata = {
  title: "Ved AI | The World's Best Meta-Learning Agent",
  description:
    "We are building the world's best Meta-Learning Agent. Learns how you learn, and teaches you to mastery. Enabling a billion geniuses.",
  keywords: [
    "AI Tutor",
    "Meta-Learning",
    "Personal Education",
    "Deep Tech",
    "EdTech",
    "Artificial Intelligence",
  ],
  authors: [{ name: "Ved AI" }],
  openGraph: {
    title: "Ved AI | The World's Best Meta-Learning Agent",
    description: "Learns how you learn, and teaches you to mastery.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ved AI | Meta-Learning Agent",
    description: "Enabling a billion geniuses.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bricolage.variable} ${inter.variable} ${instrumentSerif.variable}`}>
      <body className="antialiased">
        <AppWrapper>{children}</AppWrapper>
      </body>
    </html>
  );
}
