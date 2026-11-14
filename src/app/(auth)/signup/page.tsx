import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import SignupForm from "./SignupForm";

export const metadata: Metadata = { title: "가입하기" };

export default async function SignupPage() {
  if (await getSession()) redirect("/skills");

  return (
    <>
      <div className="mb-8 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-brand-600">join cohort 7</p>
        <h1 className="mt-2 text-2xl font-bold">기본학교 7기 가입</h1>
        <p className="mt-1 text-sm text-zinc-500">운영진에게 받은 7기 인증 코드가 필요합니다.</p>
      </div>
      <div className="card">
        <SignupForm />
      </div>
      <p className="mt-6 text-center text-sm text-zinc-500">
        이미 계정이 있나요?{" "}
        <Link href="/login" className="font-medium text-brand-600 hover:underline">로그인</Link>
      </p>
    </>
  );
}
