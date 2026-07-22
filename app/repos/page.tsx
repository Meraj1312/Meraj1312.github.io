import { CyberNav } from "@/components/cyber-nav";
import { ProjectGrid } from "@/components/projects/ProjectGrid";

export const revalidate = 1800;

export default function ProjectsPage() {
  return (
    <div className="relative min-h-screen">


      <main className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-14">
          <span className="rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs text-green-400">
            Projects
          </span>

          <h1 className="mt-5 text-5xl font-black">
            All Projects
          </h1>

          <p className="mt-5 max-w-2xl leading-8 text-zinc-400">
            Offensive security tools, research projects, exploit development,
            Active Directory labs, automation, and cybersecurity research.
          </p>
        </div>

        <ProjectGrid />
      </main>
    </div>
  );
}