import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
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
    <html lang="en" className={outfit.variable}>
      <body className="bg-black min-h-screen text-white">
        <Navigation />
        <main>{children}</main>
      </body>
    </html>
  );
}
