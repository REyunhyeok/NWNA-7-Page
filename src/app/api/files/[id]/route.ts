import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { openFile, removeFile } from "@/lib/storage";

export const runtime = "nodejs";

type Ctx = { params: { id: string } };

// 다운로드
export async function GET(_req: Request, { params }: Ctx) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });

  const item = await prisma.fileItem.findUnique({ where: { id: params.id } });
  if (!item) return NextResponse.json({ error: "파일이 없습니다." }, { status: 404 });

  try {
    const { stream, size } = await openFile(item.storedName);
    await prisma.fileItem.update({ where: { id: item.id }, data: { downloads: { increment: 1 } } });

    // 업로드된 파일은 항상 '다운로드'로만 제공 (브라우저에서 HTML 등이 실행되지 않도록)
    return new Response(stream, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Length": String(size),
        "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(item.name)}`,
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return NextResponse.json({ error: "저장소에서 파일을 찾을 수 없습니다." }, { status: 410 });
  }
}

// 삭제 (업로더 본인 또는 운영진)
export async function DELETE(_req: Request, { params }: Ctx) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });

  const item = await prisma.fileItem.findUnique({ where: { id: params.id } });
  if (!item) return NextResponse.json({ error: "파일이 없습니다." }, { status: 404 });
  if (item.uploaderId !== session.user.id && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }

  await prisma.fileItem.delete({ where: { id: item.id } });
  await removeFile(item.storedName);
  revalidatePath("/drive");
  return NextResponse.json({ ok: true });
}
