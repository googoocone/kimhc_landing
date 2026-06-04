"use client";

import { useEffect, useState } from "react";
import { track, getAttribution } from "@/lib/analytics";

/* 화면 하단 고정 상담 신청 바
   - 이름 / 연락처 / 상담분야 + 상담신청
   - 상담신청 클릭 → 개인정보 수집·이용 동의 팝업 → 동의 시 전송 */
export default function StickyConsultBar({
  phoneLabel,
  phone,
  categoryLabel,
  categories,
  submitText,
  consentTitle,
  consentBody,
  agreeText,
  cancelText,
}: {
  phoneLabel: string;
  phone: string;
  categoryLabel: string;
  categories: string[];
  submitText: string;
  consentTitle: string;
  consentBody: string;
  agreeText: string;
  cancelText: string;
}) {
  const [name, setName] = useState("");
  const [tel, setTel] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [showConsent, setShowConsent] = useState(false);
  const [showFab, setShowFab] = useState(false); // 스크롤 내리면 전화상담 FAB 등장

  const formatPhone = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 11);
    if (d.length < 4) return d;
    if (d.length < 8) return `${d.slice(0, 3)}-${d.slice(3)}`;
    return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
  };

  // 상담신청 클릭 → 검증 후 동의 팝업 열기
  const onRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert("이름을 입력해 주세요.");
    if (tel.replace(/\D/g, "").length < 10)
      return alert("올바른 연락처를 입력해 주세요.");
    track("consult_form_open", { category }); // 동의 팝업까지 도달 = 신청 의향
    setShowConsent(true);
  };

  // 팝업에서 동의 → 전송
  const onAgree = async () => {
    setStatus("loading");
    const attribution = getAttribution(); // 이 사람을 데려온 광고/키워드
    try {
      const res = await fetch("/api/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: tel,
          category,
          attribution, // 상담 접수에도 유입 광고 동봉 → 구글시트에서 함께 확인
        }),
      });
      if (!res.ok) throw new Error();
      track("consult_submit", { category, attribution }); // 최종 전환 + 유입 광고
      setShowConsent(false);
      setStatus("success");
      setName("");
      setTel("");
      setCategory("");
    } catch {
      setStatus("idle");
      setShowConsent(false);
      alert("전송에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    }
  };

  // 팝업 열렸을 때 ESC 닫기 + 배경 스크롤 잠금
  useEffect(() => {
    if (!showConsent) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowConsent(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [showConsent]);

  // 스크롤 300px 넘으면 전화상담 FAB 슥 등장 (히어로/띠배너 지난 뒤)
  useEffect(() => {
    const onScroll = () => setShowFab(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const fieldBox = "flex items-center gap-2 rounded-md bg-white px-3 py-2.5";
  const fieldLabel = "whitespace-nowrap text-sm font-bold text-gray-800";
  const fieldInput =
    "w-full min-w-0 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400";

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-50 bg-[#1e3a5f] text-white shadow-[0_-4px_20px_rgba(0,0,0,0.25)]">
        <div className="mx-auto max-w-[1220px] px-4 py-3 sm:px-6">
          {status === "success" ? (
            <div className="flex items-center justify-center gap-3 py-3 text-center">
              <span className="flex size-7 items-center justify-center rounded-full bg-emerald-400 text-sm font-bold text-white">
                ✓
              </span>
              <span className="text-sm font-medium sm:text-base">
                신청이 접수되었습니다. 빠른 시일 내에 연락드리겠습니다.
              </span>
              <button
                type="button"
                onClick={() => setStatus("idle")}
                className="ml-2 text-sm text-white/70 underline"
              >
                추가 신청
              </button>
            </div>
          ) : (
            <>
              <form className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-3">
                <a
                  href={`tel:${phone}`}
                  data-track="phone_call"
                  data-track-meta='{"loc":"consult_bar"}'
                  className="hidden shrink-0 items-center gap-2 leading-tight lg:flex lg:justify-start"
                >
                  <span className="text-base font-bold text-amber-400">
                    즉시 상담
                  </span>
                  <span className="text-2xl font-extrabold tracking-tight">
                    {phone}
                  </span>
                </a>

                <div className="flex gap-2 lg:contents">
                  <div className={`${fieldBox} flex-1`}>
                    <span className={`${fieldLabel} hidden lg:inline`}>이름</span>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="이름 입력"
                      className={fieldInput}
                    />
                  </div>
                  <div className={`${fieldBox} flex-1`}>
                    <span className={`${fieldLabel} hidden lg:inline`}>연락처</span>
                    <input
                      type="tel"
                      inputMode="numeric"
                      value={tel}
                      onChange={(e) => setTel(formatPhone(e.target.value))}
                      placeholder="연락처 입력"
                      className={fieldInput}
                    />
                  </div>
                  {/* 상담분야: 모바일 숨김, 데스크탑(lg)만 표시 */}
                  <div className="hidden flex-1 items-center gap-2 rounded-md bg-white px-3 py-2.5 lg:flex">
                    <span className={fieldLabel}>{categoryLabel}</span>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className={`${fieldInput} cursor-pointer`}
                    >
                      <option value="">(선택)</option>
                      {categories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="submit"
                    onClick={onRequest}
                    className="shrink-0 whitespace-nowrap rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700 sm:px-6"
                  >
                    {submitText}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>

      {/* 모바일 전화상담 플로팅 버튼 (데스크탑은 바에 번호가 있어 숨김) */}
      <a
        href={`tel:${phone}`}
        data-track="phone_call"
        data-track-meta='{"loc":"fab"}'
        aria-label="전화상담"
        className={`fixed bottom-24 right-4 z-50 flex items-center gap-2 rounded-full bg-[#1e3a5f] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-black/30 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:bg-[#274b73] lg:hidden ${
          showFab
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
        >
          <path d="M6.62 10.79a15.53 15.53 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24 11.36 11.36 0 0 0 3.57.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.24 1.02l-2.2 2.2z" />
        </svg>
        전화상담
      </a>

      {/* 개인정보 동의 팝업 */}
      {showConsent && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowConsent(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-[420px] rounded-2xl bg-white p-6 text-black shadow-2xl sm:p-7"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-sky-950">{consentTitle}</h3>
            <p className="mt-4 whitespace-pre-line rounded-lg bg-gray-50 p-4 text-sm leading-relaxed text-gray-700">
              {consentBody}
            </p>
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => setShowConsent(false)}
                disabled={status === "loading"}
                className="flex-1 rounded-lg border border-gray-300 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
              >
                {cancelText}
              </button>
              <button
                type="button"
                onClick={onAgree}
                disabled={status === "loading"}
                className="flex-[2] rounded-lg bg-blue-600 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:opacity-60"
              >
                {status === "loading" ? "전송 중..." : agreeText}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
