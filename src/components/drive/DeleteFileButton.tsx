"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteFileButton({ id }: { id: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  return (
    <button
      disabled={busy}
      className="btn-danger px-2.5 py-1 text-xs"
      onClick={async () => {
        if (!confirm("이 파일을 삭제할까요? 되돌릴 수 없습니다.")) return;
        setBusy(true);
        const res = await fetch(`/api/files/${id}`, { method: "DELETE" });
        setBusy(false);
        if (!res.ok) alert((await res.json().catch(() => ({}))).error ?? "삭제 실패");
        router.refresh();
      }}
    >
      삭제
    </button>
  );
}
