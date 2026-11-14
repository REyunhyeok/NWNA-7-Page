import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "admin@gibon7.kr";
  const password = process.env.ADMIN_PASSWORD ?? "change-me-admin";
  const name = process.env.ADMIN_NAME ?? "운영진";

  const admin = await prisma.user.upsert({
    where: { email },
    update: { role: "ADMIN" },
    create: {
      email,
      name,
      role: "ADMIN",
      passwordHash: await bcrypt.hash(password, 12),
      bio: "기본학교 7기 운영진입니다.",
    },
  });

  const count = await prisma.skill.count();
  if (count === 0) {
    await prisma.skill.create({
      data: {
        title: "코드 리뷰 요청 프롬프트",
        summary: "변경된 코드를 시니어 개발자 관점에서 리뷰받는 기본 프롬프트",
        category: "PROMPT",
        tags: "코드리뷰,claude,개발",
        content: [
          "당신은 10년차 시니어 풀스택 개발자입니다.",
          "아래 diff를 리뷰하고 다음 순서로 답해주세요.",
          "1. 버그 가능성 (재현 시나리오 포함)",
          "2. 보안 이슈",
          "3. 가독성/구조 개선 제안",
          "",
          "```diff",
          "{여기에 diff 붙여넣기}",
          "```",
        ].join("\n"),
        authorId: admin.id,
      },
    });
  }

  console.log(`✔ seed 완료 — 관리자: ${email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
