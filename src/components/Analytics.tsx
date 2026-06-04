"use client";

import { useEffect } from "react";
import { track, getDevice, captureAttribution, currentUtm } from "@/lib/analytics";

/* 전역 자동 추적기 (layout 에 한 번 마운트)
   자동으로 잡는 행동:
   1) pageview      — 방문 1건 (유입경로/utm/기기/화면크기/언어)
   2) scroll        — 스크롤 깊이 25/50/75/100% 도달 (각 1회)
   3) section_view  — data-section 속성이 붙은 섹션이 화면에 들어옴 (각 1회 → 이탈 지점 파악)
   4) page_time     — 페이지를 떠날 때 머문 시간(초) + 최대 스크롤 깊이
   5) click         — data-track 속성이 붙은 요소 클릭 (위임 처리)
*/
export default function Analytics() {
  useEffect(() => {
    // 관리자 페이지는 추적 대상에서 제외 (자기 데이터 오염 방지)
    if (location.pathname.startsWith("/admin")) return;

    // ── 1) pageview (+ 광고 어트리뷰션 캡처) ──────
    captureAttribution(); // 광고 파라미터가 있으면 저장(이후 상담 신청에 연결됨)
    const utm = currentUtm(); // 이번 방문에 실제로 붙어 온 광고 정보
    track("pageview", {
      referrer: document.referrer || null,
      ...utm, // utm_source/medium/campaign/term/content + gclid 등
      device: getDevice(),
      screen: `${window.innerWidth}x${window.innerHeight}`,
      lang: navigator.language,
    });

    // ── 2) scroll depth ─────────────────────────
    const milestones = [25, 50, 75, 100];
    const hit = new Set<number>();
    let maxDepth = 0;
    const onScroll = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      const pct =
        scrollable <= 0
          ? 100
          : Math.round((window.scrollY / scrollable) * 100);
      if (pct > maxDepth) maxDepth = pct;
      for (const m of milestones) {
        if (pct >= m && !hit.has(m)) {
          hit.add(m);
          track("scroll", { depth: m });
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // ── 3) section_view ─────────────────────────
    const seen = new Set<string>();
    const sections = document.querySelectorAll<HTMLElement>("[data-section]");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const name = e.target.getAttribute("data-section");
          if (e.isIntersecting && name && !seen.has(name)) {
            seen.add(name);
            track("section_view", { section: name });
          }
        }
      },
      { threshold: 0.4 },
    );
    sections.forEach((s) => io.observe(s));

    // ── 5) click (위임) ─────────────────────────
    const onClick = (ev: MouseEvent) => {
      const target = ev.target as HTMLElement | null;
      const el = target?.closest<HTMLElement>("[data-track]");
      if (!el) return;
      const id = el.getAttribute("data-track") || "unknown";
      let meta: Record<string, unknown> = {};
      const rawMeta = el.getAttribute("data-track-meta");
      if (rawMeta) {
        try {
          meta = JSON.parse(rawMeta);
        } catch {
          meta = { value: rawMeta };
        }
      }
      track("click", { id, ...meta });
    };
    document.addEventListener("click", onClick, true);

    // ── 4) page_time (이탈 시 1회) ───────────────
    const startedAt = Date.now();
    let sent = false;
    const sendTime = () => {
      if (sent) return;
      sent = true;
      track("page_time", {
        seconds: Math.round((Date.now() - startedAt) / 1000),
        max_depth: maxDepth,
      });
    };
    const onVisibility = () => {
      if (document.visibilityState === "hidden") sendTime();
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", sendTime);

    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", sendTime);
    };
  }, []);

  return null;
}
