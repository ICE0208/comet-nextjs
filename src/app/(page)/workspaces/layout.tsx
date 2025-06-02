import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "나의 작업공간",
  description:
    "나만의 창작 공간에서 소설을 쓰고 관리하세요. AI와 함께 새로운 이야기를 만들어보세요.",
  keywords: [
    "작업공간",
    "워크스페이스",
    "소설 창작",
    "AI 창작",
    "글쓰기",
    "스토리",
  ],
  openGraph: {
    title: "나의 작업공간 | Comet",
    description:
      "나만의 창작 공간에서 소설을 쓰고 관리하세요. AI와 함께 새로운 이야기를 만들어보세요.",
    type: "website",
    images: [
      {
        url: "/images/workspaces-og.png",
        width: 1200,
        height: 630,
        alt: "Comet 작업공간",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "나의 작업공간 | Comet",
    description: "나만의 창작 공간에서 소설을 쓰고 관리하세요.",
    images: ["/images/workspaces-og.png"],
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function WorkspacesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
