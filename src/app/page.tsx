import SilkBackground from "@/components/SilkBackground";
import Hero from "@/components/home/Hero";
import Stats from "@/components/home/Stats";
import Experience from "@/components/home/Experience";
import Education from "@/components/home/Education";
import ProjectsSection from "@/components/home/ProjectsSection";
import TechMarquee from "@/components/home/TechMarquee";
import GitHubActivity from "@/components/home/GitHubActivity";
import LatestWriting from "@/components/home/LatestWriting";
import ContactSection from "@/components/home/ContactSection";

export default function Home() {
  return (
    <>
      <SilkBackground />
      <div className="content-column pt-20">
        <Hero />
        <Stats />
        <Experience />
        <Education />
        <ProjectsSection />
        <TechMarquee />
        <GitHubActivity />
        <LatestWriting />
        <ContactSection />
      </div>
    </>
  );
}
