import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "인증",
  description: "Comet에 로그인하거나 새 계정을 만들어 소설 창작을 시작하세요.",
  keywords: ["로그인", "회원가입", "계정", "인증", "Comet"],
  openGraph: {
    title: "로그인 · 회원가입 | Comet",
    description:
      "Comet에 로그인하거나 새 계정을 만들어 소설 창작을 시작하세요.",
    type: "website",
    images: [
      {
        url: "/images/auth-og.png",
        width: 1200,
        height: 630,
        alt: "Comet 로그인",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "로그인 · 회원가입 | Comet",
    description:
      "Comet에 로그인하거나 새 계정을 만들어 소설 창작을 시작하세요.",
    images: ["/images/auth-og.png"],
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
