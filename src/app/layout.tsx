import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ChatbotWidget from "@/components/ChatbotWidget";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
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
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="bg-background min-h-screen text-foreground">
        <SiteHeader />
        {/* Own stacking context so a page's SilkBackground (z-index -1) sits just beneath its content */}
        <main className="relative z-[1]">{children}</main>
        <SiteFooter />
        <ChatbotWidget />
      </body>
    </html>
  );
}
