import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
    <html lang="en">
      <body className="bg-gradient-to-br from-[#0f2027] via-[#2c5364] to-[#232526] min-h-screen text-white">
        <Navigation />
        <main className="pt-24">{children}</main>
      </body>
    </html>
  );
}
