import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/* 서버 전용 Supabase 클라이언트 (service_role 키 사용)
   - 절대 클라이언트(브라우저)로 import 하지 말 것. service_role 키는 RLS를 우회하므로 서버에서만.
   - 환경변수가 없으면 null 을 반환 → 추적/대시보드는 조용히 비활성화(사이트는 정상 동작). */
let cached: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  if (!cached) {
    cached = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return cached;
}
