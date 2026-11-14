import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import PageHeader from "@/components/PageHeader";
import SkillForm from "@/components/skills/SkillForm";
import { updateSkill } from "../../actions";

export default async function EditSkillPage({ params }: { params: { id: string } }) {
  const user = await requireUser();
  const skill = await prisma.skill.findUnique({ where: { id: params.id } });
  if (!skill) notFound();
  if (skill.authorId !== user.id && user.role !== "ADMIN") redirect(`/skills/${skill.id}`);

  return (
    <div className="container-page max-w-3xl py-10">
      <PageHeader eyebrow="skills / edit" title="스킬 수정" />
      <div className="mt-6">
        <SkillForm action={updateSkill.bind(null, skill.id)} initial={skill} submitLabel="수정 완료" />
      </div>
    </div>
  );
}
