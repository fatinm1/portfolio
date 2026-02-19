import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fatin Mojumder - Portfolio",
  description: "Senior CS Major at UMBC - Building smart systems for real-world impact",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={spaceGrotesk.variable}>
      <body className="bg-black min-h-screen text-white">
        <Navigation />
        <main>{children}</main>
      </body>
    </html>
  );
}
