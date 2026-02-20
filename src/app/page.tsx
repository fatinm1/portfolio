"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Zap, Send, CheckCircle, AlertCircle } from "lucide-react";

const slideIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.5 },
};

// Skills as tags for horizontal scroll
const SKILL_TAGS = [
  "Python", "C++", "Java", "JavaScript", "TypeScript", "React", "Next.js",
  "Django", "Flask", "FastAPI", "LangChain", "OpenAI", "MySQL", "PostgreSQL",
  "Docker", "Git", "Figma", "UI/UX", "AI/ML", "Visual Design", "Product Design",
];

// Tools marquee
const TOOLS = [
  "UMBC", "GitHub", "React", "OpenAI", "LangChain", "MySQL",
  "Python", "C++", "Java", "JavaScript", "TypeScript", "Django", "Flask", "FastAPI",
  "Git", "Figma", "VS Code", "Docker", "PostgreSQL", "Next.js", "Tailwind", "Node.js",
];

interface Project {
  name: string;
  description: string;
  technologies: string[];
  github: string;
  video?: string;
  tags?: string[];
}

interface Resume {
  id: number;
  filename: string;
  url: string;
  uploaded_at: string;
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [resume, setResume] = useState<Resume | null>(null);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingResume, setLoadingResume] = useState(true);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactError, setContactError] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.ok ? res.json() : [])
      .then((data) => setProjects(Array.isArray(data) ? data : []))
      .finally(() => setLoadingProjects(false));
    fetch("/api/resume")
      .then((res) => res.ok ? res.json() : { resume: null })
      .then((data) => setResume(data?.resume || null))
      .finally(() => setLoadingResume(false));
  }, []);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setContactError("");
    setContactSuccess(false);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setContactSuccess(true);
        setFormData({ name: "", email: "", message: "" });
        setTimeout(() => setContactSuccess(false), 5000);
      } else {
        setContactError(data.error || "Failed to send");
      }
    } catch {
      setContactError("Network error");
    } finally {
      setFormLoading(false);
    }
  };

  const handleResumeDownload = () => {
    if (resume) {
      const link = document.createElement("a");
      link.href = resume.url;
      link.download = resume.filename;
      link.click();
    }
  };

  const sectionClass = "scroll-mt-24 max-w-5xl mx-auto px-6 sm:px-10";
  const tagClass = "px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/80 text-sm whitespace-nowrap";

  return (
    <div className="pt-20">
      {/* Hero */}
      <section id="home" className={`${sectionClass} min-h-[85vh] flex flex-col justify-center py-24`}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/90 text-sm mb-8 w-fit"
          >
            Hello, I&apos;m Fatin 👋
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl font-medium text-white leading-tight mb-6"
          >
            <span className="text-white">Software engineer</span>
            <br />
            <span className="text-white/60">crafting smart systems & modern solutions</span>
          </motion.h1>
          <motion.a
            href="#contact"
            onClick={(e) => { e.preventDefault(); document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); }}
            className="btn-green inline-flex items-center gap-2 w-fit"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            Email me <ArrowUpRight className="w-4 h-4" />
          </motion.a>
        </motion.div>
      </section>

      {/* Moving headline - Technologies */}
      <section className="py-16 border-t border-white/10 overflow-hidden">
        <h2 className="text-sm font-medium tracking-[0.2em] text-white/50 text-center mb-10 uppercase">
          Technologies & Platforms
        </h2>
        <div className="flex animate-marquee whitespace-nowrap">
          {[...TOOLS, ...TOOLS].map((tool, i) => (
            <span key={`${tool}-${i}`} className="mx-8 text-white/40 text-lg font-medium">
              {tool}
            </span>
          ))}
        </div>
      </section>

      {/* About */}
      <motion.section id="about" className={`${sectionClass} py-24`} {...slideIn}>
        <span className={tagClass}>About</span>
        <h2 className="text-3xl sm:text-4xl font-medium text-white mt-6 mb-6">
          Solving real problems with purposeful, user-first thinking
        </h2>
        <p className="text-white/70 text-lg max-w-2xl mb-8 leading-relaxed">
          I&apos;m a software engineer who thrives on turning ambiguity into clarity. Whether it&apos;s building full-stack applications, 
          integrating AI, or designing seamless user experiences, I approach each problem with empathy, curiosity, and a strong sense of craft — 
          always putting users first and business goals in focus.
        </p>
        <motion.button
          onClick={handleResumeDownload}
          disabled={!resume || loadingResume}
          className="btn-green inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          View Resume <ArrowUpRight className="w-4 h-4" />
        </motion.button>
      </motion.section>

      {/* Skills - horizontal tags */}
      <motion.section className={`${sectionClass} py-24`} {...slideIn}>
        <span className={tagClass}>Skills</span>
        <h2 className="text-3xl sm:text-4xl font-medium text-white mt-6 mb-10">
          What I work with
        </h2>
        <div className="flex gap-3 overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide">
          {SKILL_TAGS.map((skill, i) => (
            <motion.span
              key={skill}
              className={`${tagClass} cursor-default`}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.02 }}
              whileHover={{ scale: 1.08, y: -2 }}
            >
              {skill}
            </motion.span>
          ))}
        </div>
      </motion.section>

      {/* Education */}
      <motion.section id="education" className={`${sectionClass} py-24`} {...slideIn}>
        <span className={tagClass}>Education</span>
        <h2 className="text-3xl sm:text-4xl font-medium text-white mt-6 mb-12">
          Education
        </h2>
        <motion.div
          className="bg-white/5 border border-white/10 p-6 rounded-xl"
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          whileHover={{ y: -2 }}
        >
          <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mb-2">
            <h3 className="text-white font-medium text-lg">B.S. Computer Science</h3>
            <span className="text-white/50 text-sm">2022 – Present</span>
          </div>
          <p className="text-white/60 text-sm mb-4">University of Maryland, Baltimore County (UMBC)</p>
          <p className="text-white/70 leading-relaxed">
            Senior standing. Focus on AI/ML, software engineering, and full-stack development. 
            Building smart systems for real-world impact through coursework and personal projects.
          </p>
        </motion.div>
      </motion.section>

      {/* Work Experience */}
      <motion.section id="work" className={`${sectionClass} py-24`} {...slideIn}>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <span className={tagClass}>Work Experience</span>
            <h2 className="text-3xl sm:text-4xl font-medium text-white mt-6">
              And This Is My Work Experience
            </h2>
          </div>
          <motion.button
            onClick={handleResumeDownload}
            disabled={!resume || loadingResume}
            className="btn-green inline-flex items-center gap-2 w-fit"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            View Resume <ArrowUpRight className="w-4 h-4" />
          </motion.button>
        </div>
        <div className="mt-12 space-y-6">
          <motion.div
            className="bg-white/5 border border-white/10 p-6 rounded-xl"
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            whileHover={{ y: -2 }}
          >
            <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mb-2">
              <h3 className="text-white font-medium text-lg">IT Assistant</h3>
              <span className="text-white/50 text-sm">May 2023 – December 2025</span>
            </div>
            <p className="text-white/60 text-sm mb-4">UMBC Graduate Admissions Office | Baltimore, MD</p>
            <p className="text-white/70 leading-relaxed">
              Digitized and processed 1,000+ student records with 100% accuracy, supporting enrollment operations. 
              Streamlined record-keeping through automated folder organization and indexing, reducing processing time by 25%. 
              Ensured secure handling of sensitive data across digital and physical systems.
            </p>
          </motion.div>
          <motion.div
            className="bg-white/5 border border-white/10 p-6 rounded-xl"
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            whileHover={{ y: -2 }}
          >
            <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mb-2">
              <h3 className="text-white font-medium text-lg">Software Developer</h3>
              <span className="text-white/50 text-sm">Projects & Freelance</span>
            </div>
            <p className="text-white/60 text-sm mb-4">Independent</p>
            <p className="text-white/70 leading-relaxed">
              End-to-end design and development for web applications, AI integrations, and data systems. 
              Delivered user-centric solutions across multiple tech stacks including Python, JavaScript, and React.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Projects */}
      <motion.section id="projects" className={`${sectionClass} py-24`} {...slideIn}>
        <span className={tagClass}>Portfolio</span>
        <h2 className="text-3xl sm:text-4xl font-medium text-white mt-6 mb-12">
          My Latest Projects
        </h2>
        {loadingProjects ? (
          <p className="text-white/50">Loading projects...</p>
        ) : projects.length === 0 ? (
          <p className="text-white/50">No projects yet. Add some in the admin panel!</p>
        ) : (
          <div className="space-y-16">
            {projects.map((project, idx) => (
              <motion.div
                key={idx}
                className="grid md:grid-cols-2 gap-8 items-center"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <motion.div
                  className="bg-white/5 border border-white/10 aspect-video rounded-xl flex items-center justify-center overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                >
                  {project.video && (project.video.includes("youtube") || project.video.includes("vimeo")) ? (
                    <a href={project.video} target="_blank" rel="noopener noreferrer" className="text-[#C8FF00] text-sm hover:underline">
                      Watch Video →
                    </a>
                  ) : project.video ? (
                    <video src={project.video} className="w-full h-full object-cover" muted playsInline />
                  ) : (
                    <span className="text-white/30 text-sm">No preview</span>
                  )}
                </motion.div>
                <motion.div
                  className="bg-white/5 border border-white/10 p-6 rounded-xl"
                  whileHover={{ y: -4 }}
                >
                  <p className="text-white/50 text-sm mb-1">2024</p>
                  <h3 className="text-xl font-medium text-white mb-3">{project.name}</h3>
                  <p className="text-white/70 mb-4 line-clamp-3">{project.description}</p>
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-green inline-flex items-center gap-2 text-sm px-5 py-2.5"
                  >
                    View case study <ArrowUpRight className="w-4 h-4" />
                  </a>
                </motion.div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.section>

      {/* Contact */}
      <motion.section id="contact" className={`${sectionClass} py-24`} {...slideIn}>
        <span className={tagClass}>Contact</span>
        <h2 className="text-4xl sm:text-5xl font-medium text-white mt-6 mb-4">
          Let&apos;s Get in Touch
        </h2>
        <p className="text-white/70 text-lg mb-10">
          Let&apos;s connect and start with your project ASAP.
        </p>
        {contactSuccess && (
          <div className="mb-6 p-4 rounded-lg bg-green-500/20 border border-green-500/30 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <p className="text-green-400">Thank you! I&apos;ll get back soon.</p>
          </div>
        )}
        {contactError && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <p className="text-red-400">{contactError}</p>
          </div>
        )}
        <motion.form
          onSubmit={handleContactSubmit}
          className="bg-white/5 border border-white/10 max-w-lg space-y-4 p-8 rounded-2xl"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
            required
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#C8FF00]"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
            required
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#C8FF00]"
          />
          <textarea
            name="message"
            placeholder="Message"
            value={formData.message}
            onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
            required
            rows={4}
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#C8FF00] resize-none"
          />
          <motion.button
            type="submit"
            disabled={formLoading}
            className="btn-green inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {formLoading ? "Sending..." : "Drop me a message"} <Send className="w-4 h-4" />
          </motion.button>
        </motion.form>
        <p className="text-white/50 mt-6 text-sm">
          Or email me at{" "}
          <a href="mailto:fatinm1@umbc.edu" className="text-[#C8FF00] hover:underline">
            fatinm1@umbc.edu
          </a>
        </p>
      </motion.section>

      {/* Footer */}
      <footer className="bg-[#111] border-t border-white/10 py-16 px-6 sm:px-10 mt-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:justify-between gap-12">
          <div>
            <h3 className="text-xl font-medium text-white mb-2">Fatin&apos;s Portfolio</h3>
            <p className="text-white/60 mb-2">Software engineer crafting smart systems & modern solutions</p>
            <a href="mailto:fatinm1@umbc.edu" className="text-white/60 hover:text-[#C8FF00] transition-colors">
              fatinm1@umbc.edu
            </a>
          </div>
          <div className="flex gap-16">
            <div>
              <h4 className="text-xs font-medium tracking-wider text-white/50 mb-4">NAVIGATION</h4>
              <ul className="space-y-2">
                <li><button onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })} className="text-white/70 hover:text-white">Work</button></li>
                <li><button onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })} className="text-white/70 hover:text-white">About</button></li>
                <li><button onClick={() => document.getElementById("education")?.scrollIntoView({ behavior: "smooth" })} className="text-white/70 hover:text-white">Education</button></li>
                <li><button onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })} className="text-white/70 hover:text-white text-left">Contact me</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-medium tracking-wider text-white/50 mb-4">SOCIALS</h4>
              <ul className="space-y-2">
                <li><a href="https://github.com/fatinm1" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white">GitHub</a></li>
                <li><a href="https://www.linkedin.com/in/fatin-mojumder/" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white">LinkedIn</a></li>
              </ul>
            </div>
          </div>
        </div>
        <p className="max-w-5xl mx-auto mt-12 pt-8 border-t border-white/10 text-white/40 text-sm">
          Made with love ❤️
        </p>
      </footer>
    </div>
  );
}
