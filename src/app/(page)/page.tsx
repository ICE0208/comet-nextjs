import type { Metadata } from "next";
import IntroSection from "@/components/main-page/IntroSection";
import MainImage from "@/components/main-page/MainImage";

export const metadata: Metadata = {
  title: "홈",
  description:
    "창작의 빛나는 순간을 함께하세요. Comet에서 당신만의 이야기를 발견하고, 새로운 세계로 떠나는 여정을 시작하세요.",
  keywords: [
    "소설 창작",
    "웹소설 플랫폼",
    "AI 창작 도구",
    "이야기 창작",
    "소설가",
    "창작 도구",
  ],
  openGraph: {
    title: "Comet | 소설의 별, 당신의 이야기를 세상에",
    description:
      "창작의 빛나는 순간을 함께하세요. Comet에서 당신만의 이야기를 발견하고, 새로운 세계로 떠나는 여정을 시작하세요.",
    type: "website",
    images: [
      {
        url: "/images/main-og.png",
        width: 1200,
        height: 630,
        alt: "Comet 메인 페이지",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Comet | 소설의 별, 당신의 이야기를 세상에",
    description: "창작의 빛나는 순간을 함께하세요.",
    images: ["/images/main-og.png"],
  },
};

const Home = () => (
  <main>
    <MainImage />
    <IntroSection />
  </main>
);
export default Home;
