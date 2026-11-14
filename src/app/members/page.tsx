import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { formatDate } from "@/lib/utils";
import PageHeader from "@/components/PageHeader";
import ConfirmButton from "@/components/ConfirmButton";
import { removeMember, setRole } from "./actions";

export const metadata: Metadata = { title: "동지들" };

export default async function MembersPage() {
  const me = await requireUser();
  const isAdmin = me.role === "ADMIN";

  const members = await prisma.user.findMany({
    orderBy: [{ role: "asc" }, { createdAt: "asc" }],
    select: {
      id: true, name: true, email: true, role: true, bio: true, github: true, createdAt: true,
      _count: { select: { skills: true, files: true } },
    },
  });

  return (
    <div className="container-page py-10">
      <PageHeader eyebrow="members" title="7기 동지들" description={`함께하는 동지 ${members.length}명`} />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((m) => (
          <div key={m.id} className="card flex flex-col">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-zinc-900 font-semibold text-white">
                {m.name.slice(0, 1)}
              </span>
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 font-semibold">
                  {m.name}
                  {m.role === "ADMIN" && <span className="badge bg-brand-50 text-brand-700">운영진</span>}
                  {m.id === me.id && <span className="badge">나</span>}
                </p>
                {m.github && (
                  <a href={`https://github.com/${m.github}`} target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-zinc-500 hover:text-brand-600">
                    @{m.github}
                  </a>
                )}
              </div>
            </div>
            <p className="mt-3 flex-1 text-sm text-zinc-600">{m.bio || "아직 소개가 없습니다."}</p>
            <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-3 font-mono text-xs text-zinc-500">
              <span>스킬 {m._count.skills} · 자료 {m._count.files}</span>
              <span>{formatDate(m.createdAt)} 합류</span>
            </div>

            {isAdmin && m.id !== me.id && (
              <div className="mt-3 flex gap-2 border-t border-dashed border-zinc-200 pt-3">
                <p className="mr-auto truncate text-xs text-zinc-400">{m.email}</p>
                <form action={setRole.bind(null, m.id, m.role === "ADMIN" ? "MEMBER" : "ADMIN")}>
                  <button className="btn-ghost px-2 py-1 text-xs">{m.role === "ADMIN" ? "운영진 해제" : "운영진 지정"}</button>
                </form>
                <form action={removeMember.bind(null, m.id)}>
                  <ConfirmButton message={`${m.name}님을 탈퇴 처리할까요? 작성한 스킬과 파일 기록도 함께 삭제됩니다.`} className="btn-danger px-2 py-1 text-xs">
                    탈퇴
                  </ConfirmButton>
                </form>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
