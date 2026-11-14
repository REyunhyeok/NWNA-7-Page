import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { formatDate, parseTags } from "@/lib/utils";
import SubmitButton from "@/components/SubmitButton";
import ConfirmButton from "@/components/ConfirmButton";
import CommentForm from "@/components/skills/CommentForm";
import { SiteThumb, hostOf } from "@/components/sites/SiteCard";
import { addSiteComment, deleteSite, deleteSiteComment, toggleSiteLike } from "../actions";

type Params = { params: { id: string } };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const s = await prisma.site.findUnique({ where: { id: params.id }, select: { title: true } });
  return { title: s?.title ?? "동지 홈페이지" };
}

export default async function SiteDetailPage({ params }: Params) {
  const user = await requireUser();

  const site = await prisma.site
    .update({
      where: { id: params.id },
      data: { views: { increment: 1 } },
      include: {
        author: { select: { id: true, name: true, github: true } },
        comments: { include: { author: { select: { id: true, name: true } } }, orderBy: { createdAt: "asc" } },
        _count: { select: { likes: true } },
      },
    })
    .catch(() => null);
  if (!site) notFound();

  const liked = !!(await prisma.siteLike.findUnique({
    where: { userId_siteId: { userId: user.id, siteId: site.id } },
  }));
  const canEdit = site.author.id === user.id || user.role === "ADMIN";

  return (
    <div className="container-page max-w-4xl py-10">
      <Link href="/sites" className="text-sm text-zinc-500 hover:text-zinc-900">← 홈페이지 목록</Link>

      <div className="mt-4 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
        <SiteThumb title={site.title} className="h-40" />
        <div className="p-6">
          <p className="font-mono text-xs text-zinc-400">{hostOf(site.url)}</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">{site.title}</h1>
          <p className="mt-2 text-zinc-600">{site.summary}</p>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {parseTags(site.techStack).map((t) => (
              <Link key={t} href={`/sites?q=${encodeURIComponent(t)}`} className="badge hover:bg-zinc-200">{t}</Link>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <a href={site.url} target="_blank" rel="noopener noreferrer" className="btn-brand">홈페이지 방문하기 ↗</a>
            {site.repoUrl && (
              <a href={site.repoUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost">GitHub 저장소 ↗</a>
            )}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-zinc-100 pt-4 text-sm text-zinc-500">
            <span>만든 사람 <b className="text-zinc-800">{site.author.name}</b></span>
            {site.author.github && (
              <a href={`https://github.com/${site.author.github}`} target="_blank" rel="noopener noreferrer" className="font-mono text-xs hover:text-brand-600">
                @{site.author.github}
              </a>
            )}
            <span className="font-mono">{formatDate(site.createdAt)}</span>
            <span className="font-mono">👁 {site.views}</span>
          </div>
        </div>
      </div>

      <section className="mt-6 card">
        <h2 className="font-semibold">소개</h2>
        <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-relaxed text-zinc-700">{site.description}</p>
      </section>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <form action={toggleSiteLike.bind(null, site.id)}>
          <SubmitButton className={liked ? "btn border border-pink-200 bg-pink-50 text-pink-600" : "btn-ghost"} pendingText="…">
            {liked ? "♥" : "♡"} 좋아요 {site._count.likes}
          </SubmitButton>
        </form>
        {canEdit && (
          <div className="ml-auto flex gap-2">
            <Link href={`/sites/${site.id}/edit`} className="btn-ghost">수정</Link>
            <form action={deleteSite.bind(null, site.id)}>
              <ConfirmButton message="이 홈페이지 소개를 삭제할까요?" className="btn-danger">삭제</ConfirmButton>
            </form>
          </div>
        )}
      </div>

      <section className="mt-10">
        <h2 className="font-semibold">피드백 {site.comments.length}</h2>
        <ul className="mt-4 space-y-3">
          {site.comments.map((c) => (
            <li key={c.id} className="card p-4">
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span><b className="text-zinc-800">{c.author.name}</b> · {formatDate(c.createdAt)}</span>
                {(c.author.id === user.id || user.role === "ADMIN") && (
                  <form action={deleteSiteComment.bind(null, c.id)}>
                    <button className="hover:text-red-600">삭제</button>
                  </form>
                )}
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm">{c.body}</p>
            </li>
          ))}
        </ul>
        <CommentForm action={addSiteComment.bind(null, site.id)} placeholder="응원이나 개선 아이디어를 남겨주세요" />
      </section>
    </div>
  );
}
