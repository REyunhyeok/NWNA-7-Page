"use client";

import { useFormState } from "react-dom";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import SubmitButton from "@/components/SubmitButton";
import { changePassword, updateProfile, type FormState } from "./actions";

function Status({ state }: { state: FormState }) {
  if (state.ok) return <p className="text-sm text-green-600">{state.ok}</p>;
  if (state.error) return <p className="field-error">{state.error}</p>;
  return null;
}

export default function ProfileForms({
  user,
}: {
  user: { name: string; bio: string | null; github: string | null };
}) {
  const { update } = useSession();
  const router = useRouter();
  const [profileState, profileAction] = useFormState<FormState, FormData>(updateProfile, {});
  const [pwState, pwAction] = useFormState<FormState, FormData>(changePassword, {});

  // 이름 변경 시 세션(JWT)의 이름도 갱신 → 상단 메뉴에 즉시 반영
  useEffect(() => {
    if (profileState.ok) {
      const name = (document.getElementById("name") as HTMLInputElement | null)?.value;
      if (name) update({ name }).then(() => router.refresh());
    }
  }, [profileState, update, router]);

  return (
    <div className="space-y-6">
      <form action={profileAction} className="card space-y-4">
        <h2 className="font-semibold">기본 정보</h2>
        <div>
          <label htmlFor="name" className="label">이름</label>
          <input id="name" name="name" defaultValue={user.name} required className="input" />
        </div>
        <div>
          <label htmlFor="github" className="label">GitHub 아이디</label>
          <input id="github" name="github" defaultValue={user.github ?? ""} className="input font-mono" placeholder="octocat" />
        </div>
        <div>
          <label htmlFor="bio" className="label">한 줄 소개 <span className="font-normal text-zinc-400">(200자)</span></label>
          <textarea id="bio" name="bio" defaultValue={user.bio ?? ""} maxLength={200} rows={3} className="input" placeholder="관심 분야, 잘하는 것, 함께 하고 싶은 프로젝트" />
        </div>
        <div className="flex items-center justify-between">
          <Status state={profileState} />
          <SubmitButton className="btn-primary ml-auto">저장</SubmitButton>
        </div>
      </form>

      <form action={pwAction} className="card space-y-4">
        <h2 className="font-semibold">비밀번호 변경</h2>
        <div>
          <label htmlFor="current" className="label">현재 비밀번호</label>
          <input id="current" name="current" type="password" required autoComplete="current-password" className="input" />
        </div>
        <div>
          <label htmlFor="next" className="label">새 비밀번호</label>
          <input id="next" name="next" type="password" required autoComplete="new-password" className="input" placeholder="영문+숫자 8자 이상" />
        </div>
        <div className="flex items-center justify-between">
          <Status state={pwState} />
          <SubmitButton className="btn-primary ml-auto">변경</SubmitButton>
        </div>
      </form>
    </div>
  );
}
