"use client";

import { useFormState } from "react-dom";
import type { Skill } from "@prisma/client";
import SubmitButton from "@/components/SubmitButton";
import { SKILL_CATEGORIES } from "@/lib/validators";
import type { SkillFormState } from "@/app/skills/actions";

type Props = {
  action: (prev: SkillFormState, fd: FormData) => Promise<SkillFormState>;
  initial?: Partial<Skill>;
  submitLabel: string;
};

export default function SkillForm({ action, initial, submitLabel }: Props) {
  const [state, formAction] = useFormState(action, {});
  const e = state.errors ?? {};

  return (
    <form action={formAction} className="card space-y-5">
      <div>
        <label htmlFor="title" className="label">제목</label>
        <input id="title" name="title" defaultValue={initial?.title} required className="input" placeholder="예: 논문 3줄 요약 프롬프트" />
        {e.title && <p className="field-error">{e.title}</p>}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="category" className="label">카테고리</label>
          <select id="category" name="category" defaultValue={initial?.category ?? "PROMPT"} className="input">
            {Object.entries(SKILL_CATEGORIES).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="tags" className="label">태그 <span className="font-normal text-zinc-400">(쉼표로 구분, 최대 8개)</span></label>
          <input id="tags" name="tags" defaultValue={initial?.tags} className="input font-mono" placeholder="claude, 요약, 리서치" />
        </div>
      </div>

      <div>
        <label htmlFor="summary" className="label">한 줄 설명</label>
        <input id="summary" name="summary" defaultValue={initial?.summary} required className="input" placeholder="이 스킬로 무엇을 할 수 있나요?" />
        {e.summary && <p className="field-error">{e.summary}</p>}
      </div>

      <div>
        <label htmlFor="content" className="label">프롬프트 / 사용법</label>
        <textarea
          id="content"
          name="content"
          defaultValue={initial?.content}
          required
          rows={14}
          className="input font-mono text-[13px] leading-relaxed"
          placeholder={"동지들이 그대로 복사해 쓸 수 있도록 프롬프트 전문이나 SKILL.md 내용을 붙여넣으세요.\n\n사용 팁이나 예시 출력도 함께 적어주면 좋아요."}
        />
        {e.content && <p className="field-error">{e.content}</p>}
      </div>

      <div>
        <label htmlFor="sourceUrl" className="label">참고 링크 <span className="font-normal text-zinc-400">(선택)</span></label>
        <input id="sourceUrl" name="sourceUrl" type="url" defaultValue={initial?.sourceUrl ?? ""} className="input" placeholder="https://github.com/..." />
        {e.sourceUrl && <p className="field-error">{e.sourceUrl}</p>}
      </div>

      <div className="flex justify-end">
        <SubmitButton className="btn-brand" pendingText="저장 중…">{submitLabel}</SubmitButton>
      </div>
    </form>
  );
}
