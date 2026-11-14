"use client";

import { useFormState } from "react-dom";
import type { Site } from "@prisma/client";
import SubmitButton from "@/components/SubmitButton";
import type { SiteFormState } from "@/app/sites/actions";

type Props = {
  action: (prev: SiteFormState, fd: FormData) => Promise<SiteFormState>;
  initial?: Partial<Site>;
  submitLabel: string;
};

export default function SiteForm({ action, initial, submitLabel }: Props) {
  const [state, formAction] = useFormState(action, {});
  const e = state.errors ?? {};

  return (
    <form action={formAction} className="card space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="title" className="label">홈페이지 이름</label>
          <input id="title" name="title" defaultValue={initial?.title} required className="input" placeholder="예: 길동이의 개발 블로그" />
          {e.title && <p className="field-error">{e.title}</p>}
        </div>
        <div>
          <label htmlFor="url" className="label">주소</label>
          <input id="url" name="url" type="url" defaultValue={initial?.url} required className="input font-mono" placeholder="https://..." />
          {e.url && <p className="field-error">{e.url}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="summary" className="label">한 줄 소개</label>
        <input id="summary" name="summary" defaultValue={initial?.summary} required className="input" placeholder="어떤 홈페이지인지 한 문장으로" />
        {e.summary && <p className="field-error">{e.summary}</p>}
      </div>

      <div>
        <label htmlFor="description" className="label">자세한 소개</label>
        <textarea
          id="description"
          name="description"
          defaultValue={initial?.description}
          required
          rows={10}
          className="input leading-relaxed"
          placeholder={"만든 이유, 주요 기능, 어려웠던 점, 동지들에게 받고 싶은 피드백 등을 자유롭게 적어주세요."}
        />
        {e.description && <p className="field-error">{e.description}</p>}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="techStack" className="label">사용 기술 <span className="font-normal text-zinc-400">(쉼표로 구분)</span></label>
          <input id="techStack" name="techStack" defaultValue={initial?.techStack} className="input font-mono" placeholder="Next.js, Tailwind, Claude Code" />
        </div>
        <div>
          <label htmlFor="repoUrl" className="label">GitHub 저장소 <span className="font-normal text-zinc-400">(선택)</span></label>
          <input id="repoUrl" name="repoUrl" type="url" defaultValue={initial?.repoUrl ?? ""} className="input font-mono" placeholder="https://github.com/..." />
          {e.repoUrl && <p className="field-error">{e.repoUrl}</p>}
        </div>
      </div>

      <div className="flex justify-end">
        <SubmitButton className="btn-brand" pendingText="저장 중…">{submitLabel}</SubmitButton>
      </div>
    </form>
  );
}
