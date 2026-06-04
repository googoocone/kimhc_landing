import Image from "next/image";

/* ============================================================
   이미지 자리(placeholder) 컴포넌트
   - src 가 비어 있으면: 회색 점선 박스 + 안내 라벨을 보여줍니다.
   - src 에 경로를 넣으면: 실제 이미지를 보여줍니다.

   ▶ 이미지 넣는 법:
     1) 이미지 파일을 프로젝트의 /public 폴더에 복사
        예) public/lawyer.jpg
     2) 해당 자리의 src 를 "/lawyer.jpg" 로 적기 (앞에 / 필수)
   ============================================================ */

type Props = {
  /** 채울 이미지 경로. 예: "/hero.jpg" (public 폴더 기준). 비우면 안내 박스 표시 */
  src?: string;
  /** 무엇이 들어갈 자리인지 설명 (안내 라벨에 표시) */
  label: string;
  /** 권장 가로 px */
  width: number;
  /** 권장 세로 px */
  height: number;
  /** 모서리 둥글기 */
  rounded?: boolean;
  className?: string;
};

export default function ImageSlot({
  src,
  label,
  width,
  height,
  rounded = true,
  className = "",
}: Props) {
  const radius = rounded ? "rounded-xl" : "";

  if (src) {
    return (
      <Image
        src={src}
        alt={label}
        width={width}
        height={height}
        className={`h-auto w-full object-cover ${radius} ${className}`}
      />
    );
  }

  return (
    <div
      className={`flex w-full flex-col items-center justify-center border-2 border-dashed border-gray-300 bg-gray-50 text-center ${radius} ${className}`}
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      <span className="px-4 text-sm font-medium text-gray-500">
        🖼 {label}
      </span>
      <span className="mt-1 text-xs text-gray-400">
        권장 {width} × {height}px
      </span>
    </div>
  );
}
