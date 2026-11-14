"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

export default function UserMenu({ name, role }: { name: string; role: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="relative shrink-0" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border border-zinc-200 p-1 text-sm hover:bg-zinc-50 sm:pr-3"
      >
        <span className="grid h-6 w-6 place-items-center rounded-full bg-brand-600 text-xs font-semibold text-white">
          {name.slice(0, 1)}
        </span>
        <span className="hidden max-w-[6rem] truncate sm:inline">{name}</span>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-44 overflow-hidden rounded-lg border border-zinc-200 bg-white py-1 text-sm shadow-lg">
          <div className="px-3 py-2 text-xs text-zinc-500">
            {role === "ADMIN" ? "운영진" : "7기 동지"}
          </div>
          <Link href="/profile" className="block px-3 py-2 hover:bg-zinc-50" onClick={() => setOpen(false)}>
            내 프로필
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="block w-full px-3 py-2 text-left text-red-600 hover:bg-red-50"
          >
            로그아웃
          </button>
        </div>
      )}
    </div>
  );
}
