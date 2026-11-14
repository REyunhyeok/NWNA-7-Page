import Link from "next/link";
import type { Site } from "@prisma/client";
import { parseTags } from "@/lib/utils";

type Props = {
  site: Site & { author: { name: string }; _count: { likes: number; comments: number } };
};

export function hostOf(url: string) {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return url;
  }
}

/** 사이트 이름 첫 글자로 만든 썸네일 (외부 이미지 요청 없이 일정한 색) */
export function SiteThumb({ title, className = "h-28" }: { title: string; className?: string }) {
  const palettes = [
    "from-sky-500 to-indigo-600",
    "from-emerald-500 to-teal-600",
    "from-amber-500 to-orange-600",
    "from-fuchsia-500 to-purple-600",
    "from-rose-500 to-pink-600",
    "from-zinc-700 to-zinc-900",
  ];
  const idx = Array.from(title).reduce((a, c) => a + c.charCodeAt(0), 0) % palettes.length;
  return (
    <div className={`grid place-items-center bg-gradient-to-br ${palettes[idx]} ${className}`}>
      <span className="text-4xl font-bold text-white/90">{Array.from(title)[0]}</span>
    </div>
  );
}

export default function SiteCard({ site }: Props) {
  return (
    <Link
      href={`/sites/${site.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition hover:border-zinc-300 hover:shadow-md"
    >
      <SiteThumb title={site.title} />
      <div className="flex flex-1 flex-col p-5">
        <p className="truncate font-mono text-xs text-zinc-400">{hostOf(site.url)}</p>
        <h3 className="mt-1 line-clamp-1 font-semibold group-hover:text-brand-600">{site.title}</h3>
        <p className="mt-1 line-clamp-2 flex-1 text-sm text-zinc-600">{site.summary}</p>
        <div className="mt-3 flex flex-wrap gap-1">
          {parseTags(site.techStack).slice(0, 4).map((t) => (
            <span key={t} className="badge">{t}</span>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-3 text-xs text-zinc-500">
          <span>{site.author.name}</span>
          <span className="flex gap-3 font-mono">
            <span>♥ {site._count.likes}</span>
            <span>💬 {site._count.comments}</span>
            <span>👁 {site.views}</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
