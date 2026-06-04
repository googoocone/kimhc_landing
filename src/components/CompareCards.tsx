"use client";

import { useEffect, useRef, useState } from "react";

/* 재산방어 비교 카드 (강조 애니메이션)
   - 화면에 들어오면: 왼쪽 카드 → 화살표 → 오른쪽 카드 순으로 등장
   - 각 카드의 항목(행)도 순차로 슉
   - 화살표는 계속 움직이고, 오른쪽(김훈찬) 카드는 초록 글로우로 강조 */

type Side = {
  title: string;
  rows: string[][];
  totalLabel: string;
  total: string;
};

function Card({
  data,
  accent,
  shown,
  cardDelay,
  fromX,
}: {
  data: Side;
  accent: "gray" | "green";
  shown: boolean;
  cardDelay: number;
  fromX: number;
}) {
  const isGreen = accent === "green";
  const reveal = (delay: number, y = 0) => ({
    transitionDelay: `${delay}ms`,
    transform: shown
      ? "translate(0,0)"
      : `translate(${fromX}px, ${y}px)`,
    opacity: shown ? 1 : 0,
  });

  return (
    <div
      className={`relative w-full max-w-[460px] overflow-hidden rounded-2xl border bg-white transition-[transform,opacity] duration-700 ease-out ${
        isGreen ? "glow-pulse border-emerald-500" : "border-black/10 shadow-sm"
      }`}
      style={reveal(cardDelay)}
    >
      {/* 헤더 */}
      <div
        className={`relative px-6 py-4 text-center text-lg font-bold sm:text-xl ${
          isGreen ? "bg-emerald-600 text-white" : "bg-gray-300 text-gray-700"
        }`}
      >
        {data.title}
        {isGreen && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-amber-300">
            ★
          </span>
        )}
      </div>

      {/* 항목들 */}
      <div className="px-6">
        {data.rows.map(([label, val], i) => {
          const isDefense =
            label.includes("추가생계비") || label.includes("재산방어");
          return (
            <div
              key={i}
              className={`flex items-center justify-between border-b border-black/5 py-3.5 transition-[transform,opacity] duration-500 ease-out ${
                isDefense ? "rounded-md bg-emerald-50 px-2" : ""
              }`}
              style={reveal(cardDelay + 200 + i * 90, 10)}
            >
              <span className="text-sm text-gray-500 sm:text-base">{label}</span>
              <span
                className={`text-base font-semibold sm:text-lg ${
                  isDefense ? "text-emerald-600" : "text-black"
                }`}
              >
                {val}
              </span>
            </div>
          );
        })}
      </div>

      {/* 총 변제금 */}
      <div
        className={`flex items-center justify-between px-6 py-4 transition-[transform,opacity] duration-500 ease-out ${
          isGreen ? "bg-emerald-50" : "bg-gray-50"
        }`}
        style={reveal(cardDelay + 200 + data.rows.length * 90, 10)}
      >
        <span className="text-sm font-medium text-gray-600 sm:text-base">
          {data.totalLabel}
        </span>
        <span
          className={`text-xl font-extrabold sm:text-2xl ${
            isGreen ? "text-emerald-600" : "text-gray-700"
          }`}
        >
          {data.total}
        </span>
      </div>
    </div>
  );
}

export default function CompareCards({
  left,
  right,
}: {
  left: Side;
  right: Side;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
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
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="mt-12 flex flex-col items-center justify-center gap-6 sm:mt-16 sm:flex-row sm:items-center sm:gap-5"
    >
      <Card data={left} accent="gray" shown={shown} cardDelay={0} fromX={-40} />

      {/* 가운데 화살표 */}
      <div
        className="flex items-center justify-center transition-[transform,opacity] duration-500 ease-out"
        style={{
          transitionDelay: "500ms",
          opacity: shown ? 1 : 0,
          transform: shown ? "scale(1)" : "scale(0.4)",
        }}
      >
        <span className="compare-arrow text-3xl font-bold text-emerald-500">
          <span className="inline-block rotate-90 sm:rotate-0">→</span>
        </span>
      </div>

      <Card data={right} accent="green" shown={shown} cardDelay={650} fromX={40} />
    </div>
  );
}
