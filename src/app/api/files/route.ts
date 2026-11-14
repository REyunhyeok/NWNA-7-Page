import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MAX_UPLOAD_BYTES, saveFile, storageMode, verifyBlob } from "@/lib/storage";
import { DRIVE_FOLDERS } from "@/lib/validators";

export const runtime = "nodejs";

const pickFolder = (raw: unknown) =>
  (DRIVE_FOLDERS as readonly string[]).includes(String(raw)) ? String(raw) : "일반";
const pickDescription = (raw: unknown) => String(raw ?? "").trim().slice(0, 200) || null;
const tooLarge = () =>
  NextResponse.json(
    { error: `파일은 최대 ${Math.round(MAX_UPLOAD_BYTES / 1024 / 1024)}MB까지 올릴 수 있습니다.` },
    { status: 413 },
  );

const blobBody = z.object({
  url: z.string().url(),
  name: z.string().min(1).max(200),
  folder: z.string().optional(),
  description: z.string().optional(),
});

/**
 * 파일 등록
 *  - local 모드: multipart/form-data { file, folder, description } 를 받아 디스크에 저장
 *  - blob  모드: 브라우저가 Blob에 올린 뒤 JSON { url, name, folder, description } 로 메타데이터 등록
 */
export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });

  if (storageMode === "blob") {
    const parsed = blobBody.safeParse(await req.json().catch(() => null));
    if (!parsed.success) return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });

    let info;
    try {
      info = await verifyBlob(parsed.data.url);
    } catch {
      return NextResponse.json({ error: "업로드된 파일을 확인할 수 없습니다." }, { status: 400 });
    }
    if (info.size > MAX_UPLOAD_BYTES) return tooLarge();

    const item = await prisma.fileItem.create({
      data: {
        name: parsed.data.name,
        storedName: parsed.data.url,
        mimeType: info.contentType || "application/octet-stream",
        size: info.size,
        folder: pickFolder(parsed.data.folder),
        description: pickDescription(parsed.data.description),
        uploaderId: session.user.id,
      },
    });
    revalidatePath("/drive");
    return NextResponse.json({ id: item.id }, { status: 201 });
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "파일을 선택하세요." }, { status: 400 });
  }
  if (file.size > MAX_UPLOAD_BYTES) return tooLarge();

  const storedName = await saveFile(file);
  const item = await prisma.fileItem.create({
    data: {
      name: file.name.slice(0, 200),
      storedName,
      mimeType: file.type || "application/octet-stream",
      size: file.size,
      folder: pickFolder(form.get("folder")),
      description: pickDescription(form.get("description")),
      uploaderId: session.user.id,
    },
  });

  revalidatePath("/drive");
  return NextResponse.json({ id: item.id }, { status: 201 });
}
