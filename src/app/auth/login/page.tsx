"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { login } from "./actions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormType, loginSchema } from "@/schemas/auth";
import { useMutation } from "@tanstack/react-query";

// 로그인 버튼 컴포넌트
function LoginButton({ isLoading }: { isLoading: boolean }) {
  return (
    <button
      className={styles.button}
      type="submit"
      disabled={isLoading}
    >
      {isLoading ? "로그인 중..." : "로그인"}
    </button>
  );
}

export default function LoginPage() {
  const router = useRouter();

  // React Hook Form 설정
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  // TanStack Query를 사용한 로그인 mutation
  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (result) => {
      if (result.success) {
        router.push("/");
      }
    },
  });

  // 폼 제출 처리
  const onSubmit = (data: LoginFormType) => {
    loginMutation.reset();
    loginMutation.mutate(data);
  };

  // 에러 메시지
  const errorMessage =
    loginMutation.data?.error ||
    (loginMutation.isError ? "로그인 중 오류가 발생했습니다." : null);

  return (
    <div className={styles.container}>
      <div className={styles.formBox}>
        <h2 className={styles.title}>로그인</h2>

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
              placeholder="아이디를 입력하세요."
              className={styles.input}
              disabled={loginMutation.isPending}
            />
            {errors.userId && (
              <div className={styles.fieldError}>
                <p>{errors.userId.message}</p>
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
              placeholder="비밀번호를 입력하세요."
              className={styles.input}
              disabled={loginMutation.isPending}
            />
            {errors.userPw && (
              <div className={styles.fieldError}>
                <p>{errors.userPw.message}</p>
              </div>
            )}
          </div>

          <LoginButton isLoading={loginMutation.isPending} />
        </form>

        <div className={styles.footer}>
          <p className={styles.footerText}>
            계정이 없으신가요?{" "}
            <Link
              href="/auth/signup"
              className={styles.link}
            >
              계정 만들기
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
