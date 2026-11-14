"use client";

import { useFormState } from "react-dom";
import SubmitButton from "@/components/SubmitButton";
import { signupAction, type SignupState } from "./actions";

const fields = [
  { name: "name", label: "이름", type: "text", autoComplete: "name", placeholder: "홍길동" },
  { name: "email", label: "이메일", type: "email", autoComplete: "email", placeholder: "you@example.com" },
  { name: "password", label: "비밀번호", type: "password", autoComplete: "new-password", placeholder: "영문+숫자 8자 이상" },
  { name: "passwordConfirm", label: "비밀번호 확인", type: "password", autoComplete: "new-password", placeholder: "" },
] as const;

export default function SignupForm() {
  const [state, action] = useFormState<SignupState, FormData>(signupAction, {});
  const e = state.errors ?? {};

  return (
    <form action={action} className="space-y-4">
      {fields.map((f) => (
        <div key={f.name}>
          <label htmlFor={f.name} className="label">{f.label}</label>
          <input id={f.name} name={f.name} type={f.type} autoComplete={f.autoComplete} placeholder={f.placeholder} required className="input" />
          {e[f.name] && <p className="field-error">{e[f.name]}</p>}
        </div>
      ))}
      <div className="rounded-lg border border-dashed border-brand-400 bg-brand-50/50 p-3">
        <label htmlFor="inviteCode" className="label">🔑 7기 인증 코드</label>
        <input id="inviteCode" name="inviteCode" required className="input font-mono uppercase" placeholder="운영진에게 받은 코드" />
        {e.inviteCode && <p className="field-error">{e.inviteCode}</p>}
      </div>
      {e.form && <p className="field-error">{e.form}</p>}
      <SubmitButton className="btn-primary w-full" pendingText="가입 처리 중…">
        가입하기
      </SubmitButton>
    </form>
  );
}
