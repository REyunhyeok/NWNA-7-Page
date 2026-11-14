import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import LoginForm from "./LoginForm";

export const metadata: Metadata = { title: "로그인" };

export default async function LoginPage() {
  if (await getSession()) redirect("/skills");

  return (
    <>
      <div className="mb-8 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-brand-600">welcome back</p>
        <h1 className="mt-2 text-2xl font-bold">7기 동지 로그인</h1>
        <p className="mt-1 text-sm text-zinc-500">가입한 이메일과 비밀번호를 입력하세요.</p>
      </div>
      <div className="card">
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
      <p className="mt-6 text-center text-sm text-zinc-500">
        아직 계정이 없나요?{" "}
        <Link href="/signup" className="font-medium text-brand-600 hover:underline">
          7기 인증 후 가입하기
        </Link>
      </p>
    </>
  );
}
