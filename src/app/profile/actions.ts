"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { profileSchema } from "@/lib/validators";

export type FormState = { ok?: string; error?: string };

export async function updateProfile(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser();
  const parsed = profileSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await prisma.user.update({
    where: { id: user.id },
    data: { name: parsed.data.name, bio: parsed.data.bio || null, github: parsed.data.github || null },
  });
  revalidatePath("/members");
  return { ok: "프로필이 저장되었습니다." };
}

const passwordSchema = z
  .object({
    current: z.string().min(1, "현재 비밀번호를 입력하세요."),
    next: z.string().min(8, "새 비밀번호는 8자 이상").regex(/[A-Za-z]/, "영문 포함").regex(/[0-9]/, "숫자 포함"),
  });

export async function changePassword(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser();
  const parsed = passwordSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const row = await prisma.user.findUniqueOrThrow({ where: { id: user.id } });
  if (!(await bcrypt.compare(parsed.data.current, row.passwordHash))) {
    return { error: "현재 비밀번호가 올바르지 않습니다." };
  }
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await bcrypt.hash(parsed.data.next, 12) },
  });
  return { ok: "비밀번호가 변경되었습니다." };
}
