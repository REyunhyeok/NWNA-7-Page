import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "소개",
  description: "기본학교 7기의 취지와 비전, 그리고 7기가 함께 걸어갈 여정을 소개합니다.",
};

// 내용은 7기 상황에 맞게 자유롭게 수정하세요.
const values = [
  { no: "01", title: "기본에 충실하게", desc: "화려한 기술보다 단단한 기본기. 원리를 이해하고 스스로 설명할 수 있을 때까지 파고듭니다." },
  { no: "02", title: "나누면 커진다", desc: "배운 것은 기록하고 공유합니다. 한 사람의 시행착오가 모두의 지름길이 됩니다." },
  { no: "03", title: "함께 만든다", desc: "혼자 하기 어려운 프로젝트도 동지와 함께라면 가능합니다. 서로의 강점을 연결합니다." },
  { no: "04", title: "AI와 협업한다", desc: "AI를 두려워하지 않고 도구로 다룹니다. 좋은 프롬프트와 스킬을 함께 다듬어 갑니다." },
];

const timeline = [
  { phase: "Phase 1", title: "합류 & 온보딩", desc: "7기 인증, 프로필 작성, 서로 알아가기" },
  { phase: "Phase 2", title: "학습 & 아카이빙", desc: "강의자료·노트를 드라이브에 쌓고 AI 스킬을 공유" },
  { phase: "Phase 3", title: "팀 프로젝트", desc: "동지들과 팀을 꾸려 실제 결과물을 만들기" },
  { phase: "Phase 4", title: "회고 & 다음 기수로", desc: "경험을 정리해 다음 기수에게 남기기" },
];

export default function AboutPage() {
  return (
    <div className="container-page py-16">
      <section className="max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-widest text-brand-600">about / cohort 7</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-5xl">
          우리는 <span className="text-brand-600">기본학교 7기</span>입니다
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-zinc-600">
          기본학교 7기는 서로를 &lsquo;동지&rsquo;라 부르며 함께 성장하는 학습 공동체입니다.
          이 홈페이지는 7기 동지들의 결속을 다지고, 학습 자료와 AI 스킬을 공유하며,
          프로젝트 협업을 시작하는 허브로 만들어졌습니다.
        </p>
      </section>

      <section className="mt-16">
        <h2 className="text-xl font-bold">우리의 비전</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {values.map((v) => (
            <div key={v.no} className="card">
              <span className="font-mono text-sm text-brand-600">{v.no}</span>
              <h3 className="mt-2 font-semibold">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-xl font-bold">7기의 여정</h2>
        <ol className="mt-6 space-y-0 border-l border-zinc-200 pl-6">
          {timeline.map((t) => (
            <li key={t.phase} className="relative pb-8 last:pb-0">
              <span className="absolute -left-[31px] top-1 h-3 w-3 rounded-full border-2 border-white bg-brand-600 ring-1 ring-brand-600" />
              <p className="font-mono text-xs text-zinc-500">{t.phase}</p>
              <h3 className="font-semibold">{t.title}</h3>
              <p className="text-sm text-zinc-600">{t.desc}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-16 card flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold">7기 동지라면 지금 합류하세요</h2>
          <p className="text-sm text-zinc-500">운영진에게 받은 인증 코드로 가입할 수 있습니다.</p>
        </div>
        <Link href="/signup" className="btn-primary">가입하기 →</Link>
      </section>
    </div>
  );
}
