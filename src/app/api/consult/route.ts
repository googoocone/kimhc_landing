/* 개인회생 상담 신청 접수 API (POST /api/consult)
   폼에서 { name, phone } 을 받아 처리합니다.

   ⚠️ 지금은 서버 로그(콘솔)에만 남깁니다. Vercel 배포 시
   Functions 로그에서 확인 가능하지만, 실제 운영에서는 아래 TODO 위치에
   "신청 내용을 받을 방법"을 연결해야 합니다. (이메일 / 구글시트 / 슬랙 / 알림톡 / DB 등) */

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const phone = typeof body?.phone === "string" ? body.phone.trim() : "";
    const category =
      typeof body?.category === "string" ? body.category.trim() : "";

    // 기본 검증
    if (!name || phone.replace(/\D/g, "").length < 10) {
      return Response.json(
        { ok: false, error: "이름과 전화번호를 정확히 입력해 주세요." },
        { status: 400 },
      );
    }

    // ──────────────────────────────────────────────
    // TODO: 신청 내용을 받을 방법을 여기에 연결하세요.
    //   예) 이메일 발송(Resend), 구글시트 기록, 슬랙/카카오 알림톡, DB 저장 등
    // 지금은 서버 로그로만 남깁니다.
    console.log("[상담신청]", {
      name,
      phone,
      category,
      at: new Date().toISOString(),
    });
    // ──────────────────────────────────────────────

    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false, error: "서버 오류" }, { status: 500 });
  }
}
