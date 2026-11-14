import Link from "next/link";
import type { Skill } from "@prisma/client";
import { SKILL_CATEGORIES, type SkillCategory } from "@/lib/validators";
import { formatDate, parseTags } from "@/lib/utils";

type Props = {
  skill: Skill & { author: { name: string }; _count: { likes: number; comments: number } };
};

export default function SkillCard({ skill }: Props) {
  return (
    <Link href={`/skills/${skill.id}`} className="card group flex flex-col transition hover:border-zinc-300 hover:shadow-md">
      <div className="flex items-center justify-between">
        <span className="badge bg-brand-50 text-brand-700">
          {SKILL_CATEGORIES[skill.category as SkillCategory] ?? skill.category}
        </span>
        <span className="font-mono text-xs text-zinc-400">{formatDate(skill.createdAt)}</span>
      </div>
      <h3 className="mt-3 line-clamp-1 font-semibold group-hover:text-brand-600">{skill.title}</h3>
      <p className="mt-1 line-clamp-2 flex-1 text-sm text-zinc-600">{skill.summary}</p>
      <div className="mt-3 flex flex-wrap gap-1">
        {parseTags(skill.tags).slice(0, 4).map((t) => (
          <span key={t} className="font-mono text-xs text-zinc-500">#{t}</span>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-3 text-xs text-zinc-500">
        <span>{skill.author.name}</span>
        <span className="flex gap-3 font-mono">
          <span>♥ {skill._count.likes}</span>
          <span>💬 {skill._count.comments}</span>
          <span>👁 {skill.views}</span>
        </span>
      </div>
    </Link>
  );
}
