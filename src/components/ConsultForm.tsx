"use client";

import { useState } from "react";

/* 개인회생 상담 신청 폼 (이름 + 전화번호)
   - 전화번호 자동 하이픈, 동의 체크, 검증
   - 제출 시 /api/consult 로 전송 → 성공/오류 상태 표시 */
export default function ConsultForm({
  consentText,
  submitText,
  successText,
}: {
  consentText: string;
  submitText: string;
  successText: string;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [agree, setAgree] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [error, setError] = useState("");

  // 전화번호 자동 하이픈 (010-1234-5678)
  const formatPhone = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 11);
    if (d.length < 4) return d;
    if (d.length < 8) return `${d.slice(0, 3)}-${d.slice(3)}`;
    return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) return setError("이름을 입력해 주세요.");
    if (phone.replace(/\D/g, "").length < 10)
      return setError("올바른 전화번호를 입력해 주세요.");
    if (!agree) return setError("개인정보 수집·이용에 동의해 주세요.");

    setStatus("loading");
    try {
      const res = await fetch("/api/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), phone }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setName("");
      setPhone("");
      setAgree(false);
    } catch {
      setStatus("idle");
      setError("전송에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    }
  };

  // 신청 완료 화면
  if (status === "success") {
    return (
      <div className="rounded-2xl bg-white p-8 text-center text-black shadow-xl">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-100 text-3xl text-emerald-600">
          ✓
        </div>
        <p className="mt-4 whitespace-pre-line text-lg font-semibold leading-relaxed">
          {successText}
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm font-medium text-sky-700 underline"
        >
          추가로 신청하기
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl bg-white p-6 text-black shadow-xl sm:p-8"
    >
      {/* 이름 */}
      <label className="block">
        <span className="text-sm font-semibold text-gray-700">이름</span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="홍길동"
          className="mt-1.5 w-full rounded-lg border border-gray-300 px-4 py-3 text-base outline-none transition focus:border-sky-700 focus:ring-2 focus:ring-sky-700/20"
        />
      </label>

      {/* 전화번호 */}
      <label className="mt-4 block">
        <span className="text-sm font-semibold text-gray-700">전화번호</span>
        <input
          type="tel"
          inputMode="numeric"
          value={phone}
          onChange={(e) => setPhone(formatPhone(e.target.value))}
          placeholder="010-1234-5678"
          className="mt-1.5 w-full rounded-lg border border-gray-300 px-4 py-3 text-base outline-none transition focus:border-sky-700 focus:ring-2 focus:ring-sky-700/20"
        />
      </label>

      {/* 동의 */}
      <label className="mt-4 flex cursor-pointer items-start gap-2.5">
        <input
          type="checkbox"
          checked={agree}
          onChange={(e) => setAgree(e.target.checked)}
          className="mt-0.5 size-4 flex-none accent-sky-800"
        />
        <span className="text-sm leading-snug text-gray-600">{consentText}</span>
      </label>

      {/* 오류 메시지 */}
      {error && <p className="mt-3 text-sm font-medium text-red-500">{error}</p>}

      {/* 제출 */}
      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-5 w-full rounded-lg bg-sky-900 py-3.5 text-base font-bold text-white transition hover:bg-sky-800 disabled:opacity-60"
      >
        {status === "loading" ? "전송 중..." : submitText}
      </button>
    </form>
  );
}
