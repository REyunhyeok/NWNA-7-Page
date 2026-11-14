import Link from "next/link";
import { getSession } from "@/lib/auth";
import UserMenu from "./UserMenu";
import NavLinks from "./NavLinks";

export default async function Navbar() {
  const session = await getSession();

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/80 backdrop-blur">
      <div className="container-page flex h-14 items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3 sm:gap-6">
          <Link href="/" className="flex shrink-0 items-center gap-2 font-semibold tracking-tight">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-zinc-900 font-mono text-xs text-white">
              7
            </span>
            <span className="hidden sm:inline">기본학교 7기</span>
          </Link>
          <NavLinks loggedIn={!!session} />
        </div>
        {session ? (
          <UserMenu name={session.user.name} role={session.user.role} />
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/login" className="btn-ghost whitespace-nowrap py-1.5">
              로그인
            </Link>
            <Link href="/signup" className="btn-primary hidden py-1.5 sm:inline-flex">
              가입하기
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
