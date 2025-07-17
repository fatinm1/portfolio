"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/skills", label: "Skills" },
    { href: "/projects", label: "Projects" },
    { href: "/chatbot", label: "Chatbot" },
    { href: "/contact", label: "Contact" },
    { href: "/login", label: "Login", className: "text-cyan-400" }
  ];

  return (
    <nav className="backdrop-blur-md bg-white/10 border-b border-white/20 shadow-lg fixed w-full z-50 top-0 left-0">
      <div className="flex items-center justify-between px-4 sm:px-8 py-4">
        <div className="font-bold text-lg sm:text-xl tracking-wide">Fatin Mojumder</div>
        
        {/* Desktop Navigation */}
        <ul className="hidden md:flex gap-4 lg:gap-6 text-sm lg:text-lg font-medium">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link 
                href={item.href} 
                className={item.className || "hover:text-cyan-400 transition-colors"}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Toggle menu"
        >
          <div className="w-6 h-6 flex flex-col justify-center items-center">
            <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-1'}`}></span>
            <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
            <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1'}`}></span>
          </div>
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <ul className="px-4 pb-4 space-y-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link 
                href={item.href} 
                className={`block py-3 px-4 rounded-lg hover:bg-white/10 transition-colors ${item.className || ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
} 