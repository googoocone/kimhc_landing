/* 브라우저 행동 추적 클라이언트 (방문자 측)
   - track(type, meta) 한 줄로 어디서나 이벤트 전송.
   - 방문자 식별: visitor_id(localStorage, 영구) + session_id(30분 세션).
   - 전송은 sendBeacon 우선(페이지 이탈 중에도 안전), 없으면 fetch keepalive. */

const VISITOR_KEY = "pa_vid";
const SESSION_KEY = "pa_sid";
const SESSION_TS_KEY = "pa_sid_ts";
const SESSION_TTL = 30 * 60 * 1000; // 30분

function uid(): string {
  try {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }
  } catch {
    /* noop */
  }
  return (
    Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)
  );
}

function getVisitorId(): string {
  try {
    let v = localStorage.getItem(VISITOR_KEY);
    if (!v) {
      v = uid();
      localStorage.setItem(VISITOR_KEY, v);
    }
    return v;
  } catch {
    return "anon";
  }
}

function getSessionId(): string {
  try {
    const now = Date.now();
    const ts = Number(sessionStorage.getItem(SESSION_TS_KEY) || 0);
    let s = sessionStorage.getItem(SESSION_KEY);
    if (!s || now - ts > SESSION_TTL) {
      s = uid();
      sessionStorage.setItem(SESSION_KEY, s);
    }
    sessionStorage.setItem(SESSION_TS_KEY, String(now));
    return s;
  } catch {
    return "anon";
  }
}

/* ── 광고 어트리뷰션 (어느 광고/키워드로 들어왔나) ──────────────
   광고 링크에 붙는 파라미터를 캡처해서 브라우저에 저장(last-touch).
   나중에 다시 방문해 상담 신청해도 "원래 어느 광고로 왔는지"가 유지됨. */
const ATTR_KEY = "pa_attr";

// 캡처할 광고 파라미터 (구글/페북 클릭ID, 네이버 키워드 포함)
const AD_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term", // ★ 검색 키워드
  "utm_content",
  "gclid", // 구글애즈 클릭 ID
  "fbclid", // 페이스북 클릭 ID
  "n_query", // 네이버 검색어
  "n_keyword", // 네이버 키워드
  "n_media", // 네이버 매체
  "n_campaign", // 네이버 캠페인
  "n_ad_group", // 네이버 광고그룹
] as const;

export type Attribution = Partial<Record<(typeof AD_PARAMS)[number], string>> & {
  referrer?: string;
  landing?: string;
  first_seen?: string;
};

// 현재 방문 URL에서 광고 파라미터만 추출 (저장 안 함)
export function currentUtm(): Attribution {
  const out: Attribution = {};
  if (typeof window === "undefined") return out;
  try {
    const params = new URLSearchParams(location.search);
    for (const k of AD_PARAMS) {
      const v = params.get(k);
      if (v) out[k] = v.slice(0, 200);
    }
  } catch {
    /* noop */
  }
  return out;
}

// 광고 파라미터가 있으면 저장(덮어쓰기 = 마지막 광고 우선). 반환은 저장된 어트리뷰션.
export function captureAttribution(): Attribution | null {
  if (typeof window === "undefined") return null;
  try {
    const cur = currentUtm();
    if (Object.keys(cur).length > 0) {
      cur.referrer = document.referrer || undefined;
      cur.landing = location.pathname + location.search;
      cur.first_seen = new Date().toISOString();
      localStorage.setItem(ATTR_KEY, JSON.stringify(cur));
      return cur;
    }
    const stored = localStorage.getItem(ATTR_KEY);
    return stored ? (JSON.parse(stored) as Attribution) : null;
  } catch {
    return null;
  }
}

export function getAttribution(): Attribution | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(ATTR_KEY);
    return stored ? (JSON.parse(stored) as Attribution) : null;
  } catch {
    return null;
  }
}

export function getDevice(): "mobile" | "desktop" {
  if (typeof navigator === "undefined") return "desktop";
  const ua = navigator.userAgent || "";
  const mobile =
    /Mobi|Android|iPhone|iPod|iPad|Windows Phone/i.test(ua) ||
    (typeof window !== "undefined" && window.innerWidth < 768);
  return mobile ? "mobile" : "desktop";
}

export function track(type: string, meta: Record<string, unknown> = {}): void {
  if (typeof window === "undefined") return;
  try {
    const payload = {
      type,
      visitor_id: getVisitorId(),
      session_id: getSessionId(),
      path: location.pathname,
      referrer: document.referrer || null,
      device: getDevice(),
      meta,
    };
    const body = JSON.stringify(payload);
    const url = "/api/track";

    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      const ok = navigator.sendBeacon(url, blob);
      if (ok) return;
    }
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* 추적 실패가 사이트 동작을 막지 않도록 무시 */
  }
}
