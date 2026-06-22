"use client";

import { useState } from "react";

type Lead = {
  at: string;
  source: string;
  campaign: string;
  keyword: string;
  category: string;
  device: string;
};

const kstTime = new Intl.DateTimeFormat("ko-KR", {
  timeZone: "Asia/Seoul",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

const INITIAL = 8;

export default function LeadsList({ rows }: { rows: Lead[] }) {
  const [shown, setShown] = useState(INITIAL);

  if (rows.length === 0) {
    return <p className="text-sm text-slate-400">아직 상담 신청이 없습니다.</p>;
  }

  const visible = rows.slice(0, shown);
  const remaining = rows.length - shown;

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full whitespace-nowrap text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-xs text-slate-400">
              <th className="pb-2 pr-4 font-medium">신청시각</th>
              <th className="pb-2 pr-4 font-medium">유입</th>
              <th className="pb-2 pr-4 font-medium">캠페인</th>
              <th className="pb-2 pr-4 font-medium">키워드</th>
              <th className="pb-2 pr-4 font-medium">상담분야</th>
              <th className="pb-2 font-medium">기기</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((r, i) => (
              <tr key={i} className="border-b border-slate-100 last:border-0">
                <td className="py-2 pr-4 text-slate-500">
                  {kstTime.format(new Date(r.at))}
                </td>
                <td className="py-2 pr-4 font-medium text-slate-700">
                  {r.source}
                </td>
                <td className="py-2 pr-4 text-slate-600">{r.campaign}</td>
                <td className="py-2 pr-4 font-semibold text-slate-800">
                  {r.keyword}
                </td>
                <td className="py-2 pr-4 text-slate-600">{r.category}</td>
                <td className="py-2 text-slate-500">{r.device}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {remaining > 0 ? (
        <button
          type="button"
          onClick={() => setShown(rows.length)}
          className="mt-3 w-full rounded-lg border border-slate-200 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
        >
          더보기 ({remaining}개 더)
        </button>
      ) : (
        shown > INITIAL && (
          <button
            type="button"
            onClick={() => setShown(INITIAL)}
            className="mt-3 w-full rounded-lg border border-slate-200 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-50"
          >
            접기
          </button>
        )
      )}
    </>
  );
}
