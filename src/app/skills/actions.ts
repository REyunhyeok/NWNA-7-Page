"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { commentSchema, skillSchema } from "@/lib/validators";
import { normalizeTags } from "@/lib/utils";

export type SkillFormState = { errors?: Record<string, string> };

function toErrors(issues: { path: (string | number)[]; message: string }[]) {
  const errors: Record<string, string> = {};
  for (const i of issues) errors[String(i.path[0])] ??= i.message;
  return errors;
}

async function assertCanEdit(skillId: string) {
  const user = await requireUser();
  const skill = await prisma.skill.findUnique({ where: { id: skillId }, select: { authorId: true } });
  if (!skill) throw new Error("스킬을 찾을 수 없습니다.");
  if (skill.authorId !== user.id && user.role !== "ADMIN") throw new Error("권한이 없습니다.");
  return user;
}

export async function createSkill(_prev: SkillFormState, formData: FormData): Promise<SkillFormState> {
  const user = await requireUser();
  const parsed = skillSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { errors: toErrors(parsed.error.issues) };

  const { sourceUrl, tags, ...rest } = parsed.data;
  const skill = await prisma.skill.create({
    data: { ...rest, tags: normalizeTags(tags), sourceUrl: sourceUrl || null, authorId: user.id },
  });
  revalidatePath("/skills");
  redirect(`/skills/${skill.id}`);
}

export async function updateSkill(
  skillId: string,
  _prev: SkillFormState,
  formData: FormData,
): Promise<SkillFormState> {
  await assertCanEdit(skillId);
  const parsed = skillSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { errors: toErrors(parsed.error.issues) };

  const { sourceUrl, tags, ...rest } = parsed.data;
  await prisma.skill.update({
    where: { id: skillId },
    data: { ...rest, tags: normalizeTags(tags), sourceUrl: sourceUrl || null },
  });
  revalidatePath("/skills");
  revalidatePath(`/skills/${skillId}`);
  redirect(`/skills/${skillId}`);
}

export async function deleteSkill(skillId: string) {
  await assertCanEdit(skillId);
  await prisma.skill.delete({ where: { id: skillId } });
  revalidatePath("/skills");
  redirect("/skills");
}

export async function toggleLike(skillId: string) {
  const user = await requireUser();
  const key = { userId_skillId: { userId: user.id, skillId } };
  const existing = await prisma.skillLike.findUnique({ where: key });
  if (existing) await prisma.skillLike.delete({ where: key });
  else await prisma.skillLike.create({ data: { userId: user.id, skillId } });
  revalidatePath(`/skills/${skillId}`);
  revalidatePath("/skills");
}

export async function addComment(skillId: string, formData: FormData) {
  const user = await requireUser();
  const parsed = commentSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  await prisma.comment.create({ data: { body: parsed.data.body, skillId, authorId: user.id } });
  revalidatePath(`/skills/${skillId}`);
}

export async function deleteComment(commentId: string) {
  const user = await requireUser();
  const c = await prisma.comment.findUnique({ where: { id: commentId } });
  if (!c) return;
  if (c.authorId !== user.id && user.role !== "ADMIN") throw new Error("권한이 없습니다.");
  await prisma.comment.delete({ where: { id: commentId } });
  revalidatePath(`/skills/${c.skillId}`);
}
