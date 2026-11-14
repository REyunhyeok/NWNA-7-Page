# NWNA-7-Page — 기본학교 7기 커뮤니티 & 아카이브

기본학교 7기 동지들이 **AI 스킬을 공유**하고, **학습 자료를 쌓고**, **함께 프로젝트를 시작**하는 허브입니다.

| 기능 | 경로 | 설명 |
| --- | --- | --- |
| 소개 | `/`, `/about` | 랜딩 페이지(실시간 통계) · 7기 비전과 여정 |
| 회원 | `/signup`, `/login`, `/profile` | 7기 인증 코드 기반 가입, 이메일 로그인, 프로필·비밀번호 변경 |
| AI 스킬 | `/skills` | 프롬프트/Claude 스킬/에이전트 공유 · 검색 · 카테고리 · 좋아요 · 댓글 · 원클릭 복사 |
| 드라이브 | `/drive` | 폴더별 파일 업로드(드래그앤드롭, 진행률) · 다운로드 · 검색 |
| 동지들 | `/members` | 멤버 디렉터리 · 운영진(ADMIN) 권한 지정/탈퇴 처리 |

## 기술 스택

- **Next.js 14 (App Router) + TypeScript** — 페이지·API·서버 액션을 한 프로젝트에서
- **Tailwind CSS** — 디자인 토큰은 `tailwind.config.ts`, 공통 클래스(`.btn-*`, `.card`, `.input`)는 `src/app/globals.css`
- **Prisma + SQLite** — 개발은 파일 DB, 운영은 PostgreSQL로 교체 가능
- **NextAuth (Credentials, JWT 세션)** + bcrypt 비밀번호 해시
- **zod** — 모든 폼 입력 서버측 검증

## 디렉토리 구조

```
prisma/
  schema.prisma          # User, Skill, SkillLike, Comment, FileItem
  seed.ts                # 최초 관리자 + 예시 스킬
src/
  middleware.ts          # 로그인 필요 경로 보호
  lib/
    auth.ts              # NextAuth 설정, requireUser()
    prisma.ts            # Prisma 싱글턴
    storage.ts           # 파일 저장소 (로컬 디스크 → S3로 교체 시 이 파일만 수정)
    validators.ts        # zod 스키마, 카테고리/폴더 상수
    utils.ts
  app/
    page.tsx             # 랜딩
    about/               # 소개
    (auth)/login, signup # 로그인 / 7기 인증 가입
    skills/              # 목록, new, [id], [id]/edit, actions.ts(서버 액션)
    drive/               # 드라이브
    members/, profile/   # 회원 관리
    api/auth/[...nextauth]/  # NextAuth 엔드포인트
    api/files/           # POST 업로드, [id] GET 다운로드 / DELETE 삭제
  components/            # Navbar, UserMenu, SubmitButton, skills/*, drive/* …
```

## 로컬 실행

```bash
npm install
cp .env.example .env      # 값 수정: NEXTAUTH_SECRET, COHORT_INVITE_CODE, ADMIN_* 
npm run setup             # DB 생성 + 관리자 계정 시드
npm run dev               # http://localhost:3000
```

- 관리자 로그인: `.env`의 `ADMIN_EMAIL` / `ADMIN_PASSWORD`
- 동지 가입: `/signup`에서 `COHORT_INVITE_CODE` 입력 (대소문자 무시)
- DB 들여다보기: `npm run db:studio`

## 인증·권한 정책

- 가입은 **7기 인증 코드**를 아는 사람만 가능 → 코드는 단톡방 등 내부 채널로만 공유하고, 유출 시 `.env`에서 바꾸면 됩니다.
- `/skills`, `/drive`, `/members`, `/profile`, `/api/files/*`는 로그인 필수 (`src/middleware.ts`).
- 스킬·댓글·파일은 **작성자 본인 또는 ADMIN**만 수정/삭제.
- 업로드 파일은 랜덤 UUID 이름으로 저장되고, 항상 `attachment`로만 내려가 브라우저에서 실행되지 않습니다.

## 배포 가이드

**A. 단일 서버 (가장 간단, SQLite·로컬 파일 그대로)** — Railway / Fly.io / VPS + PM2

```bash
npm ci
npm run build
npm run db:push && npm run db:seed
npm start
```
`DATABASE_URL`과 `UPLOAD_DIR`은 **영구 볼륨** 경로를 가리켜야 재배포 시 데이터가 남습니다.

**B. Vercel** — 서버리스는 로컬 디스크가 휘발되므로
1. `prisma/schema.prisma`의 `provider`를 `postgresql`로 바꾸고 Neon/Supabase 등의 `DATABASE_URL` 설정
2. `src/lib/storage.ts`를 S3/R2/Vercel Blob 업로드로 교체
3. 환경 변수(`NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `COHORT_INVITE_CODE` …) 등록 후 배포

## 다음 단계 아이디어

- 스킬 본문 Markdown 렌더링(`react-markdown`), 스킬 북마크
- 프로젝트 팀 모집 게시판, 공지사항
- 파일 미리보기(PDF/이미지), 버전 관리
- 비밀번호 재설정 메일, 로그인 시도 횟수 제한
