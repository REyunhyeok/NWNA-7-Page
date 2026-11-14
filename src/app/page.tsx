import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

const features = [
  {
    icon: "⚡",
    title: "AI 스킬 공유",
    desc: "잘 먹히는 프롬프트, Claude 스킬, 에이전트 워크플로우를 카드 한 장으로 공유하고 복사해 바로 씁니다.",
    href: "/skills",
  },
  {
    icon: "🗂️",
    title: "자료 드라이브",
    desc: "강의자료·과제·프로젝트 문서를 폴더별로 올리고 내려받는 7기 전용 아카이브입니다.",
    href: "/drive",
  },
  {
    icon: "🤝",
    title: "동지 네트워크",
    desc: "누가 무엇을 잘하는지 프로필로 확인하고, 프로젝트 협업할 동지를 찾습니다.",
    href: "/members",
  },
];

export default async function HomePage() {
  const session = await getSession();
  const [members, skills, files] = await Promise.all([
    prisma.user.count(),
    prisma.skill.count(),
    prisma.fileItem.count(),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-zinc-200 bg-white">
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(to_right,#f4f4f5_1px,transparent_1px),linear-gradient(to_bottom,#f4f4f5_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_75%)]"
        />
        <div className="container-page relative py-20 sm:py-28">
          <p className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 font-mono text-xs text-zinc-600">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" /> cohort.7 — online
          </p>
          <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
            함께 배우고,
            <br />
            <span className="text-brand-600">함께 만드는</span> 기본학교 7기
          </h1>
          <p className="mt-6 max-w-xl text-base text-zinc-600 sm:text-lg">
            7기 동지들의 지식과 도구, 자료가 모이는 곳. 서로의 AI 스킬을 나누고 학습 자료를 쌓아가며
            다음 프로젝트를 함께 시작합니다.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {session ? (
              <Link href="/skills" className="btn-primary px-5 py-2.5">스킬 둘러보기 →</Link>
            ) : (
              <>
                <Link href="/signup" className="btn-primary px-5 py-2.5">7기 인증하고 시작하기 →</Link>
                <Link href="/login" className="btn-ghost px-5 py-2.5">로그인</Link>
              </>
            )}
            <Link href="/about" className="btn-ghost px-5 py-2.5">7기 소개</Link>
          </div>

          <dl className="mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-zinc-200 pt-6">
            {[
              { k: "동지", v: members },
              { k: "AI 스킬", v: skills },
              { k: "공유 자료", v: files },
            ].map((s) => (
              <div key={s.k}>
                <dt className="text-xs text-zinc-500">{s.k}</dt>
                <dd className="mt-1 font-mono text-2xl font-semibold">{s.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Features */}
      <section className="container-page py-16 sm:py-20">
        <p className="font-mono text-xs uppercase tracking-widest text-brand-600">what&apos;s inside</p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">7기를 위한 세 가지 허브</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {features.map((f) => (
            <Link key={f.title} href={f.href} className="card group transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md">
              <div className="text-2xl">{f.icon}</div>
              <h3 className="mt-4 font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">{f.desc}</p>
              <p className="mt-4 text-sm font-medium text-brand-600 group-hover:underline">바로가기 →</p>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-page pb-20">
        <div className="rounded-2xl bg-zinc-900 px-6 py-12 text-center text-white sm:px-12">
          <p className="font-mono text-xs text-zinc-400">$ git commit -m &quot;오늘 배운 것을 나눈다&quot;</p>
          <h2 className="mt-3 text-2xl font-bold sm:text-3xl">혼자 알기 아까운 것, 여기 남겨주세요</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-zinc-400">
            작은 프롬프트 하나, 정리 노트 한 장이 동지의 하루를 바꿉니다.
          </p>
          <Link href={session ? "/skills/new" : "/signup"} className="btn mt-6 bg-white px-5 py-2.5 text-zinc-900 hover:bg-zinc-200">
            {session ? "스킬 공유하기" : "지금 합류하기"}
          </Link>
        </div>
      </section>
    </>
  );
}
