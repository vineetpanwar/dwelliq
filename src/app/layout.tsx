import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, DM_Mono } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Dwelliq — AI Home Styling Advisor",
  description:
    "The first design tool where every furniture recommendation comes with three options — best within your budget, best if you can stretch, and best from a local shop near you.",
  openGraph: {
    title: "Dwelliq — AI Home Styling Advisor",
    description: "Make your home look intentionally designed, not assembled.",
    type: "website",
    url: "https://dwelliq-ten.vercel.app",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Dwelliq — AI Home Styling Advisor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dwelliq — AI Home Styling Advisor",
    description: "Make your home look intentionally designed, not assembled.",
    images: ["/opengraph-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${cormorant.variable} ${dmSans.variable} ${dmMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-cream text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
