/* 개인회생 상담 신청 접수 API (POST /api/consult)
   폼에서 { name, phone, category, attribution } 을 받아
   외부 커넥터(SheetDB)를 통해 기존 마스터 구글 시트의 해당 탭에 한 줄 추가합니다.

   - 커넥터 엔드포인트는 환경변수 SHEET_API_URL 로 설정 (탭 지정은 URL의 ?sheet=탭이름).
   - SheetDB 는 JSON 의 키를 시트 "열 제목"과 매칭해 행을 추가하므로,
     시트 1행 헤더가 [타임스탬프 | 성명 | 연락처 | 상담항목 | 특이사항] 이어야 함.
   - 미설정(로컬) 시 콘솔에만 기록. (google-sheet-연동.md 참고) */

export const dynamic = "force-dynamic";

const str = (v: unknown): string => (typeof v === "string" ? v.trim() : "");

// 한국시간 타임스탬프 "2026. 6. 6 오후 8:30:15" (구글폼 기본 형식과 동일)
const kstTimestamp = (d: Date): string => {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Seoul",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    })
      .formatToParts(d)
      .map((x) => [x.type, x.value]),
  );
  const ampm = p.dayPeriod === "AM" ? "오전" : "오후";
  return `${p.year}. ${p.month}. ${p.day} ${ampm} ${p.hour}:${p.minute}:${p.second}`;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = str(body?.name);
    const phone = str(body?.phone);
    const category = str(body?.category);

    // 기본 검증
    if (!name || phone.replace(/\D/g, "").length < 10) {
      return Response.json(
        { ok: false, error: "이름과 전화번호를 정확히 입력해 주세요." },
        { status: 400 },
      );
    }

    // 시트 열 제목과 1:1 매칭 (탭에 없는 열/안 보낸 열은 그대로 비어 있음)
    //   특이사항은 사무실 수기 기재용으로 비워둠. 유입 구분은 1차 유입경로에 기록.
    const now = new Date();
    const row = {
      타임스탬프: kstTimestamp(now),
      성명: name,
      연락처: phone,
      상담항목: category,
      "1차 유입경로": "김훈찬 변호사님 랜딩",
    };

    const apiUrl = process.env.SHEET_API_URL;
    if (!apiUrl) {
      console.log("[상담신청]", row);
      return Response.json({ ok: true });
    }

    // 기록할 탭 지정 (SHEET_TAB). 미설정 시 SheetDB 기본(첫) 탭.
    const tab = process.env.SHEET_TAB;
    const target = tab
      ? `${apiUrl}?sheet=${encodeURIComponent(tab)}`
      : apiUrl;

    try {
      const res = await fetch(target, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: row }),
        signal: AbortSignal.timeout(10000),
      });
      if (!res.ok) throw new Error(`sheet api responded ${res.status}`);
    } catch (err) {
      console.error("[상담신청] 시트 기록 실패:", err);
      return Response.json(
        { ok: false, error: "전송에 실패했습니다. 잠시 후 다시 시도해 주세요." },
        { status: 502 },
      );
    }

    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false, error: "서버 오류" }, { status: 500 });
  }
}
