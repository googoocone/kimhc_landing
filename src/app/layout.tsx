import type { Metadata } from "next";
import { Inter, Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/content";
import Analytics from "@/components/Analytics";
import { GoogleTagManager } from "@next/third-parties/google";

// 디자인 기본 폰트: Inter (Figma 스펙). 한글 글자는 Noto Sans KR 로 자동 폴백.
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-noto-sans-kr",
  display: "swap",
});

// ── SEO / 공유 미리보기 설정 ─────────────────────────────
// 검색·카톡/페북 공유 시 보이는 정보. 값은 src/lib/content.ts 에서 수정.
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: site.keywords,
  applicationName: site.name,
  authors: [{ name: "김훈찬 변호사" }],
  creator: site.name,
  publisher: site.name,
  alternates: { canonical: "/" },
  category: "법률",
  formatDetection: { telephone: true },
  openGraph: {
    title: site.title,
    description: site.description,
    url: site.url,
    siteName: site.name,
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: site.ogImage,
        alt: "개인회생 변호사 김훈찬 — 법무법인 에이파트 회생파산센터",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    images: [site.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${inter.variable} ${notoSansKr.variable} antialiased`}
    >
      <GoogleTagManager gtmId="GTM-NZPG5FQX" />
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
