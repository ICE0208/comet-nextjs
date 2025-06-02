import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "프로필",
  description:
    "내 계정 정보와 사용 통계를 확인하세요. 토큰 사용량, 작업 히스토리, 계정 설정을 관리할 수 있습니다.",
  keywords: ["프로필", "계정", "사용 통계", "토큰", "히스토리", "설정"],
  openGraph: {
    title: "내 프로필 | Comet",
    description: "계정 정보와 사용 통계를 확인하고 관리하세요.",
    type: "website",
    images: [
      {
        url: "/images/profile-og.png",
        width: 1200,
        height: 630,
        alt: "Comet 프로필 페이지",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "내 프로필 | Comet",
    description: "계정 정보와 사용 통계를 확인하고 관리하세요.",
    images: ["/images/profile-og.png"],
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
