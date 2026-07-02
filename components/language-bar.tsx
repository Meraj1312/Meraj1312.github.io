import { langColor } from "@/lib/github"

export function LanguageBar({ languages }: { languages: Record<string, number> }) {
  const entries = Object.entries(languages).sort((a, b) => b[1] - a[1])
  const total = entries.reduce((sum, [, bytes]) => sum + bytes, 0)
  if (total === 0) return null

  return (
    <div>
      <div className="flex h-2 w-full overflow-hidden rounded-full">
        {entries.map(([lang, bytes]) => (
          <div
            key={lang}
            style={{ width: `${(bytes / total) * 100}%`, backgroundColor: langColor(lang) }}
            title={`${lang} ${((bytes / total) * 100).toFixed(1)}%`}
          />
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs">
        {entries.map(([lang, bytes]) => (
          <span key={lang} className="flex items-center gap-1.5 text-muted-foreground">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: langColor(lang) }}
            />
            <span className="text-foreground">{lang}</span>
            {((bytes / total) * 100).toFixed(1)}%
          </span>
        ))}
      </div>
    </div>
  )
}
