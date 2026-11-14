import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { SKILL_CATEGORIES, type SkillCategory } from "@/lib/validators";
import { formatDate, parseTags } from "@/lib/utils";
import CopyButton from "@/components/CopyButton";
import SubmitButton from "@/components/SubmitButton";
import ConfirmButton from "@/components/ConfirmButton";
import CommentForm from "@/components/skills/CommentForm";
import { addComment, deleteComment, deleteSkill, toggleLike } from "../actions";

type Params = { params: { id: string } };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const s = await prisma.skill.findUnique({ where: { id: params.id }, select: { title: true } });
  return { title: s?.title ?? "스킬" };
}

export default async function SkillDetailPage({ params }: Params) {
  const user = await requireUser();

  const skill = await prisma.skill
    .update({ where: { id: params.id }, data: { views: { increment: 1 } }, include: {
      author: { select: { id: true, name: true } },
      comments: { include: { author: { select: { id: true, name: true } } }, orderBy: { createdAt: "asc" } },
      _count: { select: { likes: true } },
    } })
    .catch(() => null);
  if (!skill) notFound();

  const liked = !!(await prisma.skillLike.findUnique({
    where: { userId_skillId: { userId: user.id, skillId: skill.id } },
  }));
  const canEdit = skill.author.id === user.id || user.role === "ADMIN";

  return (
    <div className="container-page max-w-4xl py-10">
      <Link href="/skills" className="text-sm text-zinc-500 hover:text-zinc-900">← 스킬 목록</Link>

      <header className="mt-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="badge bg-brand-50 text-brand-700">{SKILL_CATEGORIES[skill.category as SkillCategory]}</span>
          {parseTags(skill.tags).map((t) => (
            <Link key={t} href={`/skills?q=${encodeURIComponent(t)}`} className="font-mono text-xs text-zinc-500 hover:text-brand-600">#{t}</Link>
          ))}
        </div>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">{skill.title}</h1>
        <p className="mt-2 text-zinc-600">{skill.summary}</p>
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-500">
          <span>by <b className="text-zinc-800">{skill.author.name}</b></span>
          <span className="font-mono">{formatDate(skill.createdAt)}</span>
          <span className="font-mono">👁 {skill.views}</span>
          {skill.sourceUrl && (
            <a href={skill.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">참고 링크 ↗</a>
          )}
        </div>
      </header>

      <section className="mt-6 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
        <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-2">
          <span className="font-mono text-xs text-zinc-500">prompt.md</span>
          <CopyButton text={skill.content} label="프롬프트 복사" />
        </div>
        <pre className="max-h-[60vh] overflow-auto whitespace-pre-wrap break-words p-4 font-mono text-[13px] leading-relaxed text-zinc-100">
          {skill.content}
        </pre>
      </section>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <form action={toggleLike.bind(null, skill.id)}>
          <SubmitButton className={liked ? "btn border border-pink-200 bg-pink-50 text-pink-600" : "btn-ghost"} pendingText="…">
            {liked ? "♥" : "♡"} 좋아요 {skill._count.likes}
          </SubmitButton>
        </form>
        {canEdit && (
          <div className="ml-auto flex gap-2">
            <Link href={`/skills/${skill.id}/edit`} className="btn-ghost">수정</Link>
            <form action={deleteSkill.bind(null, skill.id)}>
              <ConfirmButton message="이 스킬을 삭제할까요?" className="btn-danger">삭제</ConfirmButton>
            </form>
          </div>
        )}
      </div>

      <section className="mt-10">
        <h2 className="font-semibold">댓글 {skill.comments.length}</h2>
        <ul className="mt-4 space-y-3">
          {skill.comments.map((c) => (
            <li key={c.id} className="card p-4">
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span><b className="text-zinc-800">{c.author.name}</b> · {formatDate(c.createdAt)}</span>
                {(c.author.id === user.id || user.role === "ADMIN") && (
                  <form action={deleteComment.bind(null, c.id)}>
                    <button className="hover:text-red-600">삭제</button>
                  </form>
                )}
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm">{c.body}</p>
            </li>
          ))}
        </ul>
        <CommentForm action={addComment.bind(null, skill.id)} />
      </section>
    </div>
  );
}
