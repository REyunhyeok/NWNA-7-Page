"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "ADMIN") throw new Error("운영진만 가능합니다.");
  return user;
}

export async function setRole(userId: string, role: "ADMIN" | "MEMBER") {
  const admin = await requireAdmin();
  if (userId === admin.id) throw new Error("본인 권한은 변경할 수 없습니다.");
  await prisma.user.update({ where: { id: userId }, data: { role } });
  revalidatePath("/members");
}

export async function removeMember(userId: string) {
  const admin = await requireAdmin();
  if (userId === admin.id) throw new Error("본인은 삭제할 수 없습니다.");
  await prisma.user.delete({ where: { id: userId } });
  revalidatePath("/members");
}
