import { randomUUID } from "crypto";
import { createReadStream } from "fs";
import { mkdir, stat, unlink, writeFile } from "fs/promises";
import path from "path";
import { Readable } from "stream";

/**
 * 로컬 디스크 저장소.
 * 운영에서 S3 / Cloudflare R2 등으로 바꾸려면 이 파일의 세 함수만 교체하면 된다.
 */
const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR ?? "./uploads");
export const MAX_UPLOAD_BYTES = Number(process.env.MAX_UPLOAD_MB ?? 50) * 1024 * 1024;

function resolveSafe(storedName: string) {
  const full = path.resolve(UPLOAD_DIR, storedName);
  if (!full.startsWith(UPLOAD_DIR + path.sep)) throw new Error("잘못된 파일 경로");
  return full;
}

export async function saveFile(file: File) {
  await mkdir(UPLOAD_DIR, { recursive: true });
  const ext = path.extname(file.name).toLowerCase().replace(/[^a-z0-9.]/g, "").slice(0, 10);
  const storedName = `${randomUUID()}${ext}`;
  await writeFile(resolveSafe(storedName), Buffer.from(await file.arrayBuffer()));
  return storedName;
}

export async function openFile(storedName: string) {
  const full = resolveSafe(storedName);
  const info = await stat(full);
  const stream = Readable.toWeb(createReadStream(full)) as ReadableStream;
  return { stream, size: info.size };
}

export async function removeFile(storedName: string) {
  await unlink(resolveSafe(storedName)).catch(() => {});
}
