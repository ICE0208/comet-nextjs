"use client";

import Link from "next/link";
import styles from "./page.module.css";
import { signup } from "./actions";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupFormType, signupSchema } from "@/schemas/auth";
import { useMutation } from "@tanstack/react-query";

// 회원가입 버튼 컴포넌트
function SignupButton({ isLoading }: { isLoading: boolean }) {
  return (
    <button
      className={styles.button}
      type="submit"
      disabled={isLoading}
    >
      {isLoading ? "가입 중..." : "가입하기"}
    </button>
  );
}

export default function SignupPage() {
  const router = useRouter();

  // React Hook Form 설정 (공유 스키마 사용)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormType>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
  });

  // TanStack Query를 사용한 회원가입 mutation
  const signupMutation = useMutation({
    mutationFn: signup,
    onSuccess: (result) => {
      if (result.success) {
        // 성공 메시지 표시 후 확인 시 로그인 페이지로 이동
        alert("회원가입이 성공적으로 완료되었습니다!");
        router.push("/auth/login");
      }
    },
  });

  // 폼 제출 처리
  const onSubmit = (data: SignupFormType) => {
    signupMutation.reset();
    signupMutation.mutate(data);
  };

  // 에러 메시지
  const errorMessage =
    signupMutation.data?.error ||
    (signupMutation.isError ? "회원가입 중 오류가 발생했습니다." : null);

  return (
    <div className={styles.container}>
      <div className={styles.formBox}>
        <h2 className={styles.title}>계정 만들기</h2>

        <form
          className={styles.form}
          onSubmit={handleSubmit(onSubmit)}
        >
          {errorMessage && (
            <div className={styles.errorMessage}>
              <p>{errorMessage}</p>
            </div>
          )}

          <div className={styles.inputGroup}>
            <label
              htmlFor="userId"
              className={styles.label}
            >
              아이디
            </label>
            <input
              id="userId"
              {...register("userId")}
              type="text"
              placeholder="사용할 아이디를 입력하세요"
              className={styles.input}
              disabled={signupMutation.isPending}
            />
            {errors.userId && (
              <div className={styles.fieldError}>
                <p>{errors.userId.message}</p>
              </div>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label
              htmlFor="userEmail"
              className={styles.label}
            >
              이메일
            </label>
            <input
              id="userEmail"
              {...register("email")}
              type="email"
              placeholder="이메일을 입력하세요"
              className={styles.input}
              disabled={signupMutation.isPending}
            />
            {errors.email && (
              <div className={styles.fieldError}>
                <p>{errors.email.message}</p>
              </div>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label
              htmlFor="userPw"
              className={styles.label}
            >
              비밀번호
            </label>
            <input
              id="userPw"
              {...register("userPw")}
              type="password"
              placeholder="비밀번호를 입력하세요"
              className={styles.input}
              disabled={signupMutation.isPending}
            />
            {errors.userPw && (
              <div className={styles.fieldError}>
                <p>{errors.userPw.message}</p>
              </div>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label
              htmlFor="userPwConfirm"
              className={styles.label}
            >
              비밀번호 확인
            </label>
            <input
              id="userPwConfirm"
              {...register("userPwConfirm")}
              type="password"
              placeholder="비밀번호를 다시 입력하세요"
              className={styles.input}
              disabled={signupMutation.isPending}
            />
            {errors.userPwConfirm && (
              <div className={styles.fieldError}>
                <p>{errors.userPwConfirm.message}</p>
              </div>
            )}
          </div>

          <SignupButton isLoading={signupMutation.isPending} />
        </form>

        <div className={styles.footer}>
          <p className={styles.footerText}>
            이미 계정이 있으신가요?{" "}
            <Link
              href="/auth/login"
              className={styles.link}
            >
              로그인하기
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
