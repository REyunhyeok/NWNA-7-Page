import type { Metadata } from "next";
import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { DRIVE_FOLDERS } from "@/lib/validators";
import { storageMode } from "@/lib/storage";
import { cn, formatBytes, formatDate } from "@/lib/utils";
import PageHeader from "@/components/PageHeader";
import UploadPanel from "@/components/drive/UploadPanel";
import DeleteFileButton from "@/components/drive/DeleteFileButton";
import FileIcon from "@/components/drive/FileIcon";

export const metadata: Metadata = { title: "드라이브" };

export default async function DrivePage({ searchParams }: { searchParams: { folder?: string; q?: string } }) {
  const user = await requireUser();
  const folder = (DRIVE_FOLDERS as readonly string[]).includes(searchParams.folder ?? "") ? searchParams.folder : undefined;
  const q = searchParams.q?.trim() ?? "";

  const where: Prisma.FileItemWhereInput = {
    ...(folder ? { folder } : {}),
    ...(q ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { description: { contains: q, mode: "insensitive" } }] } : {}),
  };

  const [files, counts, total] = await Promise.all([
    prisma.fileItem.findMany({
      where,
      include: { uploader: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
      take: 200,
    }),
    prisma.fileItem.groupBy({ by: ["folder"], _count: true }),
    prisma.fileItem.aggregate({ _sum: { size: true } }),
  ]);
  const countOf = (f: string) => counts.find((c) => c.folder === f)?._count ?? 0;

  return (
    <div className="container-page py-10">
      <PageHeader
        eyebrow="drive / archive"
        title="7기 자료 드라이브"
        description={`강의자료·과제·프로젝트 문서를 모아두는 공간 · 전체 ${formatBytes(total._sum.size ?? 0)}`}
      />

      <div className="mt-6 grid gap-6 lg:grid-cols-[220px_1fr]">
        {/* 폴더 사이드바 */}
        <aside className="-mx-4 flex gap-1 overflow-x-auto px-4 lg:mx-0 lg:block lg:space-y-1 lg:px-0">
          <Link href="/drive" className={cn("flex shrink-0 justify-between gap-3 whitespace-nowrap rounded-lg px-3 py-2 text-sm", !folder ? "bg-zinc-900 text-white" : "hover:bg-zinc-100")}>
            <span>📁 전체</span>
            <span className="font-mono text-xs opacity-70">{counts.reduce((a, c) => a + c._count, 0)}</span>
          </Link>
          {DRIVE_FOLDERS.map((f) => (
            <Link key={f} href={`/drive?folder=${encodeURIComponent(f)}`} className={cn("flex shrink-0 justify-between gap-3 whitespace-nowrap rounded-lg px-3 py-2 text-sm", folder === f ? "bg-zinc-900 text-white" : "hover:bg-zinc-100")}>
              <span>📂 {f}</span>
              <span className="font-mono text-xs opacity-70">{countOf(f)}</span>
            </Link>
          ))}
        </aside>

        <div className="min-w-0 space-y-4">
          <UploadPanel defaultFolder={folder ?? "일반"} mode={storageMode} />

          <form action="/drive" className="flex gap-2">
            {folder && <input type="hidden" name="folder" value={folder} />}
            <input name="q" defaultValue={q} className="input" placeholder="파일명, 설명 검색" />
            <button className="btn-ghost">검색</button>
          </form>

          {files.length === 0 ? (
            <div className="rounded-xl border border-dashed border-zinc-300 py-16 text-center text-sm text-zinc-500">
              이 폴더에 아직 파일이 없습니다.
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
              <table className="w-full text-sm">
                <thead className="border-b border-zinc-200 bg-zinc-50 text-left text-xs text-zinc-500">
                  <tr>
                    <th className="px-4 py-2.5 font-medium">이름</th>
                    <th className="hidden px-4 py-2.5 font-medium md:table-cell">올린 사람</th>
                    <th className="hidden px-4 py-2.5 font-medium sm:table-cell">크기</th>
                    <th className="hidden px-4 py-2.5 font-medium md:table-cell">날짜</th>
                    <th className="px-4 py-2.5" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {files.map((f) => (
                    <tr key={f.id} className="hover:bg-zinc-50">
                      <td className="max-w-0 px-4 py-3">
                        <div className="flex items-center gap-3">
                          <FileIcon name={f.name} />
                          <div className="min-w-0">
                            <a href={`/api/files/${f.id}`} className="block truncate font-medium hover:text-brand-600">{f.name}</a>
                            <p className="truncate text-xs text-zinc-500">
                              <span className="badge mr-1.5 px-1.5 py-0">{f.folder}</span>
                              {f.description ?? ""}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="hidden whitespace-nowrap px-4 py-3 text-zinc-600 md:table-cell">{f.uploader.name}</td>
                      <td className="hidden whitespace-nowrap px-4 py-3 font-mono text-xs text-zinc-500 sm:table-cell">{formatBytes(f.size)}</td>
                      <td className="hidden whitespace-nowrap px-4 py-3 font-mono text-xs text-zinc-500 md:table-cell">{formatDate(f.createdAt)}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-right">
                        <div className="flex justify-end gap-1">
                          <a href={`/api/files/${f.id}`} className="btn-ghost px-2.5 py-1 text-xs" title={`다운로드 ${f.downloads}회`}>
                            ↓ <span className="hidden sm:inline">받기</span>
                          </a>
                          {(f.uploader.id === user.id || user.role === "ADMIN") && <DeleteFileButton id={f.id} />}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
