"use client";

import { useEffect, useRef, useState } from "react";

/* 형광펜 하이라이트 — 화면에 들어오면 왼쪽→오른쪽으로 슥 그어짐
   - color: 형광펜 색 (rgba). 글자 아래 절반만 칠해지는 펜 느낌.
   - 한 번만 재생(재진입 시 다시 안 그어짐). */
export default function Highlight({
  children,
  color = "rgba(139,92,246,0.5)",
  duration = 700,
}: {
  children: React.ReactNode;
  color?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
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
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <span
      ref={ref}
      style={{
        backgroundImage: `linear-gradient(to top, ${color} 50%, transparent 50%)`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "left bottom",
        backgroundSize: shown ? "100% 100%" : "0% 100%",
        transition: `background-size ${duration}ms ease-out`,
        // 줄바꿈돼도 자연스럽게
        boxDecorationBreak: "clone",
        WebkitBoxDecorationBreak: "clone",
      }}
    >
      {children}
    </span>
  );
}
