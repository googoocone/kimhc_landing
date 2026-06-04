"use client";

import { useEffect, useState } from "react";
import { track } from "@/lib/analytics";

/* 유튜브 썸네일 캐러셀
   - PC(lg↑): 한 화면에 3개 / 모바일: 1개
   - 좌우 화살표 + 페이지 점(dots)
   - 각 썸네일 클릭 시 해당 유튜브 영상으로 이동(새 탭)
   - 썸네일 파일(youtube1~10)이 아직 없으면 회색 placeholder 표시 */
type Thumb = { src: string; href: string };

export default function YoutubeCarousel({ thumbs }: { thumbs: Thumb[] }) {
  const [perView, setPerView] = useState(1);
  const [page, setPage] = useState(0);

  // 화면 크기에 따라 1개 / 3개
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setPerView(mq.matches ? 3 : 1);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const pages = Math.ceil(thumbs.length / perView);

  // perView 가 바뀌면 페이지 범위 보정
  useEffect(() => {
    setPage((p) => Math.min(p, Math.max(0, pages - 1)));
  }, [pages]);

  const go = (p: number) => setPage(Math.max(0, Math.min(pages - 1, p)));

  return (
    <div className="relative">
      {/* 트랙 */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${page * 100}%)` }}
        >
          {thumbs.map((t, i) => (
            <div
              key={i}
              className="shrink-0 px-2"
              style={{ flexBasis: `${100 / perView}%` }}
            >
              {/* 썸네일 (16:9) — 클릭 시 해당 유튜브 영상으로 이동. 이미지 없으면 뒤의 placeholder 노출 */}
              <a
                href={t.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`유튜브 영상 ${i + 1} 보기`}
                onClick={() =>
                  track("click", { id: "youtube_thumb", index: i + 1, href: t.href })
                }
                className="relative block aspect-video w-full overflow-hidden rounded-xl bg-gray-100 shadow-sm ring-1 ring-black/5 transition hover:shadow-md hover:ring-black/10"
              >
                <span className="absolute inset-0 flex items-center justify-center text-sm text-gray-400">
                  유튜브 썸네일 {i + 1}
                </span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={t.src}
                  alt={`유튜브 영상 썸네일 ${i + 1}`}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                  className="absolute inset-0 size-full object-cover"
                />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* 좌우 화살표 */}
      <button
        type="button"
        onClick={() => go(page - 1)}
        disabled={page === 0}
        aria-label="이전"
        className="absolute -left-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-2xl text-sky-950 shadow-md transition hover:bg-sky-950 hover:text-white disabled:opacity-0 sm:-left-5"
      >
        ‹
      </button>
      <button
        type="button"
        onClick={() => go(page + 1)}
        disabled={page >= pages - 1}
        aria-label="다음"
        className="absolute -right-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-2xl text-sky-950 shadow-md transition hover:bg-sky-950 hover:text-white disabled:opacity-0 sm:-right-5"
      >
        ›
      </button>

      {/* 페이지 점 */}
      <div className="mt-8 flex items-center justify-center gap-2.5">
        {Array.from({ length: pages }).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => go(i)}
            aria-label={`${i + 1}페이지`}
            className={`size-2.5 rounded-full transition ${
              i === page ? "bg-red-500" : "bg-zinc-300 hover:bg-zinc-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
