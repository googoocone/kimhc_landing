"use client";

import { useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";

type Item = { q: string; a: string };

/* 걱정 Q&A 아코디언
   - 화면에 들어오면 각 항목이 오른쪽→왼쪽으로 순차 등장
   - 질문 클릭 → 아래에 답변이 부드럽게 펼쳐짐 (grid-rows 트랜지션)
   - 번호(남색) | 구분선 | 질문 | 펼침 화살표 */
export default function WorriesAccordion({ items }: { items: Item[] }) {
  const [open, setOpen] = useState<number | null>(0); // 첫 항목 기본 열림
  const [shown, setShown] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // 화면에 보이면 등장 애니메이션 시작 (한 번만)
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={wrapRef}
      className="mx-auto mt-16 flex max-w-[820px] flex-col gap-4 sm:mt-24 sm:gap-5"
    >
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={i}
            className="overflow-hidden rounded-[10px] bg-white shadow-[2px_4px_8px_2px_rgba(0,0,0,0.15)] transition-all duration-700 ease-out"
            style={{
              transitionDelay: `${i * 130}ms`,
              transform: shown ? "translateX(0)" : "translateX(60px)",
              opacity: shown ? 1 : 0,
            }}
          >
            {/* 질문 (헤더) */}
            <button
              type="button"
              onClick={() => {
                if (!isOpen) track("click", { id: "faq_open", index: i + 1, q: item.q });
                setOpen(isOpen ? null : i);
              }}
              aria-expanded={isOpen}
              className="flex w-full items-center gap-4 px-5 py-5 text-left sm:gap-6 sm:px-8 sm:py-6"
            >
              <span className="w-8 flex-none text-center text-xl font-bold text-sky-950 sm:w-12 sm:text-2xl">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="h-6 w-px flex-none bg-black/15 sm:h-7" />
              <span className="flex-1 text-base font-bold text-neutral-900 sm:text-2xl">
                {item.q}
              </span>
              {/* 펼침 화살표 */}
              <svg
                className={`size-5 flex-none text-gray-400 transition-transform duration-300 sm:size-6 ${
                  isOpen ? "rotate-180" : ""
                }`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            {/* 답변 (펼침) */}
            <div
              className="grid transition-[grid-template-rows] duration-300 ease-out"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <p className="whitespace-pre-line border-t border-black/10 px-5 py-5 text-sm leading-relaxed text-gray-600 sm:px-8 sm:py-6 sm:text-base sm:leading-7">
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
