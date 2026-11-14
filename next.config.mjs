/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // 서버 액션으로 전송되는 폼 데이터 최대 크기
    serverActions: { bodySizeLimit: "2mb" },
  },
};

export default nextConfig;
