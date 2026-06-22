import Link from "next/link";
import { isAuthed } from "@/lib/admin-auth";
import { getStats, RANGES, type RangeKey, type Stats } from "@/lib/dashboard";
import AdminLogin from "./AdminLogin";
import LogoutButton from "./LogoutButton";

export const dynamic = "force-dynamic"; // 항상 최신 데이터

export const metadata = {
  title: "관리자 — 방문자 분석",
  robots: { index: false, follow: false },
};

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  // 1) 인증
  if (!(await isAuthed())) {
    return <AdminLogin configured={!!process.env.ADMIN_PASSWORD} />;
  }

  // 2) 기간 선택
  const sp = await searchParams;
  const range: RangeKey = (
    sp.range && sp.range in RANGES ? sp.range : "7d"
  ) as RangeKey;

  // 3) 데이터
  const { ok, stats } = await getStats(range);

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-800 sm:px-8">
      <div className="mx-auto max-w-6xl">
        {/* 헤더 */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">방문자 행동 분석</h1>
            <p className="mt-1 text-sm text-slate-500">
              법무법인 평안 랜딩페이지 · {RANGES[range].label} 기준
            </p>
          </div>
          <LogoutButton />
        </div>

        {/* 기간 탭 */}
        <div className="mt-5 flex flex-wrap gap-2">
          {(Object.keys(RANGES) as RangeKey[]).map((k) => (
            <Link
              key={k}
              href={`/admin?range=${k}`}
              className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition ${
                k === range
                  ? "bg-slate-800 text-white"
                  : "bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {RANGES[k].label}
            </Link>
          ))}
        </div>

        {!ok || !stats ? (
          <NotConnected />
        ) : (
          <Dashboard stats={stats} />
        )}
      </div>
    </main>
  );
}

/* ───────── DB 미연결 안내 ───────── */
function NotConnected() {
  return (
    <div className="mt-8 rounded-2xl bg-white p-8 text-center shadow-sm">
      <p className="text-lg font-semibold text-slate-700">
        아직 Supabase가 연결되지 않았습니다.
      </p>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-500">
        <code>NEXT_PUBLIC_SUPABASE_URL</code> 과{" "}
        <code>SUPABASE_SERVICE_ROLE_KEY</code> 환경변수를 설정하고,{" "}
        <code>supabase/schema.sql</code> 을 Supabase SQL Editor에서 실행하면
        데이터가 쌓이기 시작합니다.
      </p>
    </div>
  );
}

/* ───────── 대시보드 본문 ───────── */
function Dashboard({ stats }: { stats: Stats }) {
  const t = stats.totals;
  return (
    <>
      {/* KPI 카드 */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard label="방문 수" value={t.pageviews} />
        <StatCard label="순 방문자" value={t.visitors} hint="기기 기준" />
        <StatCard label="세션" value={t.sessions} hint="30분 단위" />
        <StatCard label="상담폼 열람" value={t.formOpens} />
        <StatCard label="상담 신청" value={t.submits} accent />
        <StatCard label="전환율" value={`${t.conversion}%`} accent />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          label="평균 체류시간"
          value={`${Math.floor(t.avgSeconds / 60)}분 ${t.avgSeconds % 60}초`}
        />
        <StatCard label="총 이벤트" value={stats.totalEvents} />
      </div>

      {/* 전환 퍼널 */}
      <Card title="전환 퍼널" sub="방문 → 스크롤 → 상담폼 → 신청 (세션 기준)">
        <Funnel steps={stats.funnel} />
      </Card>

      {/* 전환자 동선 */}
      <Card
        title="전환자 동선 (상담신청·전화까지 경로)"
        sub="전환한 사람이 어느 섹션을 거쳐 무엇을 클릭하고 전환했는지 (최근순)"
      >
        <Journeys rows={stats.journeys} />
      </Card>

      {/* ★ 광고 → 상담 전환 (캠페인/키워드별) */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card
          title="광고 캠페인 → 상담 전환"
          sub="utm_campaign 기준 · 방문 대비 신청"
        >
          <PerfTable rows={stats.campaignPerf} firstCol="캠페인" />
        </Card>
        <Card
          title="검색 키워드 → 상담 전환"
          sub="utm_term / 네이버 키워드 기준"
        >
          <PerfTable rows={stats.keywordPerf} firstCol="키워드" />
        </Card>
      </div>

      {/* 신청자별 유입 내역 */}
      <Card
        title="상담 신청자별 유입 내역"
        sub="누가 어느 광고·키워드로 들어와 신청했는지 (최근순)"
      >
        <Leads rows={stats.conversions} />
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* 일자별 방문 추이 */}
        <Card title="일자별 방문 추이">
          <DayChart data={stats.byDay} />
        </Card>

        {/* 유입경로 */}
        <Card title="유입경로 Top">
          <BarList items={stats.referrers} color="bg-sky-500" empty="데이터 없음" />
        </Card>

        {/* 스크롤 도달률 */}
        <Card title="스크롤 도달률" sub="방문자가 어디까지 내려봤나 (세션 기준)">
          <BarList
            items={stats.depthCounts}
            color="bg-violet-500"
            total={stats.totalSessions}
            showPct
          />
        </Card>

        {/* 기기 분포 */}
        <Card title="기기 분포">
          <BarList items={stats.devices} color="bg-emerald-500" empty="데이터 없음" />
        </Card>

        {/* 섹션 도달률 */}
        <Card title="섹션별 도달 (이탈 지점)" sub="각 섹션을 본 세션 수">
          <BarList
            items={stats.sections}
            color="bg-amber-500"
            total={stats.totalSessions}
            showPct
          />
        </Card>

        {/* 클릭 랭킹 */}
        <Card title="클릭 랭킹">
          <BarList items={stats.clicks} color="bg-rose-500" empty="클릭 데이터 없음" />
        </Card>
      </div>
    </>
  );
}

/* ───────── 재사용 UI ───────── */
function StatCard({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: number | string;
  hint?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-xl p-4 shadow-sm ${
        accent ? "bg-slate-800 text-white" : "bg-white text-slate-800"
      }`}
    >
      <p
        className={`text-xs font-medium ${
          accent ? "text-slate-300" : "text-slate-500"
        }`}
      >
        {label}
      </p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
      {hint && (
        <p
          className={`mt-0.5 text-[11px] ${
            accent ? "text-slate-400" : "text-slate-400"
          }`}
        >
          {hint}
        </p>
      )}
    </div>
  );
}

function Card({
  title,
  sub,
  children,
}: {
  title: string;
  sub?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-4 rounded-2xl bg-white p-5 shadow-sm">
      <h2 className="text-sm font-bold text-slate-700">{title}</h2>
      {sub && <p className="mt-0.5 text-xs text-slate-400">{sub}</p>}
      <div className="mt-4">{children}</div>
    </div>
  );
}

function BarList({
  items,
  color,
  total,
  showPct,
  empty,
}: {
  items: { label: string; value: number }[];
  color: string;
  total?: number;
  showPct?: boolean;
  empty?: string;
}) {
  const max = Math.max(total || 0, ...items.map((i) => i.value), 1);
  if (items.length === 0 || items.every((i) => i.value === 0)) {
    return <p className="text-sm text-slate-400">{empty || "데이터 없음"}</p>;
  }
  return (
    <div className="space-y-2.5">
      {items.map((it) => {
        const pct = Math.round((it.value / max) * 100);
        const ofTotal =
          showPct && total ? Math.round((it.value / total) * 100) : null;
        return (
          <div key={it.label} className="flex items-center gap-3">
            <span className="w-24 shrink-0 truncate text-xs text-slate-500">
              {it.label}
            </span>
            <div className="h-5 flex-1 overflow-hidden rounded bg-slate-100">
              <div
                className={`h-full ${color}`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="w-16 shrink-0 text-right text-xs font-semibold text-slate-700">
              {it.value}
              {ofTotal !== null && (
                <span className="ml-1 font-normal text-slate-400">
                  {ofTotal}%
                </span>
              )}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function DayChart({ data }: { data: { date: string; count: number }[] }) {
  if (data.length === 0) {
    return <p className="text-sm text-slate-400">데이터 없음</p>;
  }
  const W = 760;
  const H = 200;
  const pad = { top: 18, right: 14, bottom: 30, left: 34 };
  const innerW = W - pad.left - pad.right;
  const innerH = H - pad.top - pad.bottom;
  const max = Math.max(...data.map((d) => d.count), 1);
  const n = data.length;
  const x = (i: number) =>
    pad.left + (n === 1 ? innerW / 2 : (i / (n - 1)) * innerW);
  const y = (v: number) => pad.top + innerH - (v / max) * innerH;

  const pts = data.map((d, i) => [x(i), y(d.count)] as const);
  const line = pts
    .map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`)
    .join(" ");
  const area = `${line} L${x(n - 1).toFixed(1)} ${(pad.top + innerH).toFixed(
    1,
  )} L${x(0).toFixed(1)} ${(pad.top + innerH).toFixed(1)} Z`;
  const labelEvery = Math.max(1, Math.ceil(n / 8));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full">
      <defs>
        <linearGradient id="dayGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* 가로 기준선 (0 / 중간 / 최대) */}
      {[0, 0.5, 1].map((t) => {
        const gy = pad.top + innerH - t * innerH;
        return (
          <g key={t}>
            <line
              x1={pad.left}
              y1={gy}
              x2={W - pad.right}
              y2={gy}
              stroke="#e2e8f0"
              strokeWidth="1"
            />
            <text x={pad.left - 6} y={gy + 3} fontSize="10" textAnchor="end" fill="#94a3b8">
              {Math.round(t * max)}
            </text>
          </g>
        );
      })}

      {/* 영역 + 선 */}
      <path d={area} fill="url(#dayGrad)" />
      <path
        d={line}
        fill="none"
        stroke="#0ea5e9"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* 점 + 값 */}
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p[0]} cy={p[1]} r="3" fill="#0ea5e9">
            <title>{`${data[i].date}: ${data[i].count}`}</title>
          </circle>
          {(n <= 14 || i % labelEvery === 0) && (
            <text
              x={p[0]}
              y={p[1] - 8}
              fontSize="10"
              textAnchor="middle"
              fill="#0369a1"
              fontWeight="600"
            >
              {data[i].count}
            </text>
          )}
        </g>
      ))}

      {/* x축 날짜 */}
      {data.map((d, i) =>
        i % labelEvery === 0 ? (
          <text
            key={d.date}
            x={x(i)}
            y={H - 8}
            fontSize="10"
            textAnchor="middle"
            fill="#94a3b8"
          >
            {d.date.slice(5)}
          </text>
        ) : null,
      )}
    </svg>
  );
}

const kstTime = new Intl.DateTimeFormat("ko-KR", {
  timeZone: "Asia/Seoul",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

function PerfTable({
  rows,
  firstCol,
}: {
  rows: { label: string; visits: number; conversions: number; rate: number }[];
  firstCol: string;
}) {
  if (rows.length === 0) {
    return (
      <p className="text-sm text-slate-400">
        아직 광고 유입 데이터가 없습니다. 광고 링크에 UTM을 붙여 보세요.
      </p>
    );
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-left text-xs text-slate-400">
            <th className="pb-2 font-medium">{firstCol}</th>
            <th className="pb-2 text-right font-medium">방문</th>
            <th className="pb-2 text-right font-medium">신청</th>
            <th className="pb-2 text-right font-medium">전환율</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} className="border-b border-slate-100 last:border-0">
              <td className="py-2 pr-2 font-medium text-slate-700">{r.label}</td>
              <td className="py-2 text-right text-slate-500">{r.visits}</td>
              <td className="py-2 text-right font-semibold text-slate-800">
                {r.conversions}
              </td>
              <td className="py-2 text-right">
                <span
                  className={`rounded px-1.5 py-0.5 text-xs font-semibold ${
                    r.rate > 0
                      ? "bg-emerald-50 text-emerald-600"
                      : "text-slate-400"
                  }`}
                >
                  {r.rate}%
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Leads({
  rows,
}: {
  rows: {
    at: string;
    source: string;
    campaign: string;
    keyword: string;
    category: string;
    device: string;
  }[];
}) {
  if (rows.length === 0) {
    return <p className="text-sm text-slate-400">아직 상담 신청이 없습니다.</p>;
  }
  return (
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
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-slate-100 last:border-0">
              <td className="py-2 pr-4 text-slate-500">
                {kstTime.format(new Date(r.at))}
              </td>
              <td className="py-2 pr-4 font-medium text-slate-700">{r.source}</td>
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
  );
}

function durLabel(sec: number): string {
  if (sec >= 60) return `${Math.floor(sec / 60)}분 ${sec % 60}초`;
  return `${sec}초`;
}

function Journeys({
  rows,
}: {
  rows: {
    at: string;
    type: string;
    source: string;
    device: string;
    durationSec: number;
    steps: { label: string; at: number }[];
  }[];
}) {
  if (rows.length === 0) {
    return (
      <p className="text-sm text-slate-400">
        아직 전환(상담신청·전화) 동선 데이터가 없습니다.
      </p>
    );
  }
  return (
    <div className="space-y-4">
      {rows.map((j, i) => (
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
    </div>
  );
}

function Funnel({ steps }: { steps: { label: string; value: number }[] }) {
  const top = steps[0]?.value || 1;
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {steps.map((s, i) => {
        const pct = Math.round((s.value / top) * 100);
        const drop =
          i > 0 && steps[i - 1].value > 0
            ? Math.round((s.value / steps[i - 1].value) * 100)
            : 100;
        return (
          <div key={s.label} className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs text-slate-500">{s.label}</p>
            <p className="mt-1 text-2xl font-bold text-slate-800">{s.value}</p>
            <div className="mt-2 h-1.5 overflow-hidden rounded bg-slate-200">
              <div
                className="h-full bg-slate-700"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              {i === 0 ? "전체 기준" : `직전 대비 ${drop}%`}
            </p>
          </div>
        );
      })}
    </div>
  );
}
