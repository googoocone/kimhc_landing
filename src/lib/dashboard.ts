import { getSupabaseAdmin } from "@/lib/supabase";

/* 대시보드 집계 (서버 전용)
   events 테이블에서 기간 내 이벤트를 가져와 한눈에 볼 수 있는 지표로 가공. */

export type EventRow = {
  type: string;
  visitor_id: string | null;
  session_id: string | null;
  referrer: string | null;
  device: string | null;
  country: string | null;
  meta: Record<string, unknown> | null;
  created_at: string;
};

export const RANGES = {
  "24h": { label: "최근 24시간", days: 1 },
  "7d": { label: "최근 7일", days: 7 },
  "30d": { label: "최근 30일", days: 30 },
  all: { label: "전체", days: 3650 },
} as const;

export type RangeKey = keyof typeof RANGES;

// 섹션 코드 → 보기 좋은 한글 라벨 (페이지 순서대로)
export const SECTION_ORDER: { key: string; label: string }[] = [
  { key: "01_hero_video", label: "메인 영상" },
  { key: "02_worries", label: "걱정 Q&A" },
  { key: "03_lawyer_intro", label: "변호사 소개" },
  { key: "04_differentiators", label: "5가지 차별점" },
  { key: "05_correction", label: "보정 대응" },
  { key: "06_chat", label: "1:1 담당자" },
  { key: "07_asset_defense", label: "재산방어" },
  { key: "08_fee", label: "수임료" },
  { key: "09_reviews", label: "자필 후기" },
  { key: "10_youtube", label: "유튜브" },
];

// 클릭 id → 한글 라벨
const CLICK_LABELS: Record<string, string> = {
  phone_call: "전화번호 클릭",
  youtube_channel: "유튜브 채널 버튼",
  youtube_thumb: "유튜브 썸네일",
  faq_open: "FAQ 펼침",
  doc_zoom: "서류 이미지 확대",
};

const seoulDate = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

// ── 광고 어트리뷰션 헬퍼 ──
type Attr = Record<string, unknown>;

function attrOf(e: EventRow): Attr {
  const a = (e.meta as { attribution?: Attr })?.attribution;
  return a && typeof a === "object" ? a : {};
}
const s = (v: unknown): string | null =>
  typeof v === "string" && v.trim() ? v.trim() : null;

function campaignOf(a: Attr): string | null {
  return s(a.utm_campaign) || s(a.n_campaign);
}
function keywordOf(a: Attr): string | null {
  return s(a.utm_term) || s(a.n_keyword) || s(a.n_query);
}
function adSourceOf(a: Attr): string | null {
  return (
    s(a.utm_source) ||
    s(a.n_media) ||
    (a.gclid ? "구글광고" : null) ||
    (a.fbclid ? "페이스북광고" : null)
  );
}
// pageview 메타에서 이번 방문의 캠페인/키워드
function pvCampaign(e: EventRow): string | null {
  return s((e.meta as Attr)?.utm_campaign) || s((e.meta as Attr)?.n_campaign);
}
function pvKeyword(e: EventRow): string | null {
  const m = e.meta as Attr;
  return s(m?.utm_term) || s(m?.n_keyword) || s(m?.n_query);
}

function sourceLabel(ev: EventRow): string {
  const m = ev.meta || {};
  if (m.utm_source) return `${m.utm_source}`;
  const r = (ev.referrer || (m.referrer as string) || "") as string;
  if (!r) return "직접 유입";
  try {
    const h = new URL(r).hostname.replace(/^www\./, "").replace(/^m\./, "");
    const map: Record<string, string> = {
      "google.com": "Google",
      "google.co.kr": "Google",
      "naver.com": "네이버",
      "search.naver.com": "네이버",
      "youtube.com": "유튜브",
      "youtu.be": "유튜브",
      "facebook.com": "페이스북",
      "instagram.com": "인스타그램",
      "daum.net": "다음",
      "bing.com": "Bing",
      "t.co": "트위터/X",
    };
    return map[h] || h;
  } catch {
    return "기타";
  }
}

export type Stats = ReturnType<typeof aggregate>;

function aggregate(events: EventRow[]) {
  const pageviews = events.filter((e) => e.type === "pageview");
  const sessions = new Set(events.map((e) => e.session_id).filter(Boolean));
  const visitors = new Set(events.map((e) => e.visitor_id).filter(Boolean));

  // 세션 단위 집계용 맵
  const sessionMaxDepth = new Map<string, number>();
  const sessionFormOpen = new Set<string>();
  const sessionSubmit = new Set<string>();
  const sessionScroll50 = new Set<string>();

  for (const e of events) {
    const s = e.session_id || "";
    if (e.type === "scroll") {
      const d = Number((e.meta as { depth?: number })?.depth || 0);
      sessionMaxDepth.set(s, Math.max(sessionMaxDepth.get(s) || 0, d));
      if (d >= 50) sessionScroll50.add(s);
    } else if (e.type === "consult_form_open") {
      sessionFormOpen.add(s);
    } else if (e.type === "consult_submit") {
      sessionSubmit.add(s);
    }
  }

  // 일자별 방문(pageview) 추이
  const byDayMap = new Map<string, number>();
  for (const e of pageviews) {
    const d = seoulDate.format(new Date(e.created_at));
    byDayMap.set(d, (byDayMap.get(d) || 0) + 1);
  }
  const byDay = [...byDayMap.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, count]) => ({ date, count }));

  // 유입경로 Top
  const refMap = new Map<string, number>();
  for (const e of pageviews) {
    const k = sourceLabel(e);
    refMap.set(k, (refMap.get(k) || 0) + 1);
  }
  const referrers = [...refMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([label, value]) => ({ label, value }));

  // 기기 분포 (세션 단위)
  const deviceMap = new Map<string, Set<string>>();
  for (const e of events) {
    if (!e.device || !e.session_id) continue;
    if (!deviceMap.has(e.device)) deviceMap.set(e.device, new Set());
    deviceMap.get(e.device)!.add(e.session_id);
  }
  const devices = [...deviceMap.entries()]
    .map(([label, set]) => ({
      label: label === "mobile" ? "모바일" : label === "desktop" ? "PC" : label,
      value: set.size,
    }))
    .sort((a, b) => b.value - a.value);

  // 스크롤 도달률 (세션 중 각 깊이 도달 비율)
  const totalSessions = sessions.size || 1;
  const depthCounts = [25, 50, 75, 100].map((d) => {
    let n = 0;
    for (const max of sessionMaxDepth.values()) if (max >= d) n++;
    return { label: `${d}%`, value: n };
  });

  // 섹션 도달률 (세션 단위 section_view)
  const sectionSessions = new Map<string, Set<string>>();
  for (const e of events) {
    if (e.type !== "section_view") continue;
    const name = (e.meta as { section?: string })?.section;
    if (!name || !e.session_id) continue;
    if (!sectionSessions.has(name)) sectionSessions.set(name, new Set());
    sectionSessions.get(name)!.add(e.session_id);
  }
  const sections = SECTION_ORDER.map((s) => ({
    label: s.label,
    value: sectionSessions.get(s.key)?.size || 0,
  }));

  // 클릭 랭킹
  const clickMap = new Map<string, number>();
  for (const e of events) {
    if (e.type !== "click") continue;
    const id = (e.meta as { id?: string })?.id || "기타";
    clickMap.set(id, (clickMap.get(id) || 0) + 1);
  }
  const clicks = [...clickMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([id, value]) => ({ label: CLICK_LABELS[id] || id, value }));

  // 평균 체류 시간
  const times = events
    .filter((e) => e.type === "page_time")
    .map((e) => Number((e.meta as { seconds?: number })?.seconds || 0))
    .filter((n) => n > 0 && n < 3600);
  const avgSeconds = times.length
    ? Math.round(times.reduce((a, b) => a + b, 0) / times.length)
    : 0;

  // 전환 퍼널 (세션 단위)
  const funnel = [
    { label: "방문", value: sessions.size },
    { label: "50% 스크롤", value: sessionScroll50.size },
    { label: "상담폼 열람", value: sessionFormOpen.size },
    { label: "상담 신청", value: sessionSubmit.size },
  ];

  const conversion =
    sessions.size > 0
      ? Math.round((sessionSubmit.size / sessions.size) * 1000) / 10
      : 0;

  // ── 광고 → 상담 전환 (캠페인/키워드별) ──
  const submits = events.filter((e) => e.type === "consult_submit");

  // 캠페인별: 방문(세션) vs 신청수
  const campVisits = new Map<string, Set<string>>();
  for (const e of pageviews) {
    const c = pvCampaign(e);
    if (!c || !e.session_id) continue;
    if (!campVisits.has(c)) campVisits.set(c, new Set());
    campVisits.get(c)!.add(e.session_id);
  }
  const campConv = new Map<string, number>();
  for (const e of submits) {
    const c = campaignOf(attrOf(e));
    if (c) campConv.set(c, (campConv.get(c) || 0) + 1);
  }
  const campaignPerf = [...new Set([...campVisits.keys(), ...campConv.keys()])]
    .map((c) => {
      const visits = campVisits.get(c)?.size || 0;
      const conversions = campConv.get(c) || 0;
      return {
        label: c,
        visits,
        conversions,
        rate: visits > 0 ? Math.round((conversions / visits) * 1000) / 10 : 0,
      };
    })
    .sort((a, b) => b.conversions - a.conversions || b.visits - a.visits);

  // 키워드별: 방문(세션) vs 신청수
  const kwVisits = new Map<string, Set<string>>();
  for (const e of pageviews) {
    const k = pvKeyword(e);
    if (!k || !e.session_id) continue;
    if (!kwVisits.has(k)) kwVisits.set(k, new Set());
    kwVisits.get(k)!.add(e.session_id);
  }
  const kwConv = new Map<string, number>();
  for (const e of submits) {
    const k = keywordOf(attrOf(e));
    if (k) kwConv.set(k, (kwConv.get(k) || 0) + 1);
  }
  const keywordPerf = [...new Set([...kwVisits.keys(), ...kwConv.keys()])]
    .map((k) => {
      const visits = kwVisits.get(k)?.size || 0;
      const conversions = kwConv.get(k) || 0;
      return {
        label: k,
        visits,
        conversions,
        rate: visits > 0 ? Math.round((conversions / visits) * 1000) / 10 : 0,
      };
    })
    .sort((a, b) => b.conversions - a.conversions || b.visits - a.visits);

  // 최근 상담 신청자별 유입 내역 (신규순)
  const conversions = submits
    .map((e) => {
      const a = attrOf(e);
      return {
        at: e.created_at,
        source: adSourceOf(a) || "직접/자연유입",
        campaign: campaignOf(a) || "-",
        keyword: keywordOf(a) || "-",
        category: s((e.meta as Attr)?.category) || "-",
        device:
          e.device === "mobile" ? "모바일" : e.device === "desktop" ? "PC" : "-",
      };
    })
    .reverse()
    .slice(0, 100);

  return {
    totals: {
      pageviews: pageviews.length,
      visitors: visitors.size,
      sessions: sessions.size,
      submits: sessionSubmit.size,
      formOpens: sessionFormOpen.size,
      conversion, // %
      avgSeconds,
    },
    byDay,
    referrers,
    devices,
    depthCounts,
    sections,
    clicks,
    funnel,
    campaignPerf,
    keywordPerf,
    conversions,
    totalSessions,
    totalEvents: events.length,
  };
}

export async function getStats(
  range: RangeKey,
): Promise<{ ok: boolean; stats: Stats | null }> {
  const sb = getSupabaseAdmin();
  if (!sb) return { ok: false, stats: null };

  const days = RANGES[range].days;
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await sb
    .from("events")
    .select(
      "type,visitor_id,session_id,referrer,device,country,meta,created_at",
    )
    .gte("created_at", since)
    .order("created_at", { ascending: true })
    .limit(100000);

  if (error) {
    console.error("[dashboard] fetch error:", error.message);
    return { ok: false, stats: null };
  }

  return { ok: true, stats: aggregate((data || []) as EventRow[]) };
}
