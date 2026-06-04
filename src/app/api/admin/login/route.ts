/* 관리자 로그인/로그아웃
   POST   { password }  → 일치 시 httpOnly 인증 쿠키 발급
   DELETE               → 로그아웃(쿠키 삭제) */

import { cookies } from "next/headers";
import { adminToken, ADMIN_COOKIE } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const password = typeof body?.password === "string" ? body.password : "";

  if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) {
    return Response.json(
      { ok: false, error: "비밀번호가 올바르지 않습니다." },
      { status: 401 },
    );
  }

  const token = adminToken();
  if (!token) return Response.json({ ok: false }, { status: 500 });

  const store = await cookies();
  store.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7일
  });
  return Response.json({ ok: true });
}

export async function DELETE() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  return Response.json({ ok: true });
}
