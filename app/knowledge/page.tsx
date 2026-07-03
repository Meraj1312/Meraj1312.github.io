import Link from "next/link";

const categories = [
  {
    title: "Windows",
    description: "Active Directory, SMB, LDAP, Kerberos, WinRM and more.",
    href: "/knowledge/Windows",
  },
  {
    title: "Linux",
    description: "Linux privilege escalation, SSH, NFS, capabilities and more.",
    href: "/knowledge/Linux",
  },
  {
    title: "Active Directory",
    description: "Kerberos, BloodHound, ADCS, ACL Abuse and more.",
    href: "/knowledge/Active-Directory",
  },
  {
    title: "Web Application",
    description: "SQLi, XSS, SSTI, SSRF, File Uploads and more.",
    href: "/knowledge/Web-Application",
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
          Cyber Security Notes
        </h1>

        <p className="mt-5 max-w-3xl text-zinc-400 leading-8">
          My personal penetration testing knowledge base.
          Every note comes directly from GitHub and is updated
          automatically whenever I push new markdown files.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => (
          <Link
            key={category.title}
            href={category.href}
            className="
              group
              rounded-3xl
              border
              border-green-500/10
              bg-black/30
              backdrop-blur-xl
              p-8
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-green-500/30
            "
          >
            <h2 className="text-2xl font-bold group-hover:text-green-400 transition-colors">
              {category.title}
            </h2>

            <p className="mt-4 leading-7 text-zinc-400">
              {category.description}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}