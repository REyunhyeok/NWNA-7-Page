"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { signupSchema } from "@/lib/validators";

export type SignupState = {
  errors?: Partial<Record<"name" | "email" | "password" | "passwordConfirm" | "inviteCode" | "form", string>>;
};

export async function signupAction(_prev: SignupState, formData: FormData): Promise<SignupState> {
  const parsed = signupSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const errors: SignupState["errors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof NonNullable<SignupState["errors"]>;
      errors[key] ??= issue.message;
    }
    return { errors };
  }

  const { name, email, password, inviteCode } = parsed.data;

  // ── 기본학교 7기 인증: 운영진이 공유한 초대 코드와 일치해야 가입 가능 ──
  const expected = process.env.COHORT_INVITE_CODE;
  if (!expected || inviteCode.toUpperCase() !== expected.toUpperCase()) {
    return { errors: { inviteCode: "7기 인증 코드가 올바르지 않습니다. 운영진에게 문의하세요." } };
  }

  const normalizedEmail = email.toLowerCase();
  const exists = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (exists) return { errors: { email: "이미 가입된 이메일입니다." } };

  await prisma.user.create({
    data: {
      name,
      email: normalizedEmail,
      passwordHash: await bcrypt.hash(password, 12),
    },
  });

  redirect("/login?joined=1");
}
