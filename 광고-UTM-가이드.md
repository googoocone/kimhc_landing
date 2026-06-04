# 광고 UTM 링크 가이드

광고를 보고 들어온 사람이 **어느 광고·어떤 키워드로 들어와 상담까지 했는지**를
`/admin` 대시보드에서 보려면, **광고의 연결 URL(랜딩 주소)에 UTM 꼬리표를 붙여야** 합니다.

> 이 꼬리표가 없으면 그냥 "직접 유입"으로만 잡혀서 광고 성과를 알 수 없습니다.

---

## 1. 기본 구조

```
https://도메인.com/?utm_source=naver&utm_medium=cpc&utm_campaign=개인회생&utm_term=개인회생변호사
```

`?` 뒤에 `이름=값` 을 `&` 로 이어 붙입니다.

| 파라미터 | 의미 | 예시 값 | 필수 |
| --- | --- | --- | --- |
| `utm_source` | 어디 광고냐 (매체) | `naver`, `google`, `kakao` | ✅ |
| `utm_medium` | 광고 유형 | `cpc`(검색광고), `display`(배너), `sns` | ✅ |
| `utm_campaign` | 캠페인 이름 (대시보드 "캠페인" 열) | `개인회생`, `파산`, `회생2026봄` | ✅ |
| **`utm_term`** | **검색 키워드 (대시보드 "키워드" 열)** ⭐ | `개인회생변호사`, `빚탕감` | ✅ |
| `utm_content` | 같은 키워드 안에서 소재 구분 (선택) | `bannerA`, `text1` | ⬜ |

> 대시보드는 **`utm_campaign`(캠페인) × `utm_term`(키워드)** 기준으로
> 방문 수 · 상담 신청 수 · 전환율을 집계합니다.

---

## 2. 복사용 템플릿

`도메인.com` 과 값만 바꿔서 쓰세요.

```
https://도메인.com/?utm_source=매체&utm_medium=cpc&utm_campaign=캠페인명&utm_term=키워드
```

> ⚠️ **`도메인.com` 은 실제 배포 주소로 바꿔야 합니다.**
> Vercel 배포 후 주소(예: `pyeongan.vercel.app` 또는 연결한 도메인)로 교체하세요.

---

## 3. 매체별 등록 방법

### 네이버 파워링크 (검색광고)
1. 광고 만들 때 **"연결 URL"** 칸에 위 형식으로 입력
2. **키워드마다** `utm_term` 만 바꿔서 등록하면 키워드별 전환이 따로 잡힙니다

```
https://도메인.com/?utm_source=naver&utm_medium=cpc&utm_campaign=개인회생&utm_term=개인회생변호사
https://도메인.com/?utm_source=naver&utm_medium=cpc&utm_campaign=개인회생&utm_term=개인회생자격
https://도메인.com/?utm_source=naver&utm_medium=cpc&utm_campaign=파산&utm_term=개인파산절차
```

> 네이버 자동 추적 파라미터(`n_query`, `n_keyword` 등)도 자동으로 캡처되지만,
> **직접 `utm_term` 을 박는 쪽이 가장 깔끔하고 정확**합니다.

### 구글애즈 (검색광고)
- 연결 URL에 `utm_term={keyword}` 처럼 넣으면 구글이 **실제 검색어를 자동으로 채워**줍니다
- `gclid`(구글 클릭 ID)는 구글이 자동으로 붙여주며 함께 캡처됩니다

```
https://도메인.com/?utm_source=google&utm_medium=cpc&utm_campaign=개인회생&utm_term={keyword}
```

> `{keyword}` 는 그대로 적으세요. 구글이 자동 치환합니다(ValueTrack).

### 카카오 / 메타(페북·인스타) / 배너
```
https://도메인.com/?utm_source=kakao&utm_medium=sns&utm_campaign=개인회생&utm_term=모먼트소재A
https://도메인.com/?utm_source=facebook&utm_medium=display&utm_campaign=개인회생&utm_term=피드광고1
```
> 페이스북 클릭 ID(`fbclid`)도 자동 캡처됩니다.

---

## 4. 실전 예시 (한눈에)

| 매체 | 키워드 | 링크 |
| --- | --- | --- |
| 네이버 | 개인회생변호사 | `...?utm_source=naver&utm_medium=cpc&utm_campaign=개인회생&utm_term=개인회생변호사` |
| 네이버 | 빚탕감 | `...?utm_source=naver&utm_medium=cpc&utm_campaign=개인회생&utm_term=빚탕감` |
| 구글 | (자동) | `...?utm_source=google&utm_medium=cpc&utm_campaign=파산&utm_term={keyword}` |

이렇게 등록하면 대시보드 **"검색 키워드 → 상담 전환"** 표에서:

```
키워드            방문   신청   전환율
개인회생변호사     42     7     16.7%
빚탕감            18     1      5.6%
```

처럼 **어떤 키워드가 실제 상담으로 이어지는지**가 그대로 보입니다.

---

## 5. 주의사항

- **소문자 통일 권장**: `utm_source=Naver` 와 `naver` 는 다른 값으로 집계됩니다. 매체명은 소문자로 통일하세요.
- **`#` 금지**: 값에 `#` 을 넣지 마세요(주소가 끊깁니다).
- **띄어쓰기 대신 `_` 또는 `-`**: `utm_campaign=봄 이벤트` ❌ → `봄_이벤트` ✅
- **한글 키워드 OK**: 한글 `utm_term` 도 정상 추적됩니다(브라우저가 자동 인코딩). 광고 시스템에 그냥 한글로 넣으면 됩니다.
- **이름은 일관되게**: 같은 캠페인은 항상 같은 `utm_campaign` 값을 쓰세요(오타 나면 다른 줄로 쪼개집니다).

---

## 6. 확인하는 곳

`https://도메인.com/admin` → 비밀번호 로그인 →

- **광고 캠페인 → 상담 전환**: 캠페인별 방문/신청/전환율
- **검색 키워드 → 상담 전환**: 키워드별 방문/신청/전환율
- **상담 신청자별 유입 내역**: 신청 1건마다 유입 광고·키워드·상담분야

---

## 7. 한계 — 자연검색(무료) 키워드

UTM은 **돈 내고 돌리는 광고 링크**에만 붙일 수 있습니다.
사용자가 네이버/구글에서 **그냥 검색해서(자연검색)** 들어온 경우의 키워드는,
네이버·구글이 개인정보 보호 정책상 키워드를 넘겨주지 않아 **추적이 불가능합니다.**
(이건 우리 사이트만의 한계가 아니라 GA·다른 분석툴도 동일)

자연검색 키워드까지 보려면:
- **구글**: Google Search Console (무료)
- **네이버**: 네이버 서치어드바이저 (무료)

를 따로 연동해야 합니다. (사이트 인증 메타태그만 넣으면 됨 — 필요 시 요청)
