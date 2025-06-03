import { NextResponse } from "next/server";
import Stripe from "stripe";

// Stripe 인스턴스 초기화
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

export async function POST(request: Request) {
  try {
    // 요청 본문에서 이메일 추출
    const { email } = await request.json();

    // 요청 헤더에서 host 정보 가져오기
    const host = request.headers.get("host");
    const protocol = request.headers.get("x-forwarded-proto") || "http";
    const baseUrl = `${protocol}://${host}`;
    // Stripe 결제 세션 생성
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription", // 일회성 결제가 아닌 구독 모드로 설정
      line_items: [
        {
          price_data: {
            currency: "krw",
            product_data: {
              name: "COMET PRO 구독",
              description: "월간 프리미엄 멤버십 - 고급 AI 기능 및 무제한 사용",
            },
            unit_amount: 19900, // 19,900원
            recurring: {
              interval: "month", // 월간 구독
            },
          },
          quantity: 1,
        },
      ],
      customer_email: email, // 고객 이메일 설정
      success_url: `${baseUrl}/pricing/success?subscription=success`,

      cancel_url: `${baseUrl}/pricing?subscription=canceled`,
      metadata: {
        // 필요한 경우 메타데이터 추가
        plan: "pro",
      },
    });

    // 세션 URL 반환
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe 세션 생성 오류:", error);
    return NextResponse.json(
      { error: "결제 세션 생성에 실패했습니다." },
      { status: 500 }
    );
  }
}
