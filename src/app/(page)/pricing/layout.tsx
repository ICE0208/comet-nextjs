import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "요금제",
  description:
    "COMET PRO 구독으로 더 강력한 AI 창작 도구를 경험하세요. 고급 AI 모델, 무제한 작업 생성, 우선 처리 기능을 제공합니다.",
  keywords: [
    "COMET PRO",
    "구독",
    "요금제",
    "프리미엄",
    "AI 창작",
    "소설 창작 도구",
    "웹소설",
  ],
  openGraph: {
    title: "COMET PRO 요금제 | Comet",
    description:
      "더 강력한 AI 창작 도구로 업그레이드하세요. 고급 AI 모델과 무제한 기능을 월 19,900원에 이용하실 수 있습니다.",
    type: "website",
    images: [
      {
        url: "/images/pricing-og.png",
        width: 1200,
        height: 630,
        alt: "COMET PRO 요금제",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "COMET PRO 요금제 | Comet",
    description: "더 강력한 AI 창작 도구로 업그레이드하세요.",
    images: ["/images/pricing-og.png"],
  },
};

export default function PricingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
