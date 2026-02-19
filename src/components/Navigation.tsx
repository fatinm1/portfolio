"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Zap } from "lucide-react";

export default function Navigation() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isHome = pathname === "/";

  const navItems = [
    { id: "home", label: "Home", href: "/" },
    { id: "about", label: "About", href: "/#about" },
    { id: "work", label: "Work", href: "/#work" },
    { id: "projects", label: "Projects", href: "/#projects" },
    { id: "contact", label: "Contact", href: "/#contact" },
  ];

  const handleNavClick = (e: React.MouseEvent, id: string) => {
    if (isHome) {
      e.preventDefault();
      const el = id === "home" ? document.body : document.getElementById(id);
      el?.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed w-full z-50 top-0 left-0 bg-black/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-6xl mx-auto px-6 sm:px-10 py-4 flex items-center justify-between">
        {/* Left - Brand pill */}
        <Link
          href="/"
          onClick={(e) => handleNavClick(e, "home")}
          className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white font-medium text-sm hover:bg-white/10 transition-colors"
        >
          Fatin&apos;s Portfolio
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-6 text-sm text-white/90">
          {navItems.map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
                onClick={(e) => handleNavClick(e, item.id)}
                className="hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/#contact"
              onClick={(e) => handleNavClick(e, "contact")}
              className="px-4 py-2 rounded-full bg-white/5 border border-white/20 text-white text-sm hover:bg-white/10 transition-colors inline-flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              Get in touch
            </Link>
          </li>
          <li>
            <Link
              href="/chatbot"
              className="text-white/70 hover:text-white text-sm transition-colors"
            >
              Chatbot
            </Link>
          </li>
          <li>
            <Link
              href="/login"
              className="text-white/50 hover:text-white text-sm transition-colors"
            >
              Login
            </Link>
          </li>
        </ul>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 text-white"
          aria-label="Toggle menu"
        >
          <div className="w-6 h-6 flex flex-col justify-center gap-1">
            <span className={`block w-5 h-0.5 bg-current transition-all ${isMenuOpen ? "rotate-45 translate-y-1.5" : ""}`} />
            <span className={`block w-5 h-0.5 bg-current transition-all ${isMenuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-0.5 bg-current transition-all ${isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden overflow-hidden transition-all ${isMenuOpen ? "max-h-80" : "max-h-0"}`}>
        <ul className="px-6 pb-6 pt-2 space-y-2 border-t border-white/10">
          {navItems.map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
                onClick={(e) => handleNavClick(e, item.id)}
                className="block w-full text-left py-3 text-white/90 hover:text-white"
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/#contact"
              onClick={(e) => handleNavClick(e, "contact")}
              className="block py-3 text-[#C8FF00] font-medium"
            >
              Get in touch
            </Link>
          </li>
          <li>
            <Link href="/chatbot" className="block py-3 text-white/70">
              Chatbot
            </Link>
          </li>
          <li>
            <Link href="/login" className="block py-3 text-white/50">
              Login
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
