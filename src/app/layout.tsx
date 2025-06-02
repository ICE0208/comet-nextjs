import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Comet | 소설의 별, 당신의 이야기를 세상에",
    template: "%s | Comet",
  },
  description:
    "창작의 빛나는 순간을 함께하세요. Comet에서 당신만의 이야기를 발견하고, 새로운 세계로 떠나는 여정을 시작하세요.",
  keywords: [
    "소설",
    "창작",
    "웹소설",
    "AI",
    "스토리",
    "글쓰기",
    "작가",
    "플랫폼",
  ],
  authors: [{ name: "Comet Team" }],
  creator: "Comet",
  publisher: "Comet",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_URL || "https://comet-nextjs.vercel.app"
  ),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "/",
    title: "Comet | 소설의 별, 당신의 이야기를 세상에",
    description:
      "창작의 빛나는 순간을 함께하세요. Comet에서 당신만의 이야기를 발견하고, 새로운 세계로 떠나는 여정을 시작하세요.",
    siteName: "Comet",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Comet - 소설의 별",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Comet | 소설의 별, 당신의 이야기를 세상에",
    description:
      "창작의 빛나는 순간을 함께하세요. Comet에서 당신만의 이야기를 발견하고, 새로운 세계로 떠나는 여정을 시작하세요.",
    images: ["/images/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
  category: "entertainment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
