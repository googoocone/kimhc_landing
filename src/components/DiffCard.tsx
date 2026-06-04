"use client";

import { useEffect, useRef, useState } from "react";
import ImageSlot from "./ImageSlot";

/* 5가지 차별점 카드 1개
   - 화면에 들어오면 아래에서 위로 + 페이드인 등장 (index 만큼 순차 지연)
   - 제목(좌상단) + 설명 + 아이콘(우하단) */
export default function DiffCard({
  bg,
  title,
  desc,
  icon,
  index = 0,
}: {
  bg: string;
  title: string;
  desc: string;
  icon?: string;
  index?: number;
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
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`relative min-h-[280px] w-full rounded-[30px] p-7 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] transition-all duration-700 ease-out sm:h-72 sm:min-h-0 sm:max-w-[384px] sm:flex-1 ${bg}`}
      style={{
        transitionDelay: `${index * 120}ms`,
        transform: shown ? "translateY(0)" : "translateY(48px)",
        opacity: shown ? 1 : 0,
      }}
    >
      {/* 제목 (좌상단) */}
      <h3 className="whitespace-pre-line text-2xl font-semibold leading-8 text-black">
        {title}
      </h3>
      {/* 설명 (제목 바로 아래) */}
      <p className="mt-4 whitespace-pre-line text-base leading-6 text-black/80">
        {desc}
      </p>
      {/* 아이콘 (우하단 고정) */}
      <div className="absolute bottom-0 right-0 size-32 sm:size-36">
        <ImageSlot src={icon} label="아이콘" width={150} height={150} rounded={false} />
      </div>
    </div>
  );
}
