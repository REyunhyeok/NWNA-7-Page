/** 사이트 기본 정보 — 공유 미리보기(OG) 텍스트도 여기서 수정 */
export const SITE = {
  name: "기본학교 7기",
  title: "기본학교 7기 — 함께 배우고, 함께 만드는",
  description: "기본학교 7기 동지들의 커뮤니티 & 아카이브. AI 스킬 공유, 동지 홈페이지 소개, 학습 자료 드라이브를 한곳에서.",
};

/** 공유 링크에 들어갈 절대 주소. SITE_URL > Vercel 운영 도메인 > NEXTAUTH_URL > localhost */
export function siteUrl() {
  if (process.env.SITE_URL) return process.env.SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return process.env.NEXTAUTH_URL ?? "http://localhost:3000";
}
