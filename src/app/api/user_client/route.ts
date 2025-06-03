import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import prisma from "@/lib/prisma";

/**
 * 클라이언트 측에서 호출하기 위한 사용자 인증 상태 확인 API
 * - 토큰 검증 및 사용자 정보 반환
 */
export async function GET() {
  try {
    // 쿠키에서 토큰 가져오기
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    // 토큰이 없으면 인증되지 않은 상태
    if (!token) {
      return NextResponse.json(
        { isLoggedIn: false, user: null },
        { status: 200 }
      );
    }

    // 토큰 검증
    const tokenData = await verifyToken(token);
    if (!tokenData || !tokenData.id) {
      return NextResponse.json(
        { isLoggedIn: false, user: null },
        { status: 200 }
      );
    }

    // 사용자 정보 조회
    const user = await prisma.user.findUnique({
      where: { id: tokenData.id },
      select: {
        id: true,
        userId: true,
        isTutorial: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { isLoggedIn: false, user: null },
        { status: 200 }
      );
    }

    // 사용자 정보 반환
    return NextResponse.json({
      isLoggedIn: true,
      user,
    });
  } catch (error) {
    console.error("사용자 인증 확인 오류:", error);
    return NextResponse.json(
      {
        isLoggedIn: false,
        user: null,
        error: "인증 처리 중 오류가 발생했습니다",
      },
      { status: 500 }
    );
  }
}
