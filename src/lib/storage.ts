import { randomUUID } from "crypto";
import { createReadStream } from "fs";
import { mkdir, stat, unlink, writeFile } from "fs/promises";
import path from "path";
import { Readable } from "stream";
import { del, head } from "@vercel/blob";

/**
 * 파일 저장소 — 두 가지 모드
 *  - "blob"  : BLOB_READ_WRITE_TOKEN 이 있으면 Vercel Blob 사용 (Vercel 배포용)
 *              브라우저가 Blob으로 직접 업로드 → 서버는 메타데이터만 등록 (4.5MB 함수 제한 회피)
 *  - "local" : 그 외에는 UPLOAD_DIR 디스크에 저장 (로컬 개발 / 단일 서버 배포용)
 * FileItem.storedName 에는 local 모드면 디스크 파일명, blob 모드면 Blob URL이 들어간다.
 */
export type StorageMode = "blob" | "local";
export const storageMode: StorageMode = process.env.BLOB_READ_WRITE_TOKEN ? "blob" : "local";
export const MAX_UPLOAD_BYTES = Number(process.env.MAX_UPLOAD_MB ?? 50) * 1024 * 1024;

const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR ?? "./uploads");

const isBlobUrl = (s: string) => s.startsWith("https://");

function resolveSafe(storedName: string) {
  const full = path.resolve(UPLOAD_DIR, storedName);
  if (!full.startsWith(UPLOAD_DIR + path.sep)) throw new Error("잘못된 파일 경로");
  return full;
}

/** local 모드: 서버가 받은 파일을 디스크에 저장 */
export async function saveFile(file: File) {
  await mkdir(UPLOAD_DIR, { recursive: true });
  const ext = path.extname(file.name).toLowerCase().replace(/[^a-z0-9.]/g, "").slice(0, 10);
  const storedName = `${randomUUID()}${ext}`;
  await writeFile(resolveSafe(storedName), Buffer.from(await file.arrayBuffer()));
  return storedName;
}

/** blob 모드: 클라이언트가 올린 Blob이 우리 스토어에 실제로 있는지 확인하고 크기/타입을 돌려준다 */
export async function verifyBlob(url: string) {
  const u = new URL(url);
  if (u.protocol !== "https:" || !u.hostname.endsWith(".blob.vercel-storage.com")) {
    throw new Error("허용되지 않은 파일 주소");
  }
  const info = await head(url); // 다른 스토어의 URL이면 여기서 실패
  return { size: info.size, contentType: info.contentType };
}

export async function openFile(storedName: string) {
  if (isBlobUrl(storedName)) {
    const res = await fetch(storedName, { cache: "no-store" });
    if (!res.ok || !res.body) throw new Error("Blob을 찾을 수 없습니다.");
    return { stream: res.body, size: Number(res.headers.get("content-length") ?? 0) };
  }
  const full = resolveSafe(storedName);
  const info = await stat(full);
  const stream = Readable.toWeb(createReadStream(full)) as ReadableStream;
  return { stream, size: info.size };
}

export async function removeFile(storedName: string) {
  if (isBlobUrl(storedName)) {
    await del(storedName).catch(() => {});
    return;
  }
  await unlink(resolveSafe(storedName)).catch(() => {});
}
