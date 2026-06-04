/* ============================================================
   ★ 텍스트는 이 파일에서 수정하세요 ★
   - 따옴표 " " 안의 글자만 바꾸기 / 줄바꿈은 \n
   - Figma 디자인대로 섹션을 하나씩 추가하고 있습니다.
   ============================================================ */

// ── 사이트 / SEO 정보 ─────────────────────────────────────
export const site = {
  name: "법무법인 에이파트 회생파산센터",
  title: "법무법인 에이파트 회생파산센터 | 개인회생·파산 책임상담",
  description:
    "변호사가 직접 상담하는 개인회생·파산. 법무법인 에이파트 회생파산센터, 2천명 이상의 의뢰인과 함께한 노하우로 새 삶을 함께합니다.",
  keywords: [
    "개인회생",
    "개인파산",
    "법무법인 에이파트",
    "에이파트 회생파산센터",
    "김훈찬 변호사",
    "회생 상담",
  ],
  url: "https://example.com", // ★ 배포 후 실제 도메인으로 교체
};

// ── 02. "걱정되는 부분" Q&A 섹션 ──────────────────────────
export const worries = {
  introBefore: "저와 함께 개인회생/파산을 통해\n새 삶을 찾으신 ",
  introCount: 2000, // 화면에 보이면 0 → 이 숫자까지 카운트업
  introCountSuffix: "명",
  introAfter: "의 의뢰인에게 물었습니다.",
  headingBlue: "개인회생/파산",
  headingRest: "을 하기 전\n가장 걱정되는 부분은 무엇이었나요?",
  // 클릭하면 답변이 펼쳐지는 아코디언 (q: 질문 / a: 답변, \n 줄바꿈)
  items: [
    {
      q: "내 빚은 얼마나 탕감될까?",
      a: "개인회생은 본인이 가진 재산보다 변제금을 더 내기만 하면 됩니다.\n그렇기 때문에 탕감률의 핵심은 결국 하나, 변호사가 회생위원으로부터 의뢰인의 재산을 얼마나 잘 방어해내느냐입니다.",
    },
    {
      q: "불법 사무장 사무실은 아닐까?",
      a: "저희 의뢰인은 원하는 경우 언제든 직접 사무실에 방문하여 변호사와 상담한 뒤 사건을 맡기고 계십니다.",
    },
    {
      q: "회사에 알려지거나 가족이 알게되지 않을까?",
      a: "결론부터 말씀드리면, 알려지지 않습니다.\n저희는 신청 즉시 법원의 중지·금지명령으로 급여 압류를 풀어 회사가 알 수 없게 처리하고, 우편물 수령 방법도 의뢰인 상황에 맞춰 조율해드립니다. 채권자들의 독촉 전화 역시 저희 사무실에서 모두 응대하기 때문에, 의뢰인은 물론 가족이 대신 전화를 받을 일도 없습니다.",
    },
    {
      q: "개인회생 조건이 안되서 기각되진 않을까?",
      a: '솔직히 말씀드립니다. 요즘 일부 사무실은 기각될 게 뻔한 사건도 일단 수임부터 합니다. 저는 그렇게 안 합니다.\n상담해보고 안 될 사건이면 "안 됩니다"라고 분명히 말씀드립니다. 급할 것 없습니다. 저와 한 번 더 상담해보시고 결정하셔도 늦지 않습니다.',
    },
  ],
};

// ── 03. 대표 변호사 소개 섹션 ─────────────────────────────
export const lawyerIntro = {
  headingBefore: "저와 함께 ",
  headingHighlight: "2천명 이상",
  headingMid: "의 분들이 ", // 모바일은 여기서 줄바꿈
  headingEnd1: "제 2의 인생을 ", // PC는 여기서 줄바꿈
  headingEnd2: "시작하셨습니다",
  // 빈 줄은 \n\n 으로 둡니다.
  body: `안녕하세요, 
  도산전문 변호사 김훈찬입니다.

숲속에서 지도와 나침반 없이 모르는 길을 갈 수 없습니다.

경제적 어려움 속에서 재기를 위해 나아가는 분들의 길잡이가 되겠습니다.

개인회생, 파산은 실패가 아닌 새로운 출발을 위한 선택입니다.힘들게 걸어온 삶의 방향을 바꾸기 위하여 용기를 내신 분들의 두려움과 간절함을 이해합니다.

개인회생의 길에 도전하는 분들이 저와 함께 하신다면 길잡이로서 큰 기쁨이겠습니다.`,
  photo: "/kimhc.png", // public 폴더 기준 경로
  role: "대표 변호사",
  name: "김훈찬",
};

// ── 04. 김훈찬 변호사의 5가지 차별점 ──────────────────────
export const differentiators = {
  eyebrow: "김훈찬 변호사는 어떻게 다른가요?",
  titleBefore: "김훈찬 변호사의 ",
  titleHighlight: "5가지",
  titleAfter: " 차별점",
  // 카드 5개 (위 2개 + 아래 3개 순서). 줄바꿈은 \n
  items: [
    { title: "1:1 전담\n담당자 배정", desc: "카카오톡 1:1 채팅방으로\n언제든 편하게 문의하세요", icon: "/onebyone.png" },
    { title: "6년간 오직\n개인회생/파산", desc: "개인회생/파산 성공사례\n2천건 이상", icon: "/sixyear.png" },
    { title: "의뢰인 재산방어\n프로세스", desc: "재산방어는 변제금을 줄이는\n핵심 과정입니다", icon: "/protect.png" },
    { title: "의뢰인들의\n소중한 자필 후기", desc: "의뢰인들께서 손으로 직접 써주신\n자필 후기를 보고 결정하세요", icon: "/review.png" },
    { title: "변호사의 전문적인\n의견서 제출", desc: "변제금을 줄이기 위해\n변호사가 직접 법원과 싸웁니다", icon: "/write.png" },
  ],
};

// ── 05. 보정 대응 섹션 (의견서/보정서 이미지) ─────────────
export const correction = {
  no: "01.",
  // 제목: 모바일에선 "보정 대응이" 뒤에서 줄바꿈
  titleA: " 보정 대응이 ",
  titleB: "개인회생의 핵심입니다",
  // 본문 문단들 (문단 사이는 한 줄 띄움, \n 은 줄바꿈)
  paragraphs: [
    "회생은 사건 접수 후 법원에서\n보정 권고를 합니다.",
    "이를 그대로 수용하면 변호사는 편합니다.",
    "하지만 의뢰인을 위해 전문적인 의견서로\n끝까지 법원과 맞서",
  ],
  body2Highlight: "의뢰인에게 유리한 조건", // 보라색 형광펜 강조
  body2After: "을 만듭니다.",
  docs: ["/write1.png", "/write2.png", "/write3.png", "/write4.png"],
};

// ── 06. 1:1 전담 담당자 배정 섹션 (카톡 캡처) ─────────────
export const chat = {
  no: "02.",
  title: " 1:1 전담 담당자 배정",
  body1: "카카오톡 1:1 채팅방으로 언제든 편하게 문의하세요",
  body2Highlight: "저와 담당직원이 대기", // 파란색 형광펜 강조
  body2After1: "하고 있습니다.", // "있습니다." 뒤 줄바꿈
  body2After2: "처음부터 끝까지 함께 합니다.",
  images: ["/chat1.png", "/chat2.png", "/chat3.png", "/chat4.png"],
};

// ── 07. 의뢰인 재산방어 시스템 섹션 (가로 배너 이미지) ────
export const assetDefense = {
  no: "03.",
  title: " 의뢰인 재산방어 시스템",
  body1: "같은 조건이라도 어떻게 방어하느냐에 따라 ",
  bodyUnderline: "변제금은 달라집니다.", // 노란 밑줄
  // ↓ 비교 표 (이미지 대신 코드로 구현). 숫자는 저해상도 이미지에서 추정 — 확인/수정하세요.
  compare: {
    left: {
      title: "일반 사무실",
      rows: [
        ["가용소득", "300만원"],
        ["생계비", "-150만원"],
        ["월 변제금", "150만원"],
      ],
      totalLabel: "3년 총 변제금",
      total: "5,400만원",
    },
    right: {
      title: "김훈찬 변호사",
      rows: [
        ["가용소득", "300만원"],
        ["생계비", "-150만원"],
        ["추가생계비", "-60만원"], // 핵심 차이 (방어)
        ["재산방어", "-30만원"], // 추가 방어
        ["월 변제금", "60만원"],
      ],
      totalLabel: "3년 총 변제금",
      total: "2,160만원",
    },
  },
};

// ── 08. 변호사 수임료 섹션 (표 + 안내문, 모두 코드로 구현) ─
export const fee = {
  no: "04.",
  titleA: " 투명하고 합리적인", // "합리적인" 뒤 줄바꿈
  titleB: "변호사 수임료",
  body1: "상담 한번 더 받아도\n회생이 늦어지지 않습니다.",
  body2: "수임료, 투명하고 합리적입니다.",
  headers: ["구분", "수임료"],
  rows: [
    ["급여소득자", "198만원 ~ 250만원 (부가세 포함)"],
    ["영업소득자", "250만원 ~ 350만원 (부가세 포함)"],
  ],
  // 하단 ※ 안내문: ①②③ 번호는 코드로 동그라미 표시
  noteIntro: "수임료의 경우",
  notePoints: [
    "채권자 수가 15곳 이상으로 많거나,",
    "사실관계가 복잡하거나 정리할 자료의 양이 많은 경우,",
    "복잡한 법적 쟁점을 의견서 등으로 풀어나가야 하는 경우에는",
  ],
  noteOutro: "수임료가 상향될 수 있습니다.",
};

// ── 09. 자필 후기 섹션 (가로 무한 스크롤 marquee) ─────────
export const reviews = {
  titleNormal: "김훈찬 변호사 의뢰인들의",
  titleBold: "자필 개인회생 후기",
  body: "시간 내주셔서 후기를 한번만 읽어주세요\n의뢰인들의 회생을 위해 진심으로 임합니다.",
  image: "/reviews.png", // 4096×718 가로 strip
  imageWidth: 4096,
  imageHeight: 718,
};

// ── 10. 상담 신청 폼 + 푸터 ───────────────────────────────
export const contact = {
  heading: "개인회생 무료 상담 신청",
  sub: "이름과 연락처를 남겨주시면\n변호사가 직접 빠르게 연락드립니다.",
  consentText: "개인정보 수집·이용에 동의합니다 (상담 목적, 목적 달성 후 파기)",
  submitText: "상담 신청하기",
  successText: "신청이 접수되었습니다.\n빠른 시일 내에 연락드리겠습니다.",

  // ── 하단 고정 상담 바 ──
  barPhoneLabel: "변호사 직접상담",
  phone: "02-421-0508",
  categoryLabel: "상담분야",
  categories: ["개인회생", "개인파산", "면책", "기타"],
  confirmText:
    "번호 오류시 상담이 어려울 수 있으니, 입력하신 정보 한번 더 확인 부탁드리겠습니다.",
  // 상담신청 클릭 시 뜨는 개인정보 동의 팝업
  consentModalTitle: "개인정보 수집·이용 동의",
  consentModalBody:
    "• 수집항목 : 이름, 연락처\n• 수집목적 : 회생 및 파산 진행 가능 여부 파악 및 상담\n• 보유기간 : 수집일로부터 1년 (목적 달성 후 파기)\n\n위 내용을 확인하였으며, 개인정보 수집·이용에 동의합니다.",
  agreeText: "동의하고 상담 신청",
  cancelText: "취소",
};

// ── 푸터 (법무법인 에이파트 정보) ─────────────────────────
export const footer = {
  brand1: "법무법인 에이파트",
  brand2: "회생파산센터",
  lawyers:
    "대표변호사 김훈찬 | 광고책임변호사 김훈찬 | 회생파산센터장 변호사 유익상",
  bizNo: "사업자등록번호 765-86-02259",
  addresses: [
    "회생파산센터  서울특별시 송파구 백제고분로 365, 9층 법무법인 에이파트 (석촌동, 태문빌딩)",
    "법무법인 에이파트 본사  서울특별시 송파구 송파대로 425, 5층 (석촌동, 문화빌딩)",
  ],
  hours: "업무시간 평일 10:00~18:00 (야간 및 주말 상담 별도 문의)",
  phoneLabel: "전화상담",
  phone: "02.421.0508",
  phoneNote: "(주중 10시~18시)",
  blocks: [
    { icon: "memo", label: "365일 24시간", title: "상담신청서 접수" },
    { icon: "person", label: "주중 10시 ~ 18시", title: "02.421.0508" },
  ],
};

// ── 11. 유튜브 섹션 (썸네일 12칸 캐러셀) ──────────────────
export const youtube = {
  headerImage: "/youtube_text.png", // "생생한 법률정보를 youtube에서 만나보세요"
  headerImageWidth: 426,
  headerImageHeight: 128,
  body: "어려운 개인회생 전문 지식을\n보다 쉽게 설명해 드립니다",
  // 썸네일 10장 (youtube1.png ~ youtube10.png) + 클릭 시 이동할 유튜브 영상 링크
  thumbs: [
    { src: "/youtube1.png", href: "https://www.youtube.com/watch?v=ge6xr6D6y7M" },
    { src: "/youtube2.png", href: "https://www.youtube.com/watch?v=jdAZs79D4eU" },
    { src: "/youtube3.png", href: "https://www.youtube.com/watch?v=yCWBDJ9-zrw" },
    { src: "/youtube4.png", href: "https://www.youtube.com/watch?v=G3sxSXsdfh8" },
    { src: "/youtube5.png", href: "https://www.youtube.com/watch?v=SAPg3hau_FY" },
    { src: "/youtube6.png", href: "https://www.youtube.com/watch?v=5OK84CqEiZU" },
    { src: "/youtube7.png", href: "https://www.youtube.com/watch?v=GOT4Pr2cxrw" },
    { src: "/youtube8.png", href: "https://www.youtube.com/watch?v=kHGwtYVzjhg" },
    { src: "/youtube9.png", href: "https://www.youtube.com/watch?v=ASQISuu34To" },
    { src: "/youtube10.png", href: "https://www.youtube.com/watch?v=zhbz7U9-qn4" },
  ],
  channelText: "유튜브 채널",
  channelUrl: "#", // ★ 실제 유튜브 채널 주소로 교체
};
