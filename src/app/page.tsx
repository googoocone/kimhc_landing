import { Fragment } from "react";
import Image from "next/image";
import DiffCard from "@/components/DiffCard";
import DocGallery from "@/components/DocGallery";
import CompareCards from "@/components/CompareCards";
import StickyConsultBar from "@/components/StickyConsultBar";
import YoutubeCarousel from "@/components/YoutubeCarousel";
import CountUp from "@/components/CountUp";
import WorriesAccordion from "@/components/WorriesAccordion";
import Highlight from "@/components/Highlight";
import StructuredData from "@/components/StructuredData";
import {
  topBar,
  worries,
  lawyerIntro,
  differentiators,
  correction,
  chat,
  assetDefense,
  fee,
  reviews,
  youtube,
  contact,
  footer,
} from "@/lib/content";

// 차별점 카드 배경색 (Figma 정확한 HEX)
const diffCardBg = [
  "bg-[#EAF7FF]",
  "bg-[#EFFFE9]",
  "bg-[#FFF8DE]",
  "bg-[#FFF2E5]",
  "bg-[#EDEAFF]",
];

/* ============================================================
   법무법인 평안 랜딩페이지 — Figma 디자인대로 한 섹션씩 제작 중
   - 섹션 배경은 화면 전체(full-bleed), 안쪽 콘텐츠는 최대 1220px.
   - 모든 섹션은 반응형: PC(데스크탑) + 모바일 자동 대응 (mobile-first).
   ============================================================ */

// 콘텐츠 최대폭 1220px 가운데 정렬 래퍼
function Wrap({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[1220px] px-5 sm:px-8 ${className}`}>
      {children}
    </div>
  );
}

// 모바일에서만 줄바꿈 (\n → <br className="sm:hidden">), 데스크탑은 한 줄
function MobileBreakText({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((part, i) => (
        <Fragment key={i}>
          {/* 데탑: 공백으로 이어짐 / 모바일: 줄바꿈 */}
          {i > 0 && (
            <>
              {" "}
              <br className="sm:hidden" />
            </>
          )}
          {part}
        </Fragment>
      ))}
    </>
  );
}

export default function Home() {
  return (
    <main className="w-full overflow-x-hidden bg-white pb-[100px] sm:pb-[110px]">
      {/* 검색엔진용: 페이지 대표 제목(h1) + 구조화 데이터 */}
      <h1 className="sr-only">
        개인회생 변호사 김훈찬 — 법무법인 에이파트 회생파산센터 (서울 송파)
      </h1>
      <StructuredData />

      {/* ───── 00. 최상단 띠배너 (전화 문의 CTA) ───── */}
      <div className="w-full bg-[#2b2b2b] text-white">
        <div className="mx-auto flex max-w-[1220px] items-center justify-between gap-3 px-4 py-2.5 sm:px-8 lg:justify-center lg:gap-5">
          <p className="text-left text-xs font-medium leading-snug sm:text-sm">
            {topBar.textBefore}{" "}
            <br className="lg:hidden" />
            <span className="font-bold text-white">{topBar.highlight}</span>
            {topBar.textAfter}
          </p>
          <a
            href={`tel:${topBar.phone}`}
            data-track="phone_call"
            data-track-meta='{"loc":"top_banner"}'
            className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#1e3a5f] px-3 py-1.5 text-xs font-bold text-white transition hover:bg-[#274b73] sm:px-4 sm:text-sm"
          >
            {topBar.buttonText}
            <span aria-hidden>›</span>
          </a>
        </div>
      </div>

      {/* ───── 01. 메인 영상 섹션 (full-bleed 자동재생 영상) ───── */}
      <section className="bg-white" data-section="01_hero_video">
        <video
          src="/video.mp4"
          className="h-auto w-full object-cover"
          style={{ aspectRatio: "1220 / 639" }}
          autoPlay
          loop
          muted
          playsInline
        />
      </section>

      {/* ───── 02. "걱정되는 부분" Q&A 섹션 ─────
          배경 stone-50 / 인트로 문구 + 큰 제목 + 01~04 질문 카드 */}
      <section className="bg-stone-50" data-section="02_worries">
        <Wrap className="py-16 sm:py-24">
          {/* 인트로 문구 */}
          <p className="whitespace-pre-line text-center leading-relaxed text-black">
            <span className="text-lg font-normal sm:text-2xl">
              {worries.introBefore}
            </span>
            <CountUp
              end={worries.introCount}
              suffix={worries.introCountSuffix}
              className="text-xl font-bold text-sky-950 sm:text-3xl"
            />
            <span className="text-lg font-normal sm:text-2xl">
              {worries.introAfter}
            </span>
          </p>

          {/* 큰 제목 */}
          <h2 className="mt-16 whitespace-pre-line text-center leading-tight sm:mt-24 sm:leading-[66px]">
            <span className="text-2xl font-bold text-sky-950 xs:text-3xl sm:text-5xl">
              {worries.headingBlue}
            </span>
            <span className="text-2xl font-normal text-black xs:text-3xl sm:text-5xl">
              {worries.headingRest}
            </span>
          </h2>

          {/* 01~04 질문 아코디언 (클릭 시 답변 펼침) */}
          <WorriesAccordion items={worries.items} />
        </Wrap>
      </section>

      {/* ───── 03. 대표 변호사 소개 섹션 ─────
          왼쪽: 인사말 텍스트 / 오른쪽: slate 카드 + 변호사 사진 + 네임 */}
      <section className="bg-white" data-section="03_lawyer_intro">
        <Wrap className="py-16 sm:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8">
            {/* 왼쪽 텍스트 */}
            <div>
              <h2 className="text-xl font-normal leading-snug text-black xs:text-2xl sm:text-4xl sm:leading-[52px]">
                <span>{lawyerIntro.headingBefore}</span>
                <span className="font-bold text-sky-950">
                  {lawyerIntro.headingHighlight}
                </span>
                <span>{lawyerIntro.headingMid}</span>
                {/* PC·모바일 모두 "분들이" 뒤에서 줄바꿈 */}
                <br />
                <span>{lawyerIntro.headingEnd1}</span>
                <span>{lawyerIntro.headingEnd2}</span>
              </h2>
              <p className="mt-8 whitespace-pre-line text-[15px] leading-6 text-black sm:text-base">
                {lawyerIntro.body}
              </p>
            </div>

            {/* 오른쪽 변호사 카드 */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative flex w-full max-w-[471px] items-end">
                {/* slate 배경 카드 (하단) */}
                <div className="absolute inset-x-0 bottom-0 h-48 rounded-[20px] bg-slate-700 sm:h-56" />
                {/* 변호사 사진 (앞, 하단 정렬) */}
                <Image
                  src={lawyerIntro.photo}
                  alt={`${lawyerIntro.role} ${lawyerIntro.name}`}
                  width={325}
                  height={545}
                  priority
                  className="relative z-10 h-[380px] w-auto sm:h-[545px]"
                />
                {/* 네임 라벨 */}
                <div className="absolute bottom-8 right-6 z-20 text-center text-white sm:bottom-10 sm:right-8">
                  <p className="text-sm font-light sm:text-base">
                    {lawyerIntro.role}
                  </p>
                  <p className="text-lg font-medium sm:text-xl">
                    {lawyerIntro.name}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Wrap>
      </section>

      {/* ───── 04. 김훈찬 변호사의 5가지 차별점 ─────
          위 2개 + 아래 3개 카드. 각 카드: 제목 + 설명 + 아이콘(우하단) */}
      <section className="bg-white" data-section="04_differentiators">
        <Wrap className="py-16 sm:py-24">
          {/* 세로 라인 + 작은 라벨 + 제목 */}
          <div className="mx-auto h-14 w-px bg-black" />
          <p className="mt-6 text-center text-base font-normal text-black">
            {differentiators.eyebrow}
          </p>
          <h2 className="mt-4 text-center text-xl font-medium text-black xs:text-2xl sm:text-[32px]">
            {differentiators.titleBefore}
            <span className="font-bold text-sky-950">
              {differentiators.titleHighlight}
            </span>
            {differentiators.titleAfter}
          </h2>

          {/* 카드 그룹 */}
          <div className="mt-12 flex flex-col items-center gap-6 sm:mt-16">
            {/* 위: 2개 */}
            <div className="flex w-full flex-col justify-center gap-6 sm:flex-row">
              {differentiators.items.slice(0, 2).map((c, i) => (
                <DiffCard
                  key={i}
                  index={i}
                  bg={diffCardBg[i]}
                  title={c.title}
                  desc={c.desc}
                  icon={c.icon}
                />
              ))}
            </div>
            {/* 아래: 3개 */}
            <div className="flex w-full flex-col justify-center gap-6 sm:flex-row">
              {differentiators.items.slice(2).map((c, i) => (
                <DiffCard
                  key={i}
                  index={i + 2}
                  bg={diffCardBg[i + 2]}
                  title={c.title}
                  desc={c.desc}
                  icon={c.icon}
                />
              ))}
            </div>
          </div>
        </Wrap>
      </section>

      {/* ───── 05. 보정 대응 섹션 ─────
          제목 + 본문(형광펜 강조) + 의견서/보정서 이미지 4장 */}
      <section className="bg-white" data-section="05_correction">
        <Wrap className="py-16 sm:py-24">
          {/* 제목 (모바일: 번호 위로 + "보정 대응이" 뒤 줄바꿈) */}
          <h2 className="text-center text-2xl font-medium leading-tight text-black xs:text-3xl sm:text-5xl">
            <span className="mb-2 block font-bold text-sky-950 sm:mb-0 sm:inline">
              {correction.no}
            </span>
            {correction.titleA}
            <br className="sm:hidden" />
            {correction.titleB}
          </h2>

          {/* 본문 문단들 (문단 사이 한 줄 띄움) */}
          {correction.paragraphs.map((t, i) => (
            <p
              key={i}
              className={`text-center text-lg leading-relaxed text-black/80 sm:text-2xl ${
                i === 0 ? "mt-10 sm:mt-14" : "mt-6"
              }`}
            >
              <MobileBreakText text={t} />
            </p>
          ))}
          {/* 마지막 문단 (형광펜 강조) */}
          <p className="mt-6 text-center text-lg leading-relaxed text-black/80 sm:text-2xl">
            <Highlight color="rgba(139,92,246,0.5)">
              {correction.body2Highlight}
            </Highlight>
            {correction.body2After}
          </p>

          {/* 의견서/보정서 이미지 4장 (클릭 시 확대) */}
          <DocGallery docs={correction.docs} />
        </Wrap>
      </section>

      {/* ───── 06. 1:1 전담 담당자 배정 섹션 ─────
          제목 + 본문(파란 형광펜) + 카톡 캡처 슬라이드 */}
      <section className="bg-white" data-section="06_chat">
        <Wrap className="py-16 sm:py-24">
          {/* 제목 */}
          <h2 className="text-center text-2xl font-medium leading-tight text-black xs:text-3xl sm:text-5xl">
            <span className="mb-2 block font-bold text-sky-950 sm:mb-0 sm:inline">
              {chat.no}
            </span>
            {chat.title}
          </h2>

          {/* 본문 */}
          <p className="mt-10 text-center text-lg leading-relaxed text-black/80 sm:mt-14 sm:text-2xl">
            {chat.body1}
          </p>
          <p className="mt-6 text-center text-lg leading-relaxed text-black/80 sm:text-2xl">
            <Highlight color="rgba(96,165,250,0.5)">
              {chat.body2Highlight}
            </Highlight>
            {chat.body2After1}
            <br className="sm:hidden" />{" "}
            {chat.body2After2}
          </p>

          {/* 카톡 캡처 지그재그 배치 (클릭 시 확대) */}
          <DocGallery
            docs={chat.images}
            width={300}
            height={736}
            label="상담 채팅 화면"
            variant="zigzag"
          />
        </Wrap>
      </section>

      {/* ───── 07. 의뢰인 재산방어 시스템 섹션 ─────
          제목 + 본문(노란 형광펜) + 가로 배너 이미지 */}
      <section className="bg-white" data-section="07_asset_defense">
        <Wrap className="py-16 sm:py-24">
          {/* 제목 */}
          <h2 className="text-center text-2xl font-medium leading-tight text-black xs:text-3xl sm:text-5xl">
            <span className="mb-2 block font-bold text-sky-950 sm:mb-0 sm:inline">
              {assetDefense.no}
            </span>
            {assetDefense.title}
          </h2>

          {/* 본문 (한 줄, "변제금은 달라집니다."에 노란 형광펜) */}
          <p className="mt-10 text-center text-lg leading-relaxed text-black/80 sm:mt-14 sm:text-2xl">
            {assetDefense.body1}
            <Highlight color="rgba(252,211,77,0.5)">
              {assetDefense.bodyUnderline}
            </Highlight>
          </p>

          {/* 재산방어 비교 카드 (코드로 구현) */}
          <CompareCards
            left={assetDefense.compare.left}
            right={assetDefense.compare.right}
          />
        </Wrap>
      </section>

      {/* ───── 08. 변호사 수임료 섹션 ─────
          제목 + 본문 + 표(코드) + ※ 안내박스(코드, ①②③ 동그라미) */}
      <section className="bg-white" data-section="08_fee">
        <Wrap className="py-16 sm:py-24">
          {/* 제목 ("합리적인" 뒤 줄바꿈) */}
          <h2 className="text-center text-2xl font-medium leading-tight text-black xs:text-3xl sm:text-5xl">
            <span className="mb-2 block font-bold text-sky-950 sm:mb-0 sm:inline">
              {fee.no}
            </span>
            {fee.titleA}
            <br />
            {fee.titleB}
          </h2>

          {/* 본문 (문단 사이 한 줄 띄움 / 본문 내 줄바꿈은 모바일만) */}
          <p className="mt-10 text-center text-lg leading-relaxed text-black/80 sm:mt-14 sm:text-2xl">
            <MobileBreakText text={fee.body1} />
          </p>
          <p className="mt-6 text-center text-lg leading-relaxed text-black/80 sm:text-2xl">
            {fee.body2}
          </p>

          {/* 수임료 표 */}
          <div className="mx-auto mt-12 max-w-[1045px] overflow-hidden rounded-[10px] border border-black/10 sm:mt-16">
            <div className="grid grid-cols-[37%_63%]">
              {/* 헤더 */}
              <div className="flex items-center justify-center bg-slate-700 px-4 py-5 text-center text-xl font-medium text-white sm:text-3xl lg:text-4xl">
                {fee.headers[0]}
              </div>
              <div className="flex items-center justify-center border-l border-white/20 bg-slate-700 px-4 py-5 text-center text-xl font-medium text-white sm:text-3xl lg:text-4xl">
                {fee.headers[1]}
              </div>
              {/* 데이터 행 */}
              {fee.rows.map((r, i) => (
                <Fragment key={i}>
                  <div className="flex items-center justify-center border-t border-black/10 bg-white px-4 py-7 text-center text-base font-medium text-black sm:py-9 sm:text-2xl lg:text-4xl">
                    {r[0]}
                  </div>
                  <div className="flex items-center justify-center border-l border-t border-black/10 bg-white px-4 py-7 text-center text-base font-medium text-black sm:py-9 sm:text-2xl lg:text-4xl">
                    {r[1]}
                  </div>
                </Fragment>
              ))}
            </div>
          </div>

          {/* ※ 안내박스 (CSS로 ①②③ 동그라미) */}
          <div className="mx-auto mt-5 max-w-[1045px] rounded-[10px] border border-black/10 bg-slate-50 px-6 py-6 sm:px-9 sm:py-7">
            <p className="text-sm leading-7 text-black/70 sm:text-base sm:leading-8">
              <span className="font-semibold text-black/80">
                ※ {fee.noteIntro}{" "}
              </span>
              {fee.notePoints.map((pt, i) => (
                <span key={i}>
                  <span className="mx-0.5 inline-flex size-5 translate-y-0.5 items-center justify-center rounded-full bg-sky-900 text-[11px] font-bold text-white">
                    {i + 1}
                  </span>{" "}
                  {pt}{" "}
                </span>
              ))}
              {fee.noteOutro}
            </p>
          </div>
        </Wrap>
      </section>

      {/* ───── 09. 자필 후기 섹션 (가로 무한 스크롤) ─────
          제목 + 본문(1220 안) + 화면 전체 marquee */}
      <section className="bg-neutral-100/50" data-section="09_reviews">
        <Wrap className="pt-16 sm:pt-24">
          {/* 제목 */}
          <h2 className="text-center text-2xl font-normal leading-tight text-black xs:text-3xl sm:text-5xl sm:leading-[64px]">
            {reviews.titleNormal}
            <br />
            <span className="font-semibold text-sky-950">{reviews.titleBold}</span>
          </h2>
          {/* 본문 */}
          <p className="mt-8 whitespace-pre-line text-center text-lg leading-relaxed text-black/80 sm:mt-10 sm:text-2xl">
            {reviews.body}
          </p>
        </Wrap>

        {/* 가로 무한 스크롤 marquee (화면 전체, 왼쪽으로 흐름 / 마우스 올리면 멈춤) */}
        <div className="mt-12 w-full overflow-hidden pb-16 sm:mt-16 sm:pb-24">
          <div className="marquee-track flex w-max">
            {[0, 1].map((n) => (
              <a
                key={n}
                href={reviews.reviewUrl}
                target="_blank"
                rel="noreferrer"
                aria-hidden={n === 1}
                aria-label="의뢰인 자필 후기 전체 보기"
                data-track="review_image"
                className="block cursor-pointer"
              >
                <Image
                  src={reviews.image}
                  alt={n === 0 ? "의뢰인 자필 후기 모음" : ""}
                  aria-hidden={n === 1}
                  width={reviews.imageWidth}
                  height={reviews.imageHeight}
                  className="h-[240px] w-auto max-w-none sm:h-[400px]"
                  priority={false}
                />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ───── 11. 유튜브 섹션 (썸네일 12칸 캐러셀) ───── */}
      <section className="bg-white" data-section="10_youtube">
        <Wrap className="py-16 sm:py-24">
          {/* 상단 텍스트 이미지 */}
          <div className="flex justify-center">
            <Image
              src={youtube.headerImage}
              alt="생생한 법률정보를 유튜브에서 만나보세요"
              width={youtube.headerImageWidth}
              height={youtube.headerImageHeight}
              className="h-auto w-[300px] sm:w-[426px]"
            />
          </div>
          {/* 본문 */}
          <p className="mt-8 whitespace-pre-line text-center text-lg leading-relaxed text-black/80 sm:text-2xl">
            {youtube.body}
          </p>
          {/* 썸네일 캐러셀 */}
          <div className="mt-12 sm:mt-16">
            <YoutubeCarousel thumbs={youtube.thumbs} />
          </div>
          {/* 유튜브 채널 버튼 */}
          <div className="mt-10 flex justify-center">
            <a
              href={youtube.channelUrl}
              target="_blank"
              rel="noreferrer"
              data-track="youtube_channel"
              className="rounded-[10px] bg-red-600 px-10 py-3.5 text-xl font-medium text-white transition hover:bg-red-700"
            >
              {youtube.channelText}
            </a>
          </div>
        </Wrap>
      </section>

      {/* ───── 푸터 (법무법인 에이파트 정보) ───── */}
      <footer id="contact" className="bg-[#2b2b2b] text-white/65">
        <Wrap className="py-12 sm:py-14">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
            {/* 좌: 브랜드 */}
            <div className="shrink-0">
              <p className="text-xl font-bold text-amber-500">
                {footer.brand1}
              </p>
              <p className="text-xl font-bold tracking-[0.25em] text-amber-500">
                {footer.brand2}
              </p>
            </div>

            {/* 중: 회사 정보 */}
            <div className="flex-1 lg:px-4">
              <p className="text-sm font-semibold text-white/90 sm:text-[15px]">
                {footer.lawyers}
              </p>
              <p className="mt-1 text-sm font-semibold text-white/90 sm:text-[15px]">
                {footer.bizNo}
              </p>
              <div className="mt-5 space-y-1.5 text-xs leading-relaxed text-white/50 sm:text-[13px]">
                {footer.addresses.map((addr, i) => (
                  <p key={i}>{addr}</p>
                ))}
                <p>{footer.hours}</p>
              </div>
            </div>

            {/* 우: 아이콘 블록 2개 */}
            <div className="flex shrink-0 gap-10">
              {footer.blocks.map((b, i) => (
                <div key={i} className="text-center">
                  <div className="flex justify-center text-white/80">
                    {b.icon === "memo" ? (
                      <svg
                        width="34"
                        height="34"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        <path d="m12 7 4 4" />
                        <path d="m8 13 5-5 2 2-5 5H8z" />
                      </svg>
                    ) : (
                      <svg
                        width="34"
                        height="34"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="8" r="4" />
                        <path d="M4 21a8 8 0 0 1 16 0" />
                      </svg>
                    )}
                  </div>
                  <p className="mt-3 text-xs text-white/55">{b.label}</p>
                  <p className="mt-1 text-xl font-bold text-amber-500">
                    {b.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Wrap>
      </footer>

      {/* ───── 하단 고정 상담 바 (스크롤해도 따라옴) ───── */}
      <StickyConsultBar
        phoneLabel={contact.barPhoneLabel}
        phone={contact.phone}
        categoryLabel={contact.categoryLabel}
        categories={contact.categories}
        submitText="상담신청"
        consentTitle={contact.consentModalTitle}
        consentBody={contact.consentModalBody}
        agreeText={contact.agreeText}
        cancelText={contact.cancelText}
      />
    </main>
  );
}
