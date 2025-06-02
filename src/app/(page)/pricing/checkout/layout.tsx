import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "결제",
  description: "COMET PRO 구독 결제를 완료하고 프리미엄 기능을 이용하세요.",
  keywords: ["결제", "구독", "COMET PRO", "결제 페이지"],
  openGraph: {
    title: "결제 | Comet",
    description: "COMET PRO 구독 결제를 완료하고 프리미엄 기능을 이용하세요.",
    type: "website",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
