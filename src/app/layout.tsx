import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

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
        <nav className="backdrop-blur-md bg-white/10 border-b border-white/20 shadow-lg fixed w-full z-50 top-0 left-0 flex items-center justify-between px-8 py-4">
          <div className="font-bold text-xl tracking-wide">Fatin Mojumder</div>
          <ul className="flex gap-8 text-lg font-medium">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/skills">Skills</Link></li>
            <li><Link href="/projects">Projects</Link></li>
            <li><Link href="/chatbot">Chatbot</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/login" className="text-cyan-400">Login</Link></li>
          </ul>
        </nav>
        <main className="pt-24">{children}</main>
      </body>
    </html>
  );
}
