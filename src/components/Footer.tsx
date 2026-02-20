"use client";

import Link from "next/link";
import { ArrowUp } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer>
      {/* CTA Section - Lime Green */}
      <section className="bg-[#C8FF00] text-black px-6 sm:px-10 py-16 sm:py-20">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row lg:justify-between gap-12">
          {/* Left - CTA */}
          <div>
            <p className="text-base font-medium mb-1">Got an idea?</p>
            <Link 
              href="/contact" 
              className="text-4xl sm:text-5xl lg:text-6xl font-medium hover:underline"
            >
              LET&apos;S TALK
            </Link>
          </div>

          {/* Right - Columns */}
          <div className="flex flex-wrap gap-12 sm:gap-16">
            <div>
              <h4 className="text-xs font-medium tracking-widest mb-4 opacity-70">SITEMAPS</h4>
              <ul className="space-y-2">
                <li><Link href="/" className="hover:underline">Home</Link></li>
                <li><Link href="/skills" className="hover:underline">About</Link></li>
                <li><Link href="/projects" className="hover:underline">Work</Link></li>
                <li><Link href="/contact" className="hover:underline">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-medium tracking-widest mb-4 opacity-70">SOCIALS</h4>
              <ul className="space-y-2">
                <li><a href="https://github.com/fatinm1" target="_blank" rel="noopener noreferrer" className="hover:underline">GitHub</a></li>
                <li><a href="https://www.linkedin.com/in/fatin-mojumder/" target="_blank" rel="noopener noreferrer" className="hover:underline">LinkedIn</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-medium tracking-widest mb-4 opacity-70">CONTACT</h4>
              <ul className="space-y-2">
                <li>UMBC, Maryland</li>
                <li><a href="mailto:fatinm1@umbc.edu" className="hover:underline">fatinm1@umbc.edu</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-black/20 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm opacity-80">© {new Date().getFullYear()} Fatin Mojumder. All Rights Reserved.</p>
          <p className="text-sm opacity-80">Made with love ❤️</p>
          <button
            onClick={scrollToTop}
            className="w-12 h-12 rounded-full bg-white border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        </div>
      </section>
    </footer>
  );
}
