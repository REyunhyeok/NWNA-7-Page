import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page py-24 text-center">
      <p className="font-mono text-sm text-brand-600">404</p>
      <h1 className="mt-2 text-2xl font-bold">페이지를 찾을 수 없습니다</h1>
      <Link href="/" className="btn-ghost mt-6">홈으로</Link>
    </div>
  );
}
