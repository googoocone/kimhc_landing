/* 행동 추적 수집 API (POST /api/track)
   - 방문자 브라우저가 sendBeacon / fetch(keepalive) 로 이벤트를 보냄.
   - 단일 이벤트 또는 배열(배치) 모두 허용.
   - Supabase events 테이블에 적재. 환경변수 미설정 시 조용히 무시(사이트 영향 없음). */

import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic"; // 항상 요청 시점 실행 (캐시 금지)

type Incoming = {
  type?: unknown;
  visitor_id?: unknown;
  session_id?: unknown;
  path?: unknown;
  referrer?: unknown;
  device?: unknown;
  meta?: unknown;
};

const str = (v: unknown, max: number): string | null =>
  typeof v === "string" && v.trim() ? v.trim().slice(0, max) : null;

export async function POST(request: Request) {
  try {
    const raw = await request.json();
    const list: Incoming[] = Array.isArray(raw) ? raw : [raw];

    // Vercel 배포 시 자동으로 들어오는 국가코드 (로컬/그 외엔 null)
    const country =
      request.headers.get("x-vercel-ip-country") ||
      request.headers.get("cf-ipcountry") ||
      null;

    const rows = list
      .slice(0, 50) // 한 요청당 최대 50건
      .map((e) => ({
        type: str(e.type, 64),
        visitor_id: str(e.visitor_id, 64),
        session_id: str(e.session_id, 64),
        path: str(e.path, 256),
        referrer: str(e.referrer, 512),
        device: str(e.device, 32),
        country,
        meta:
          e.meta && typeof e.meta === "object" && !Array.isArray(e.meta)
            ? e.meta
            : {},
      }))
      .filter((r) => r.type && r.session_id);

    if (rows.length === 0) {
      return Response.json({ ok: false }, { status: 400 });
    }

    const sb = getSupabaseAdmin();
    if (sb) {
      const { error } = await sb.from("events").insert(rows);
      if (error) console.error("[track] insert error:", error.message);
    }

    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }
}
