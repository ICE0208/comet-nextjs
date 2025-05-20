"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { signupSchema, SignupFormType } from "@/schemas/auth";

// 회원가입 결과 타입 정의
export type SignupResult = {
  success: boolean;
  error?: string;
};

export async function signup(data: SignupFormType): Promise<SignupResult> {
  // Zod 스키마로 데이터 검증
  const validated = signupSchema.safeParse(data);

  // Zod 타입 검증 실패했을 경우 에러와 함께 실패 반환
  if (!validated.success) {
    return {
      success: false,
      error: "입력 정보가 올바르지 않습니다.",
    };
  }

  const { userId, userPw, email } = validated.data;

  try {
    // 사용자 중복 확인
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ userId }, { email }],
      },
    });

    if (existingUser) {
      if (existingUser.userId === userId) {
        return {
          success: false,
          error: "이미 사용 중인 아이디입니다",
        };
      } else {
        return {
          success: false,
          error: "이미 등록된 이메일입니다",
        };
      }
    }

    // 비밀번호 해시화
    const hashPassword = await bcrypt.hash(userPw, 10);

    // DB에 사용자 정보 저장
    await prisma.user.create({
      data: {
        userId,
        email,
        hashPassword,
      },
    });

    // 성공 응답
    return {
      success: true,
    };
  } catch {
    return {
      success: false,
      error: "회원가입 중 오류가 발생했습니다. 다시 시도해주세요.",
    };
  }
}
