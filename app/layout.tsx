import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import AppWrapper from "./components/AppWrapper";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
  weight: ["300", "700", "900"],
  style: ["normal", "italic"],
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
    <html lang="en" className={`${inter.variable} ${montserrat.variable}`}>
      <body className="antialiased">
        <AppWrapper>{children}</AppWrapper>
      </body>
    </html>
  );
}


