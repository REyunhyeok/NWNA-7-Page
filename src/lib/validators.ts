import { z } from "zod";

export const SKILL_CATEGORIES = {
  PROMPT: "프롬프트",
  CLAUDE_SKILL: "Claude 스킬",
  AGENT: "에이전트",
  WORKFLOW: "워크플로우",
  TOOL: "AI 툴",
} as const;
export type SkillCategory = keyof typeof SKILL_CATEGORIES;

export const DRIVE_FOLDERS = ["일반", "강의자료", "과제", "프로젝트", "참고문서"] as const;

/** http/https 주소만 허용 (javascript: 같은 스킴 차단) */
const httpUrl = (msg = "http(s)로 시작하는 주소를 입력하세요.") =>
  z
    .string()
    .trim()
    .max(500)
    .url(msg)
    .refine((v) => /^https?:\/\//i.test(v), msg);

export const loginSchema = z.object({
  email: z.string().email("올바른 이메일을 입력하세요."),
  password: z.string().min(1, "비밀번호를 입력하세요."),
});

export const signupSchema = z
  .object({
    name: z.string().trim().min(2, "이름은 2자 이상이어야 합니다.").max(20),
    email: z.string().trim().email("올바른 이메일을 입력하세요."),
    password: z
      .string()
      .min(8, "비밀번호는 8자 이상이어야 합니다.")
      .regex(/[A-Za-z]/, "영문을 포함해야 합니다.")
      .regex(/[0-9]/, "숫자를 포함해야 합니다."),
    passwordConfirm: z.string(),
    inviteCode: z.string().trim().min(1, "7기 인증 코드를 입력하세요."),
  })
  .refine((v) => v.password === v.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "비밀번호가 일치하지 않습니다.",
  });

export const profileSchema = z.object({
  name: z.string().trim().min(2).max(20),
  bio: z.string().trim().max(200).optional().or(z.literal("")),
  github: z
    .string()
    .trim()
    .max(39)
    .regex(/^[A-Za-z0-9-]*$/, "GitHub 아이디만 입력하세요.")
    .optional()
    .or(z.literal("")),
});

export const skillSchema = z.object({
  title: z.string().trim().min(2, "제목은 2자 이상").max(80),
  summary: z.string().trim().min(5, "한 줄 설명은 5자 이상").max(160),
  category: z.enum(Object.keys(SKILL_CATEGORIES) as [SkillCategory, ...SkillCategory[]]),
  tags: z.string().trim().max(100).default(""),
  content: z.string().trim().min(10, "본문은 10자 이상").max(20000),
  sourceUrl: httpUrl().optional().or(z.literal("")),
});

export const siteSchema = z.object({
  title: z.string().trim().min(2, "이름은 2자 이상").max(60),
  url: httpUrl(),
  summary: z.string().trim().min(5, "한 줄 소개는 5자 이상").max(120),
  description: z.string().trim().min(10, "소개는 10자 이상").max(5000),
  techStack: z.string().trim().max(120).default(""),
  repoUrl: httpUrl().optional().or(z.literal("")),
});

export const commentSchema = z.object({
  body: z.string().trim().min(1).max(1000),
});
