import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { getSession } from "@/lib/auth";
import { MAX_UPLOAD_BYTES } from "@/lib/storage";

export const runtime = "nodejs";

// blob 모드: 브라우저가 Vercel Blob에 직접 업로드할 수 있도록 단기 토큰을 발급한다.
export async function POST(req: Request) {
  const body = (await req.json()) as HandleUploadBody;

  // 토큰 발급 요청은 로그인한 멤버만 (업로드 완료 콜백은 Vercel이 서명해서 보냄)
  if (body.type === "blob.generate-client-token") {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  try {
    const json = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async () => ({
        maximumSizeInBytes: MAX_UPLOAD_BYTES,
        addRandomSuffix: true,
      }),
      // DB 등록은 업로드 직후 클라이언트가 POST /api/files 로 처리 (로컬에서도 동작하도록)
      onUploadCompleted: async () => {},
    });
    return NextResponse.json(json);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
