import type { Metadata, Viewport } from "next";
import { SITE, siteUrl } from "@/lib/site";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: SITE.title, template: `%s · ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  // 카카오톡·슬랙·디스코드·페이스북 등 링크 공유 미리보기
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description,
    url: "/",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: SITE.title }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
    images: ["/og.png"],
  },
};

export const viewport: Viewport = { themeColor: "#09090b" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="flex min-h-screen flex-col">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
