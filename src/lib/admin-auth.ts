import { cookies } from "next/headers";
import crypto from "node:crypto";

/* 관리자(/admin) 비밀번호 인증
   - 쿠키에는 비밀번호 원문 대신 sha256 토큰을 저장(httpOnly).
   - ADMIN_PASSWORD 환경변수가 없으면 인증 자체가 비활성(접근 불가). */

export const ADMIN_COOKIE = "pa_admin";

export function adminToken(): string | null {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return null;
  return crypto.createHash("sha256").update(pw).digest("hex");
}

export async function isAuthed(): Promise<boolean> {
  const token = adminToken();
  if (!token) return false;
  const store = await cookies();
  return store.get(ADMIN_COOKIE)?.value === token;
}
