"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/* 관리자 로그인 화면 — 비밀번호 입력 → /api/admin/login */
export default function AdminLogin({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErr("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setErr(j.error || "로그인 실패");
        setLoading(false);
        return;
      }
      router.refresh();
    } catch {
      setErr("네트워크 오류");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl"
      >
        <h1 className="text-xl font-bold text-slate-800">관리자 대시보드</h1>
        <p className="mt-1 text-sm text-slate-500">
          방문자 행동 분석 — 비밀번호를 입력하세요.
        </p>

        {!configured && (
          <p className="mt-4 rounded-lg bg-amber-50 p-3 text-xs leading-relaxed text-amber-700">
            ⚠️ 아직 <code>ADMIN_PASSWORD</code> 환경변수가 설정되지 않았습니다.
            <br />
            .env.local 또는 Vercel 환경변수에 설정 후 접속하세요.
          </p>
        )}

        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="비밀번호"
          autoFocus
          className="mt-5 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-500"
        />
        {err && <p className="mt-2 text-sm text-red-500">{err}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full rounded-lg bg-slate-800 py-3 text-sm font-semibold text-white transition hover:bg-slate-900 disabled:opacity-60"
        >
          {loading ? "확인 중..." : "로그인"}
        </button>
      </form>
    </div>
  );
}
