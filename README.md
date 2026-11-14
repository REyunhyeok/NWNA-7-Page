# NWNA-7-Page — 기본학교 7기 커뮤니티 & 아카이브

기본학교 7기 동지들이 **AI 스킬을 공유**하고, **학습 자료를 쌓고**, **함께 프로젝트를 시작**하는 허브입니다.

| 기능 | 경로 | 설명 |
| --- | --- | --- |
| 소개 | `/`, `/about` | 랜딩 페이지(실시간 통계) · 7기 비전과 여정 |
| 회원 | `/signup`, `/login`, `/profile` | 7기 인증 코드 기반 가입, 이메일 로그인, 프로필·비밀번호 변경 |
| AI 스킬 | `/skills` | 프롬프트/Claude 스킬/에이전트 공유 · 검색 · 카테고리 · 좋아요 · 댓글 · 원클릭 복사 |
| 동지 홈페이지 | `/sites` | 각자 만든 홈페이지 소개 · 방문 링크 · 사용 기술 · 좋아요 · 피드백 댓글 |
| 드라이브 | `/drive` | 폴더별 파일 업로드(드래그앤드롭, 진행률) · 다운로드 · 검색 |
| 동지들 | `/members` | 멤버 디렉터리 · 운영진(ADMIN) 권한 지정/탈퇴 처리 |

## 📊 개발 현황

> 마지막 업데이트: **2026-11-14** · 기준 커밋 `7585219` · 이 섹션은 작업이 진행될 때마다 갱신합니다.

### 한눈에 보기

| 항목 | 상태 |
| --- | --- |
| 전체 진행도 | 🟩🟩🟩🟩🟩🟩🟩🟩⬜⬜ **약 80%** — 기능 구현 완료(홈페이지 게시판 추가), 운영 배포 진행 중 |
| 현재 단계 | **Vercel 첫 배포** (빌드 설정 문제 수정 후 재배포 대기) |
| 운영 주소 | `basicschool7-git-main-re-yunhyeok.vercel.app` (아직 정상 배포 전) |
| 브랜치 | `main` = 배포 대상 · `claude/funny-knuth-mbqg69` = 개발 브랜치 (현재 둘이 같음) |

### 기능별 진행 상황

| 기능 | 구현 | 로컬 테스트 | 운영 확인 | 비고 |
| --- | :---: | :---: | :---: | --- |
| 랜딩 페이지 (`/`) | ✅ | ✅ | ⏳ | 동지·스킬·자료 수 실시간 통계 |
| 소개 페이지 (`/about`) | ✅ | ✅ | ⏳ | 비전·여정 문구는 7기에 맞게 수정 필요 |
| 회원가입 (7기 인증 코드) | ✅ | ✅ | ⏳ | 잘못된 코드 차단 확인 |
| 로그인 / 로그아웃 | ✅ | ✅ | ⏳ | 이메일+비밀번호, 14일 세션 |
| 프로필·비밀번호 변경 (`/profile`) | ✅ | ✅ | ⏳ | |
| 동지 목록·운영진 관리 (`/members`) | ✅ | ✅ | ⏳ | 운영진 지정/해제, 탈퇴 처리 |
| AI 스킬 게시판 (`/skills`) | ✅ | ✅ | ⏳ | 검색·카테고리·정렬·좋아요·댓글·복사 |
| 동지 홈페이지 게시판 (`/sites`) | ✅ | ✅ | ⏳ | **신규** · 소개 작성·수정·삭제, 좋아요, 피드백, 검색 |
| 드라이브 — 로컬 디스크 모드 | ✅ | ✅ | — | 업로드·다운로드·삭제 확인 |
| 드라이브 — Vercel Blob 모드 | ✅ | ❌ | ⏳ | **운영에서 처음 확인 필요** (로컬엔 Blob 토큰 없음) |
| 모바일 화면 | ✅ | ✅ | ⏳ | 390px 폭에서 확인 |

✅ 완료 · ⏳ 대기 · ❌ 아직 안 함

### 배포 진행 상황 (Vercel)

- [x] GitHub 저장소를 Vercel 프로젝트(`basicschool7`)로 가져오기
- [x] 코드를 `main`에 병합
- [x] `vercel.json` 추가 — 프레임워크를 Next.js로 고정
- [ ] **Settings → Build and Deployment → Framework Preset을 `Next.js`로 변경** (현재 `Other`라서 `public` 폴더 에러)
- [x] 커밋 작성자를 저장소 주인으로 변경 → `main` push 시 자동 배포
- [ ] 자동 배포 결과 확인 (Deployments 탭)
- [ ] Storage: Neon(Postgres) 연결 → `DATABASE_URL`
- [ ] Storage: Blob 연결 → `BLOB_READ_WRITE_TOKEN`
- [ ] 환경 변수: `NEXTAUTH_SECRET`, `COHORT_INVITE_CODE`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`
- [ ] 운영에서 관리자 로그인·스킬 등록·파일 업로드 확인
- [ ] 7기 단톡방에 주소와 인증 코드 공유

### 알려진 이슈

| 이슈 | 영향 | 대응 |
| --- | --- | --- |
| 빌드 실패: `No Output Directory named "public"` | 배포 안 됨 | 프로젝트 생성 시 Framework가 `Other`로 감지됨. `vercel.json` 추가 완료, 대시보드에서 Preset 변경 후 재배포 필요 |
| ~~Claude가 만든 커밋은 Vercel 자동 배포가 안 됨~~ | ✅ 해결 | 커밋 작성자를 저장소 주인(REyunhyeok)으로 변경 → 이제 `main`에 push하면 자동 배포 |
| Blob 업로드 경로 미검증 | 운영 드라이브 업로드 실패 가능성 | 첫 배포 후 작은 파일로 업로드·다운로드 테스트 |
| 스킬·홈페이지 상세를 열 때마다 조회수 증가 | 새로고침해도 조회수가 오름 | 추후 사용자별 1회 집계로 개선 |
| 모바일에서 상단 메뉴가 5개라 화면을 넘침 | 오른쪽 메뉴(동지들)는 옆으로 밀어야 보임 | 추후 모바일용 햄버거 메뉴로 개선 |
| 홈페이지 썸네일이 글자 이미지 | 실제 사이트 화면이 아님 | 추후 스크린샷/대표 이미지 업로드 지원 |

### 다음 할 일 (우선순위 순)

1. Vercel 첫 배포 성공시키기 (위 체크리스트)
2. 운영에서 전체 기능 점검, 특히 Blob 업로드
3. 소개 페이지 문구를 7기 실제 내용으로 교체
4. 스킬 본문 Markdown 렌더링, 북마크
5. 공지사항 / 팀 프로젝트 모집 게시판
6. 비밀번호 재설정 메일, 로그인 시도 횟수 제한

### 변경 이력

| 날짜 | 커밋 | 내용 |
| --- | --- | --- |
| 2026-11-14 | (이 커밋) | 커밋 작성자를 저장소 주인으로 바꿔 Vercel 자동 배포 활성화, 배포 현황 갱신 |
| 2026-11-14 | `c494317` | README 개발 현황 갱신 (홈페이지 게시판) |
| 2026-11-14 | `7585219` | **동지 홈페이지 소개 게시판(`/sites`) 추가** · 링크를 http/https로 제한 |
| 2026-11-14 | `246be64` | README에 개발 현황 섹션 추가, 갱신 규칙(`CLAUDE.md`) |
| 2026-11-14 | `d5eb38c` | `vercel.json` 추가 — Vercel에서 Next.js로 인식되도록 고정 |
| 2026-11-14 | `a714fcb` | Vercel 대응: SQLite → PostgreSQL, 파일 저장을 Vercel Blob/로컬 디스크 자동 선택, `vercel-build` 스크립트 |
| 2026-11-14 | `6884e9c` | 첫 구현: 로그인·7기 인증 가입, AI 스킬 게시판, 파일 드라이브, 랜딩·소개, 동지 목록·프로필 |
| — | `afe04dd` | 저장소 생성 |

## 기술 스택

- **Next.js 14 (App Router) + TypeScript** — 페이지·API·서버 액션을 한 프로젝트에서
- **Tailwind CSS** — 디자인 토큰은 `tailwind.config.ts`, 공통 클래스(`.btn-*`, `.card`, `.input`)는 `src/app/globals.css`
- **Prisma + PostgreSQL** — 로컬은 Docker/로컬 Postgres, 배포는 Neon
- **파일 저장소** — Vercel Blob (`BLOB_READ_WRITE_TOKEN` 있을 때) / 로컬 디스크 (없을 때)
- **NextAuth (Credentials, JWT 세션)** + bcrypt 비밀번호 해시
- **zod** — 모든 폼 입력 서버측 검증

## 디렉토리 구조

```
prisma/
  schema.prisma          # User, Skill(+Like/Comment), Site(+Like/Comment), FileItem
  seed.ts                # 최초 관리자 + 예시 스킬
src/
  middleware.ts          # 로그인 필요 경로 보호
  lib/
    auth.ts              # NextAuth 설정, requireUser()
    prisma.ts            # Prisma 싱글턴
    storage.ts           # 파일 저장소 (Vercel Blob / 로컬 디스크 자동 선택)
    validators.ts        # zod 스키마, 카테고리/폴더 상수
    utils.ts
  app/
    page.tsx             # 랜딩
    about/               # 소개
    (auth)/login, signup # 로그인 / 7기 인증 가입
    skills/              # 목록, new, [id], [id]/edit, actions.ts(서버 액션)
    sites/               # 동지 홈페이지 게시판 (구조는 skills와 동일)
    drive/               # 드라이브
    members/, profile/   # 회원 관리
    api/auth/[...nextauth]/  # NextAuth 엔드포인트
    api/files/           # POST 등록, [id] GET 다운로드 / DELETE 삭제, upload-token(Blob 직접 업로드 토큰)
  components/            # Navbar, UserMenu, SubmitButton, skills/*, drive/* …
```

## 로컬 실행

```bash
docker run -d --name gibon7-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=gibon7 -p 5432:5432 postgres:16
npm install
cp .env.example .env      # 값 수정: NEXTAUTH_SECRET, COHORT_INVITE_CODE, ADMIN_*
npm run setup             # DB 테이블 생성 + 관리자 계정 시드
npm run dev               # http://localhost:3000
```

- 관리자 로그인: `.env`의 `ADMIN_EMAIL` / `ADMIN_PASSWORD`
- 동지 가입: `/signup`에서 `COHORT_INVITE_CODE` 입력 (대소문자 무시)
- DB 들여다보기: `npm run db:studio`

## 인증·권한 정책

- 가입은 **7기 인증 코드**를 아는 사람만 가능 → 코드는 단톡방 등 내부 채널로만 공유하고, 유출 시 `.env`에서 바꾸면 됩니다.
- `/skills`, `/sites`, `/drive`, `/members`, `/profile`, `/api/files/*`는 로그인 필수 (`src/middleware.ts`).
- 링크는 http/https 주소만 허용합니다.
- 스킬·홈페이지·댓글·파일은 **작성자 본인 또는 ADMIN**만 수정/삭제.
- 업로드 파일은 랜덤 UUID 이름으로 저장되고, 항상 `attachment`로만 내려가 브라우저에서 실행되지 않습니다.

## 배포 가이드 (Vercel)

1. Vercel 프로젝트 → **Storage** 탭에서 **Neon(Postgres)** 와 **Blob** 스토어를 만들어 프로젝트에 연결
   → `DATABASE_URL`, `BLOB_READ_WRITE_TOKEN` 이 자동으로 환경 변수에 들어갑니다.
2. **Settings → Environment Variables** 에 `NEXTAUTH_SECRET`, `COHORT_INVITE_CODE`,
   `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME` 추가 (`NEXTAUTH_URL`은 Vercel이 자동 감지)
3. 배포하면 `vercel-build` 스크립트가 **스키마 반영 → 관리자 시드 → 빌드**를 자동으로 수행합니다.

업로드는 브라우저가 Blob에 직접 올리므로 Vercel 함수의 4.5MB 요청 제한과 무관하게 `MAX_UPLOAD_MB`까지 올릴 수 있습니다.

## 다음 단계 아이디어

- 스킬 본문 Markdown 렌더링(`react-markdown`), 스킬 북마크
- 프로젝트 팀 모집 게시판, 공지사항
- 파일 미리보기(PDF/이미지), 버전 관리
- 비밀번호 재설정 메일, 로그인 시도 횟수 제한
