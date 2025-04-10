import { z } from "zod";

// 로그인 스키마
export const loginSchema = z.object({
  userId: z.string().min(1, { message: "아이디를 입력해주세요." }),
  userPw: z.string().min(1, { message: "비밀번호를 입력해주세요." }),
});

// 회원가입 스키마
export const signupSchema = z
  .object({
    userId: z
      .string()
      .min(4, { message: "아이디는 최소 4자 이상이어야 합니다" }),
    email: z.string().email("유효한 이메일 주소를 입력해주세요"),
    userPw: z
      .string()
      .min(6, { message: "비밀번호는 최소 6자 이상이어야 합니다" }),
    userPwConfirm: z.string(),
  })
  .refine((data) => data.userPw === data.userPwConfirm, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["userPwConfirm"],
  });

// 타입 내보내기
export type LoginFormType = z.infer<typeof loginSchema>;
export type SignupFormType = z.infer<typeof signupSchema>;
