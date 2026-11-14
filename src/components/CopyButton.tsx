"use client";

import { useState } from "react";

export default function CopyButton({ text, label = "복사" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="rounded-md border border-zinc-700 px-2 py-1 font-mono text-xs text-zinc-300 hover:bg-zinc-800"
    >
      {copied ? "✓ 복사됨" : label}
    </button>
  );
}
