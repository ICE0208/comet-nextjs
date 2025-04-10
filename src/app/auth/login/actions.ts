"use server";

import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";
import { loginSchema, LoginFormType } from "@/schemas/auth";
import { generateToken } from "@/lib/jwt";

// 로그인 액션의 반환값
export type LoginResult = {
  success: boolean;
  error?: string;
};

export async function login(data: LoginFormType): Promise<LoginResult> {
  // Zod 스키마로 데이터 검증
  const validated = loginSchema.safeParse(data);
  // Zod 타입 검증 실패했을 경우 에러와 함께 실패반환
  if (!validated.success) {
    return {
      success: false,
      error: "입력 정보가 올바르지 않습니다.",
    };
  }

  const { userId, userPw } = validated.data;
  try {
    // ========== ID, PW 체크 ==========
    // 사용자 조회
    const user = await prisma.user.findUnique({ where: { userId } });

    // 사용자 없음 또는 비밀번호 불일치일 때 에러와 함께 실패반환
    if (!user || !(await bcrypt.compare(userPw, user.hashPassword))) {
      return {
        success: false,
        error: "아이디 또는 비밀번호가 일치하지 않습니다.",
      };
    }

    // ========== JWT 토큰 발급 ==========
    // JWT 토큰 생성
    const token = generateToken({
      id: user.id,
      userId: user.userId,
    });

    // 로그인 성공: 세션 쿠키와 JWT 토큰 설정
    const cookieStore = await cookies();

    cookieStore.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      // 영구 토큰이므로 만료일 설정하지 않음
    });

    // 성공 응답
    return {
      success: true,
    };
  } catch {
    return {
      success: false,
      error: "로그인 처리 중 오류가 발생했습니다.",
    };
  }
}
