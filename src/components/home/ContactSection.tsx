"use client";

import { useState } from "react";
import { Reveal, SectionHeading } from "./Reveal";

const inputClass =
  "w-full rounded-xl border border-border bg-white/[.03] px-4 py-3 text-[15px] text-foreground placeholder:text-faint focus:border-accent focus:outline-none";

export default function ContactSection() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError("");
    setSent(false);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setSent(true);
        setFormData({ name: "", email: "", message: "" });
      } else {
        setError(data.error || "Failed to send");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const update = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <Reveal id="contact" className="flex flex-col gap-3.5">
      <SectionHeading>Contact</SectionHeading>
      <p className="m-0 text-[15px] leading-[1.65] text-muted">
        Hiring for a new grad role, or want to talk about a project? Send a note here or email{" "}
        <a href="mailto:fatinm1@umbc.edu" className="text-foreground underline decoration-[#2a2a30] underline-offset-4 hover:decoration-accent">
          fatinm1@umbc.edu
        </a>
        .
      </p>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 rounded-2xl border border-border bg-white/[.02] p-5 sm:p-6"
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-[13px] text-muted">
            Name
            <input type="text" name="name" autoComplete="name" required maxLength={255} value={formData.name} onChange={update("name")} className={inputClass} />
          </label>
          <label className="flex flex-col gap-1.5 text-[13px] text-muted">
            Email
            <input type="email" name="email" autoComplete="email" required maxLength={255} value={formData.email} onChange={update("email")} className={inputClass} />
          </label>
        </div>
        <label className="flex flex-col gap-1.5 text-[13px] text-muted">
          Message
          <textarea name="message" required rows={4} maxLength={5000} value={formData.message} onChange={update("message")} className={`${inputClass} resize-none`} />
        </label>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={sending}
            className="silk-pill silk-primary rounded-full bg-accent px-[18px] py-[11px] text-sm font-medium text-[#0a0a0a] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {sending ? "Sending..." : "Send message"}
          </button>
          <p role="status" aria-live="polite" className="m-0 text-sm">
            {sent ? <span className="text-success">Thanks, I&apos;ll get back to you soon.</span> : null}
            {error ? <span className="text-red-400">{error}</span> : null}
          </p>
        </div>
      </form>
    </Reveal>
  );
}
