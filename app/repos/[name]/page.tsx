import Link from "next/link";

const categories = [
  {
    title: "Windows",
    description:
      "Privilege Escalation, SMB, WinRM, PowerShell, Registry, AV Evasion, Credentials, Lateral Movement and more.",
    href: "/knowledge/windows",
  },
  {
    title: "Linux",
    description:
      "Linux Enumeration, Privilege Escalation, SSH, SUID, Capabilities, Cron Jobs, Docker, NFS and more.",
    href: "/knowledge/linux",
  },
  {
    title: "Active Directory",
    description:
      "Kerberos, LDAP, BloodHound, ADCS, Delegation, ACL Abuse, Post Exploitation and more.",
    href: "/knowledge/active-directory",
  },
  {
    title: "Web Application",
    description:
      "Authentication, SQL Injection, XSS, SSTI, SSRF, File Uploads, Deserialization and more.",
    href: "/knowledge/web-application",
  },
];

export default function KnowledgePage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-24">
      <div className="mb-16">
        <span className="rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs text-green-400">
          Knowledge Base
        </span>

        <h1 className="mt-5 text-5xl font-black">
          Cyber Security Knowledge
        </h1>

        <p className="mt-5 max-w-3xl leading-8 text-zinc-400">
          My personal penetration testing knowledge base. Every command,
          technique and cheat sheet comes directly from GitHub and updates
          automatically whenever I push new markdown files.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {categories.map((category) => (
          <Link
            key={category.title}
            href={category.href}
            className="
              group
              relative
              overflow-hidden
              rounded-3xl
              border
              border-green-500/10
              bg-black/30
              backdrop-blur-2xl
              p-8
              transition-all
              duration-500
              hover:-translate-y-1.5
              hover:border-green-500/30
              hover:bg-black/40
              hover:shadow-[0_0_40px_rgba(34,197,94,.15)]
            "
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            <div className="relative z-10">
              <h2 className="text-2xl font-bold transition-colors group-hover:text-green-400">
                {category.title}
              </h2>

              <p className="mt-4 leading-7 text-zinc-400">
                {category.description}
              </p>

              <div className="mt-8 inline-flex items-center text-sm text-green-400 opacity-0 transition-all duration-300 group-hover:translate-x-2 group-hover:opacity-100">
                Browse Notes →
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}