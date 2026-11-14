export { default } from "next-auth/middleware";

// 로그인한 7기 멤버만 접근 가능한 경로
export const config = {
  matcher: ["/skills/:path*", "/sites/:path*", "/drive/:path*", "/members/:path*", "/profile/:path*", "/api/files/:path*"],
};
