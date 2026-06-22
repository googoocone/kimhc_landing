"use client";

import { useState } from "react";

type Journey = {
  at: string;
  type: string;
  source: string;
  device: string;
  durationSec: number;
  steps: { label: string; at: number }[];
};

const kstTime = new Intl.DateTimeFormat("ko-KR", {
  timeZone: "Asia/Seoul",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

function durLabel(sec: number): string {
  if (sec >= 60) return `${Math.floor(sec / 60)}분 ${sec % 60}초`;
  return `${sec}초`;
}

const INITIAL = 5;

export default function JourneyList({ rows }: { rows: Journey[] }) {
  const [shown, setShown] = useState(INITIAL);

  if (rows.length === 0) {
    return (
      <p className="text-sm text-slate-400">
        아직 전환(상담신청·전화) 동선 데이터가 없습니다.
      </p>
    );
  }

  const visible = rows.slice(0, shown);
  const remaining = rows.length - shown;

  return (
    <div className="space-y-4">
      {visible.map((j, i) => (
        <div key={i} className="border-b border-slate-100 pb-4 last:border-0">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
            <span
              className={`rounded px-2 py-0.5 font-semibold ${
                j.type === "상담신청"
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-sky-50 text-sky-600"
              }`}
            >
              {j.type === "상담신청" ? "상담신청" : "전화"}
            </span>
            <span>{kstTime.format(new Date(j.at))}</span>
            <span>· 유입 {j.source}</span>
            <span>· {j.device}</span>
            <span>· 체류 {durLabel(j.durationSec)}</span>
            <span>· {j.steps.length}단계</span>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-1">
            {j.steps.map((st, k) => (
              <span key={k} className="flex items-center gap-1">
                <span
                  className={`rounded px-2 py-1 text-xs ${
                    st.label.startsWith("✅")
                      ? "bg-emerald-100 font-semibold text-emerald-700"
                      : st.label === "전화번호 클릭"
                        ? "bg-sky-100 font-semibold text-sky-700"
                        : "bg-slate-100 text-slate-600"
                  }`}
                  title={`${st.at}초`}
                >
                  {st.label}
                </span>
                {k < j.steps.length - 1 && (
                  <span className="text-slate-300">→</span>
                )}
              </span>
            ))}
          </div>
        </div>
      ))}

      {remaining > 0 ? (
        <button
          type="button"
          onClick={() => setShown(rows.length)}
          className="w-full rounded-lg border border-slate-200 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
        >
          더보기 ({remaining}개 더)
        </button>
      ) : (
        shown > INITIAL && (
          <button
            type="button"
            onClick={() => setShown(INITIAL)}
            className="w-full rounded-lg border border-slate-200 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-50"
          >
            접기
          </button>
        )
      )}
    </div>
  );
}
