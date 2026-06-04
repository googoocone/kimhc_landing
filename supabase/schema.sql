-- ============================================================
--  법무법인 평안 랜딩페이지 — 행동 추적 DB 스키마 (Supabase / Postgres)
--  Supabase 대시보드 → SQL Editor 에 통째로 붙여넣고 RUN 하면 됩니다.
-- ============================================================

-- 모든 행동 이벤트를 한 테이블에 적재 (pageview, scroll, click, 폼 등)
create table if not exists public.events (
  id          bigint generated always as identity primary key,
  type        text not null,                 -- 이벤트 종류 (pageview / scroll / click / consult_submit ...)
  visitor_id  text,                           -- 브라우저 고유 ID (재방문 식별, localStorage)
  session_id  text,                           -- 방문 세션 ID (30분, sessionStorage)
  path        text,                           -- 발생 경로 (예: /)
  referrer    text,                           -- 유입 경로 (이전 페이지 / 검색엔진 등)
  device      text,                           -- mobile / desktop
  country     text,                           -- 국가코드 (Vercel geo, 가능할 때)
  meta        jsonb not null default '{}'::jsonb,  -- 이벤트별 추가 정보 (섹션명, 클릭 대상, 스크롤 깊이 등)
  created_at  timestamptz not null default now()
);

-- 대시보드 집계용 인덱스
create index if not exists events_created_at_idx on public.events (created_at desc);
create index if not exists events_type_idx       on public.events (type);
create index if not exists events_session_idx    on public.events (session_id);
create index if not exists events_visitor_idx    on public.events (visitor_id);

-- 보안: RLS 켜고 별도 정책을 두지 않음 → anon/public 키로는 읽기·쓰기 불가.
-- 서버(service_role 키)만 접근하므로 방문자 브라우저가 DB를 직접 건드릴 수 없음.
alter table public.events enable row level security;
