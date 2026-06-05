import { ImageResponse } from "next/og";

/* 공유(카톡/페북/트위터) 미리보기용 OG 이미지 1200×630 자동 생성.
   한글 렌더링을 위해 Noto Sans KR(woff)을 불러와 사용. */
export const alt = "개인회생 변호사 김훈찬 — 법무법인 에이파트 회생파산센터";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  const fontData = await fetch(
    "https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-kr/files/noto-sans-kr-korean-700-normal.woff",
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1e3a5f 0%, #0f2540 100%)",
          color: "#ffffff",
          padding: "84px",
        }}
      >
        <div style={{ display: "flex", fontSize: 34, color: "#f5c443" }}>
          법무법인 에이파트 회생파산센터
        </div>
        <div style={{ display: "flex", fontSize: 92, marginTop: 28 }}>
          개인회생 변호사 김훈찬
        </div>
        <div
          style={{ display: "flex", fontSize: 40, marginTop: 28, color: "#cbd5e1" }}
        >
          빚 걱정 없는 새 출발, 끝까지 함께합니다
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 46,
            marginTop: 56,
            color: "#ffffff",
          }}
        >
          상담문의  02-421-0508
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "NotoSansKR",
          data: fontData,
          weight: 700,
          style: "normal",
        },
      ],
    },
  );
}
