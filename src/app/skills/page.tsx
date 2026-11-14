import type { Metadata } from "next";
import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { SKILL_CATEGORIES, type SkillCategory } from "@/lib/validators";
import PageHeader from "@/components/PageHeader";
import SkillCard from "@/components/skills/SkillCard";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "AI 스킬" };

type SearchParams = { q?: string; category?: string; sort?: string };

export default async function SkillsPage({ searchParams }: { searchParams: SearchParams }) {
  await requireUser();
  const q = searchParams.q?.trim() ?? "";
  const category = searchParams.category as SkillCategory | undefined;
  const sort = searchParams.sort === "popular" ? "popular" : "latest";

  const where: Prisma.SkillWhereInput = {
    ...(category && category in SKILL_CATEGORIES ? { category } : {}),
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { summary: { contains: q, mode: "insensitive" } },
            { tags: { contains: q, mode: "insensitive" } },
            { content: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const skills = await prisma.skill.findMany({
    where,
    include: { author: { select: { name: true } }, _count: { select: { likes: true, comments: true } } },
    orderBy: sort === "popular" ? [{ likes: { _count: "desc" } }, { views: "desc" }] : { createdAt: "desc" },
    take: 60,
  });

  const href = (patch: Partial<SearchParams>) => {
    const p = new URLSearchParams();
    const merged = { q, category, sort, ...patch };
    Object.entries(merged).forEach(([k, v]) => v && p.set(k, v));
    return `/skills?${p.toString()}`;
  };

  return (
    <div className="container-page py-10">
      <PageHeader
        eyebrow="skills / prompts"
        title="AI 스킬 툴 공유"
        description="동지들이 검증한 프롬프트·Claude 스킬·에이전트 워크플로우를 찾아 바로 복사해 쓰세요."
        action={<Link href="/skills/new" className="btn-brand">+ 스킬 공유하기</Link>}
      />

      <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-1.5">
          <Link href={href({ category: undefined })} className={cn("badge px-3 py-1.5", !category && "bg-zinc-900 text-white")}>
            전체
          </Link>
          {Object.entries(SKILL_CATEGORIES).map(([key, label]) => (
            <Link key={key} href={href({ category: key })} className={cn("badge px-3 py-1.5", category === key && "bg-zinc-900 text-white")}>
              {label}
            </Link>
          ))}
        </div>
        <form className="flex gap-2" action="/skills">
          {category && <input type="hidden" name="category" value={category} />}
          <input type="hidden" name="sort" value={sort} />
          <input name="q" defaultValue={q} placeholder="제목, 태그, 내용 검색" className="input w-full lg:w-64" />
          <button className="btn-ghost">검색</button>
        </form>
      </div>

      <div className="mt-4 flex gap-3 text-sm">
        <Link href={href({ sort: "latest" })} className={sort === "latest" ? "font-semibold" : "text-zinc-500"}>최신순</Link>
        <Link href={href({ sort: "popular" })} className={sort === "popular" ? "font-semibold" : "text-zinc-500"}>인기순</Link>
        <span className="ml-auto font-mono text-xs text-zinc-400">{skills.length} results</span>
      </div>

      {skills.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed border-zinc-300 py-16 text-center text-sm text-zinc-500">
          아직 스킬이 없습니다. 첫 번째 스킬을 공유해 보세요!
        </div>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((s) => (
            <SkillCard key={s.id} skill={s} />
          ))}
        </div>
      )}
    </div>
  );
}
