import { site, worries } from "@/lib/content";

/* 검색엔진용 구조화 데이터(JSON-LD)
   - LegalService/Attorney: 개인회생 전문 변호사 사무소임을 명확히 알림 (지역/연락처/업무시간)
   - FAQPage: 걱정 Q&A → 검색결과 리치스니펫 후보 */
export default function StructuredData() {
  const legalService = {
    "@context": "https://schema.org",
    "@type": ["LegalService", "Attorney"],
    name: site.name,
    description: site.description,
    url: site.url,
    telephone: site.telephone,
    image: `${site.url}${site.ogImage}`,
    priceRange: "₩₩",
    areaServed: { "@type": "AdministrativeArea", name: "대한민국" },
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      addressCountry: site.address.country,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
        ],
        opens: "10:00",
        closes: "18:00",
      },
    ],
    founder: { "@type": "Person", name: "김훈찬", jobTitle: "대표변호사" },
    knowsAbout: ["개인회생", "개인파산", "면책", "채무조정", "법인회생"],
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: worries.items.map((it: { q: string; a: string }) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(legalService) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
      />
    </>
  );
}
