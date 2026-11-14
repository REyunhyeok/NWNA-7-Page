"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { upload as blobUpload } from "@vercel/blob/client";
import { DRIVE_FOLDERS } from "@/lib/validators";
import { cn, formatBytes } from "@/lib/utils";

export default function UploadPanel({
  defaultFolder,
  mode,
}: {
  defaultFolder: string;
  mode: "blob" | "local";
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  function done(formEl: HTMLFormElement) {
    setProgress(null);
    setFile(null);
    if (inputRef.current) inputRef.current.value = "";
    formEl.reset();
    router.refresh();
  }

  // Vercel 배포: 브라우저 → Vercel Blob 직접 업로드 후, 서버에 메타데이터 등록
  async function uploadToBlob(formEl: HTMLFormElement, file: File, form: FormData) {
    try {
      const blob = await blobUpload(`drive/${file.name}`, file, {
        access: "public",
        handleUploadUrl: "/api/files/upload-token",
        multipart: file.size > 10 * 1024 * 1024,
        onUploadProgress: (p) => setProgress(Math.round(p.percentage)),
      });
      const res = await fetch("/api/files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: blob.url,
          name: file.name,
          folder: form.get("folder"),
          description: form.get("description"),
        }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? "등록 실패");
      done(formEl);
    } catch (err) {
      setProgress(null);
      setError((err as Error).message || "업로드에 실패했습니다.");
    }
  }

  function upload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!file) return;
    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    setError(null);
    setProgress(0);

    if (mode === "blob") {
      void uploadToBlob(formEl, file, form);
      return;
    }
    form.set("file", file);

    // fetch는 업로드 진행률을 주지 않으므로 XHR 사용
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/files");
    xhr.upload.onprogress = (ev) => ev.lengthComputable && setProgress(Math.round((ev.loaded / ev.total) * 100));
    xhr.onload = () => {
      setProgress(null);
      if (xhr.status >= 200 && xhr.status < 300) {
        done(formEl);
      } else {
        try {
          setError(JSON.parse(xhr.responseText).error);
        } catch {
          setError("업로드에 실패했습니다.");
        }
      }
    };
    xhr.onerror = () => {
      setProgress(null);
      setError("네트워크 오류로 업로드에 실패했습니다.");
    };
    xhr.send(form);
  }

  return (
    <form onSubmit={upload} className="card space-y-3">
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const f = e.dataTransfer.files?.[0];
          if (f) setFile(f);
        }}
        className={cn(
          "cursor-pointer rounded-lg border-2 border-dashed px-4 py-6 text-center text-sm transition",
          dragging ? "border-brand-500 bg-brand-50" : "border-zinc-200 hover:border-zinc-300",
        )}
      >
        <input ref={inputRef} type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        {file ? (
          <p><b>{file.name}</b> <span className="font-mono text-xs text-zinc-500">({formatBytes(file.size)})</span></p>
        ) : (
          <p className="text-zinc-500">여기로 파일을 끌어다 놓거나 <span className="text-brand-600 underline">클릭해서 선택</span>하세요</p>
        )}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <select name="folder" defaultValue={defaultFolder} className="input sm:w-36">
          {DRIVE_FOLDERS.map((f) => <option key={f}>{f}</option>)}
        </select>
        <input name="description" maxLength={200} className="input" placeholder="간단한 설명 (선택)" />
        <button type="submit" disabled={!file || progress !== null} className="btn-brand shrink-0">
          {progress !== null ? `${progress}%` : "업로드"}
        </button>
      </div>

      {progress !== null && (
        <div className="h-1.5 overflow-hidden rounded-full bg-zinc-100">
          <div className="h-full bg-brand-600 transition-all" style={{ width: `${progress}%` }} />
        </div>
      )}
      {error && <p className="field-error">{error}</p>}
    </form>
  );
}
