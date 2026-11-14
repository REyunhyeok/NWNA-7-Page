"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = new FormData(e.currentTarget);

    const res = await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      redirect: false,
    });
    setLoading(false);

    if (!res || res.error) {
      setError("이메일 또는 비밀번호가 올바르지 않습니다.");
      return;
    }
    // 미들웨어가 붙여준 callbackUrl은 같은 사이트 경로일 때만 사용
    const cb = params.get("callbackUrl");
    let next = "/skills";
    if (cb) {
      try {
        const url = new URL(cb, window.location.origin);
        if (url.origin === window.location.origin) next = url.pathname + url.search;
      } catch {}
    }
    router.push(next);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {params.get("joined") && (
        <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
          가입이 완료되었습니다. 로그인해 주세요.
        </p>
      )}
      <div>
        <label htmlFor="email" className="label">이메일</label>
        <input id="email" name="email" type="email" required autoComplete="email" className="input" placeholder="you@example.com" />
      </div>
      <div>
        <label htmlFor="password" className="label">비밀번호</label>
        <input id="password" name="password" type="password" required autoComplete="current-password" className="input" />
      </div>
      {error && <p className="field-error">{error}</p>}
      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? "로그인 중…" : "로그인"}
      </button>
    </form>
  );
}
