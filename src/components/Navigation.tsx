"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { href: "/", label: "HOME" },
    { href: "/projects", label: "WORK" },
    { href: "/skills", label: "ABOUT" },
    { href: "/chatbot", label: "CHATBOT" },
    { href: "/contact", label: "CONTACT" },
    { href: "/login", label: "LOGIN", className: "text-[#C8FF00]/80" }
  ];

  return (
    <nav className="bg-black border-b border-white/10 fixed w-full z-50 top-0 left-0">
      <div className="flex items-center justify-between px-6 sm:px-10 py-4">
        <Link href="/" className="font-bold text-lg sm:text-xl tracking-wide text-[#C8FF00] hover:text-[#C8FF00]/90 transition-colors">
          FATIN MOJUMDER
        </Link>
        
        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-6 lg:gap-8 text-sm lg:text-base font-medium tracking-wide">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link 
                href={item.href} 
                className={item.className || "text-[#C8FF00] hover:text-[#C8FF00]/80 transition-colors"}
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <Link 
              href="/contact#resume"
              className="px-4 py-2 rounded border border-[#C8FF00] bg-black text-[#C8FF00] hover:bg-[#C8FF00]/10 transition-colors"
            >
              RESUME
            </Link>
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors text-[#C8FF00]"
          aria-label="Toggle menu"
        >
          <div className="w-6 h-6 flex flex-col justify-center items-center gap-1">
            <span className={`block w-5 h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
            <span className={`block w-5 h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
            <span className={`block w-5 h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
          </div>
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <ul className="px-6 pb-6 space-y-2 border-t border-white/10 pt-4">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link 
                href={item.href} 
                className={`block py-3 px-4 rounded-lg hover:bg-white/5 transition-colors text-[#C8FF00] ${item.className || ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <Link 
              href="/contact#resume"
              className="block py-3 px-4 rounded-lg border border-[#C8FF00] text-[#C8FF00] hover:bg-[#C8FF00]/10"
              onClick={() => setIsMenuOpen(false)}
            >
              RESUME
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
