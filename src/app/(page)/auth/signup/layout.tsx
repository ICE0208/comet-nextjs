import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "회원가입",
  description:
    "Comet에 가입하여 AI와 함께 소설 창작을 시작하세요. 무료로 시작할 수 있습니다.",
  keywords: ["회원가입", "계정 만들기", "가입", "Comet", "소설 창작"],
  openGraph: {
    title: "회원가입 | Comet",
    description: "Comet에 가입하여 AI와 함께 소설 창작을 시작하세요.",
    type: "website",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function SignupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
