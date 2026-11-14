"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/about", label: "소개", auth: false },
  { href: "/skills", label: "AI 스킬", auth: true },
  { href: "/drive", label: "드라이브", auth: true },
  { href: "/members", label: "동지들", auth: true },
];

export default function NavLinks({ loggedIn }: { loggedIn: boolean }) {
  const pathname = usePathname();
  return (
    <nav className="flex min-w-0 items-center gap-0.5 overflow-x-auto text-sm sm:gap-1">
      {links
        .filter((l) => !l.auth || loggedIn)
        .map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              "whitespace-nowrap rounded-md px-2 py-1.5 transition sm:px-2.5",
              pathname.startsWith(l.href)
                ? "bg-zinc-100 font-medium text-zinc-900"
                : "text-zinc-500 hover:text-zinc-900",
            )}
          >
            {l.label}
          </Link>
        ))}
    </nav>
  );
}
