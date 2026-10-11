import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="relative z-[1] mx-auto w-full max-w-[768px] px-6 pb-20 pt-20">
      <div className="flex flex-wrap justify-between gap-3 text-[13px] text-faint">
        <span>
          Elkridge, MD ·{" "}
          <a href="mailto:fatinm1@umbc.edu" className="text-faint hover:text-foreground">
            fatinm1@umbc.edu
          </a>
        </span>
        <span className="flex gap-4">
          <Link href="/chatbot" className="text-muted hover:text-foreground">
            Chatbot
          </Link>
          <Link href="/login" className="text-muted hover:text-foreground">
            Login
          </Link>
          <a href="#top" className="text-muted hover:text-foreground">
            Back to top ↑
          </a>
        </span>
      </div>
    </footer>
  );
}
