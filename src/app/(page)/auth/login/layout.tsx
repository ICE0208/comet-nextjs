import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "로그인",
  description: "Comet 계정으로 로그인하여 AI와 함께 소설을 창작하세요.",
  keywords: ["로그인", "계정", "Comet", "소설 창작"],
  openGraph: {
    title: "로그인 | Comet",
    description: "Comet 계정으로 로그인하여 AI와 함께 소설을 창작하세요.",
    type: "website",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
