import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MAX_UPLOAD_BYTES, saveFile } from "@/lib/storage";
import { DRIVE_FOLDERS } from "@/lib/validators";

export const runtime = "nodejs";

// 업로드: multipart/form-data { file, folder, description }
export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "파일을 선택하세요." }, { status: 400 });
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json(
      { error: `파일은 최대 ${Math.round(MAX_UPLOAD_BYTES / 1024 / 1024)}MB까지 올릴 수 있습니다.` },
      { status: 413 },
    );
  }

  const folderRaw = String(form.get("folder") ?? "일반");
  const folder = (DRIVE_FOLDERS as readonly string[]).includes(folderRaw) ? folderRaw : "일반";
  const description = String(form.get("description") ?? "").trim().slice(0, 200) || null;

  const storedName = await saveFile(file);
  const item = await prisma.fileItem.create({
    data: {
      name: file.name.slice(0, 200),
      storedName,
      mimeType: file.type || "application/octet-stream",
      size: file.size,
      folder,
      description,
      uploaderId: session.user.id,
    },
  });

  revalidatePath("/drive");
  return NextResponse.json({ id: item.id }, { status: 201 });
}
