import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ChatbotWidget from "@/components/ChatbotWidget";
import CommandMenu from "@/components/CommandMenu";
import ViewTransitions from "@/components/ViewTransitions";

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

const SITE_TITLE = "Fatin Mojumder, Software Engineer";
const SITE_DESCRIPTION =
  "Software engineer building AI agents, inference engines and full stack apps. CS at UMBC, graduating December 2026 and open to new grad roles from January 2027.";

export const metadata: Metadata = {
  metadataBase: new URL("https://fatin.dev"),
  title: { default: SITE_TITLE, template: "%s | Fatin Mojumder" },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Fatin Mojumder",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#040406",
  colorScheme: "dark",
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
        <CommandMenu />
        <ViewTransitions />
      </body>
    </html>
  );
}
