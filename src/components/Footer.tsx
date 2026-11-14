export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="container-page flex flex-col gap-1 py-6 text-xs text-zinc-500 sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} 기본학교 7기 · 함께 배우고 함께 만든다</p>
        <p className="font-mono">built with Next.js · Claude Code</p>
      </div>
    </footer>
  );
}
