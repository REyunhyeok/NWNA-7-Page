import type { Metadata } from "next";
import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import PageHeader from "@/components/PageHeader";
import SiteCard from "@/components/sites/SiteCard";

export const metadata: Metadata = { title: "동지 홈페이지" };

type SearchParams = { q?: string; sort?: string };

export default async function SitesPage({ searchParams }: { searchParams: SearchParams }) {
  await requireUser();
  const q = searchParams.q?.trim() ?? "";
  const sort = searchParams.sort === "popular" ? "popular" : "latest";

  const where: Prisma.SiteWhereInput = q
    ? {
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { summary: { contains: q, mode: "insensitive" } },
          { techStack: { contains: q, mode: "insensitive" } },
          { author: { name: { contains: q, mode: "insensitive" } } },
        ],
      }
    : {};

  const sites = await prisma.site.findMany({
    where,
    include: { author: { select: { name: true } }, _count: { select: { likes: true, comments: true } } },
    orderBy: sort === "popular" ? [{ likes: { _count: "desc" } }, { views: "desc" }] : { createdAt: "desc" },
    take: 60,
  });

  const href = (s: string) => `/sites?${new URLSearchParams({ ...(q ? { q } : {}), sort: s })}`;

  return (
    <div className="container-page py-10">
      <PageHeader
        eyebrow="showcase / sites"
        title="동지 홈페이지"
        description="7기 동지들이 직접 만든 홈페이지를 소개하고 서로 피드백을 나눠요."
        action={<Link href="/sites/new" className="btn-brand">+ 내 홈페이지 소개하기</Link>}
      />

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3 text-sm">
          <Link href={href("latest")} className={sort === "latest" ? "font-semibold" : "text-zinc-500"}>최신순</Link>
          <Link href={href("popular")} className={sort === "popular" ? "font-semibold" : "text-zinc-500"}>인기순</Link>
          <span className="font-mono text-xs leading-5 text-zinc-400">{sites.length} sites</span>
        </div>
        <form className="flex gap-2" action="/sites">
          <input type="hidden" name="sort" value={sort} />
          <input name="q" defaultValue={q} placeholder="이름, 기술, 만든 사람 검색" className="input w-full sm:w-64" />
          <button className="btn-ghost">검색</button>
        </form>
      </div>

      {sites.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed border-zinc-300 py-16 text-center text-sm text-zinc-500">
          아직 소개된 홈페이지가 없습니다. 첫 번째로 내 홈페이지를 소개해 보세요!
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sites.map((s) => <SiteCard key={s.id} site={s} />)}
        </div>
      )}
    </div>
  );
}
