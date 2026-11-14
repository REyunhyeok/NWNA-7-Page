"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { commentSchema, siteSchema } from "@/lib/validators";
import { normalizeTags } from "@/lib/utils";

export type SiteFormState = { errors?: Record<string, string> };

function toErrors(issues: { path: (string | number)[]; message: string }[]) {
  const errors: Record<string, string> = {};
  for (const i of issues) errors[String(i.path[0])] ??= i.message;
  return errors;
}

async function assertCanEdit(siteId: string) {
  const user = await requireUser();
  const site = await prisma.site.findUnique({ where: { id: siteId }, select: { authorId: true } });
  if (!site) throw new Error("게시글을 찾을 수 없습니다.");
  if (site.authorId !== user.id && user.role !== "ADMIN") throw new Error("권한이 없습니다.");
  return user;
}

function toData(d: ReturnType<typeof siteSchema.parse>) {
  return { ...d, techStack: normalizeTags(d.techStack), repoUrl: d.repoUrl || null };
}

export async function createSite(_prev: SiteFormState, formData: FormData): Promise<SiteFormState> {
  const user = await requireUser();
  const parsed = siteSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { errors: toErrors(parsed.error.issues) };

  const site = await prisma.site.create({ data: { ...toData(parsed.data), authorId: user.id } });
  revalidatePath("/sites");
  redirect(`/sites/${site.id}`);
}

export async function updateSite(siteId: string, _prev: SiteFormState, formData: FormData): Promise<SiteFormState> {
  await assertCanEdit(siteId);
  const parsed = siteSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { errors: toErrors(parsed.error.issues) };

  await prisma.site.update({ where: { id: siteId }, data: toData(parsed.data) });
  revalidatePath("/sites");
  revalidatePath(`/sites/${siteId}`);
  redirect(`/sites/${siteId}`);
}

export async function deleteSite(siteId: string) {
  await assertCanEdit(siteId);
  await prisma.site.delete({ where: { id: siteId } });
  revalidatePath("/sites");
  redirect("/sites");
}

export async function toggleSiteLike(siteId: string) {
  const user = await requireUser();
  const key = { userId_siteId: { userId: user.id, siteId } };
  const existing = await prisma.siteLike.findUnique({ where: key });
  if (existing) await prisma.siteLike.delete({ where: key });
  else await prisma.siteLike.create({ data: { userId: user.id, siteId } });
  revalidatePath(`/sites/${siteId}`);
  revalidatePath("/sites");
}

export async function addSiteComment(siteId: string, formData: FormData) {
  const user = await requireUser();
  const parsed = commentSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  await prisma.siteComment.create({ data: { body: parsed.data.body, siteId, authorId: user.id } });
  revalidatePath(`/sites/${siteId}`);
}

export async function deleteSiteComment(commentId: string) {
  const user = await requireUser();
  const c = await prisma.siteComment.findUnique({ where: { id: commentId } });
  if (!c) return;
  if (c.authorId !== user.id && user.role !== "ADMIN") throw new Error("권한이 없습니다.");
  await prisma.siteComment.delete({ where: { id: commentId } });
  revalidatePath(`/sites/${c.siteId}`);
}
