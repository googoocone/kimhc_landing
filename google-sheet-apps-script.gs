/**
 * 법무법인 에이파트 — 상담신청 수신 → 구글 시트 기록
 * 사용법은 google-sheet-연동.md 참고.
 * 시트 1행 헤더: 타임스탬프 | 성명 | 연락처 | 상담항목 | 특이사항
 */

// ▼ 원하는 비밀문자열로 바꾸세요. (사이트 환경변수 SHEET_WEBHOOK_TOKEN 과 동일해야 함)
//   빈 문자열("")로 두면 토큰 검증을 하지 않습니다.
var TOKEN = "kimhc-secret-2026";

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    // 공유 비밀키 검증(선택)
    if (TOKEN && data.token !== TOKEN) {
      return json_({ ok: false, error: "unauthorized" });
    }

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

    // 타임스탬프: Date 값으로 넣으면 시트의 한국 로케일 형식(2026. 6. 4 오후 5:21:16)으로 표시됨
    var at = data.at ? new Date(data.at) : new Date();

    // 헤더 순서: 타임스탬프 | 성명 | 연락처 | 상담항목 | 특이사항
    sheet.appendRow([
      at,
      data.name || "",
      data.phone || "",
      data.category || "",
      data.note || "김훈찬변호사님 렌딩",
    ]);

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
