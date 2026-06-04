"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";

/* 이미지 갤러리 (의견서·카톡 캡처 등 공용)
   - variant="slider": 좌우 슬라이드(캐러셀) — 화살표/스와이프/드래그
   - variant="zigzag": 가로 한 줄에 위-아래-위-아래 지그재그 배치
   - 썸네일 클릭 시 화면 가득 확대(라이트박스), 배경·✕·ESC 로 닫기
   - width/height: 썸네일 원본 비율 (예: 의견서 300×425, 카톡 300×736) */
export default function DocGallery({
  docs,
  width = 300,
  height = 425,
  label = "의견서·보정서 예시",
  variant = "slider",
}: {
  docs: string[];
  width?: number;
  height?: number;
  label?: string;
  variant?: "slider" | "zigzag";
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // 화살표로 한 칸씩 스크롤 (slider 전용)
  const scroll = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  // ESC 닫기 + 모달 열렸을 때 배경 스크롤 잠금
  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIndex(null);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [openIndex]);

  // 썸네일 1개
  const Thumb = ({ src, i, className }: { src: string; i: number; className: string }) => (
    <button
      type="button"
      onClick={() => {
        track("click", { id: "doc_zoom", label, index: i + 1 });
        setOpenIndex(i);
      }}
      className={`group cursor-zoom-in ${className}`}
      aria-label={`${label} ${i + 1} 크게 보기`}
    >
      <Image
        src={src}
        alt={`${label} ${i + 1}`}
        width={width}
        height={height}
        className="h-auto w-full transition duration-200 group-hover:scale-[1.03]"
      />
    </button>
  );

  return (
    <>
      {variant === "slider" ? (
        /* ── 슬라이드(캐러셀) ── */
        <div className="relative mt-12 sm:mt-16">
          <div
            ref={trackRef}
            className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {docs.map((src, i) => (
              <Thumb
                key={i}
                src={src}
                i={i}
                className="w-[78%] flex-none snap-center sm:w-[calc((100%-2.5rem)/3)] lg:w-[calc((100%-3.75rem)/4)]"
              />
            ))}
          </div>

          {/* 좌우 화살표 */}
          <button
            type="button"
            onClick={() => scroll(-1)}
            aria-label="이전"
            className="absolute -left-2 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-2xl text-sky-950 shadow-md transition hover:bg-sky-950 hover:text-white sm:-left-5"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            aria-label="다음"
            className="absolute -right-2 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-2xl text-sky-950 shadow-md transition hover:bg-sky-950 hover:text-white sm:-right-5"
          >
            ›
          </button>
        </div>
      ) : (
        /* ── 모바일: 좌우 슬라이드(스와이프) / PC: 지그재그(위-아래-위-아래) ── */
        <div className="mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:mt-16 sm:snap-none sm:items-start sm:justify-center sm:overflow-visible [&::-webkit-scrollbar]:hidden">
          {docs.map((src, i) => (
            <Thumb
              key={i}
              src={src}
              i={i}
              className={`w-[78%] flex-none snap-center sm:w-auto sm:max-w-[300px] sm:flex-1 ${
                i % 2 === 1 ? "sm:mt-20" : ""
              }`}
            />
          ))}
        </div>
      )}

      {/* 확대 모달 (라이트박스) */}
      {openIndex !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-2 sm:p-6"
          onClick={() => setOpenIndex(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={() => setOpenIndex(null)}
            className="absolute right-4 top-4 z-10 flex size-12 items-center justify-center rounded-full bg-white/15 text-3xl text-white transition hover:bg-white/30"
            aria-label="닫기"
          >
            ✕
          </button>
          <Image
            src={docs[openIndex]}
            alt={`${label} ${openIndex + 1}`}
            width={width * 4}
            height={height * 4}
            className="h-[92vh] w-auto max-w-[96vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
