import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import PageHeader from "@/components/PageHeader";
import SkillForm from "@/components/skills/SkillForm";
import { createSkill } from "../actions";

export const metadata: Metadata = { title: "스킬 공유하기" };

export default async function NewSkillPage() {
  await requireUser();
  return (
    <div className="container-page max-w-3xl py-10">
      <PageHeader eyebrow="skills / new" title="새 AI 스킬 공유" description="내가 쓰는 좋은 프롬프트와 스킬을 동지들에게 나눠주세요." />
      <div className="mt-6">
        <SkillForm action={createSkill} submitLabel="공유하기" />
      </div>
    </div>
  );
}
