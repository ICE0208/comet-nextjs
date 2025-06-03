"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// 사용자 정보 타입 정의
export type User = {
  id: number;
  userId: string;
  // 필요한 다른 사용자 정보 필드
};

/**
 * 로그인 상태 확인 및 관리를 위한 커스텀 훅
 * @param {boolean} requireAuth - 인증이 필요한지 여부 (true일 경우 로그인되지 않으면 리다이렉트)
 * @param {string} redirectTo - 로그인되지 않았을 때 리다이렉트할 경로
 * @returns 로그인 상태, 로딩 상태, 사용자 정보, 로그아웃 함수
 */
export function useAuth(requireAuth = false, redirectTo = "/auth/login") {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    async function checkAuthStatus() {
      try {
        setIsLoading(true);
        // 새로 만든 API 엔드포인트를 통해 인증 상태 확인
        const response = await fetch("/api/user_client");

        if (!response.ok) {
          throw new Error("인증 상태 확인 실패");
        }

        const data = await response.json();

        // 로그인 상태와 사용자 정보가 모두 있는지 확인
        if (data && data.isLoggedIn === true && data.user) {
          // 사용자 정보가 있으면 로그인 상태
          setUser(data.user);
          setIsLoggedIn(true);
        } else {
          // 사용자 정보가 없으면 로그아웃 상태
          setUser(null);
          setIsLoggedIn(false);

          // 인증이 필요한 페이지에서 로그인되지 않았으면 리다이렉트
          if (requireAuth) {
            // 현재 경로를 저장하여 로그인 후 돌아올 수 있도록 함
            const returnUrl = encodeURIComponent(window.location.pathname);
            router.push(`${redirectTo}?returnUrl=${returnUrl}`);
          }
        }
      } catch (error) {
        console.error("인증 확인 오류:", error);
        setUser(null);
        setIsLoggedIn(false);

        if (requireAuth) {
          const returnUrl = encodeURIComponent(window.location.pathname);
          router.push(`${redirectTo}?returnUrl=${returnUrl}`);
        }
      } finally {
        setIsLoading(false);
      }
    }

    checkAuthStatus();
  }, [requireAuth, redirectTo, router]);

  return {
    user,
    isLoggedIn,
    isLoading,
  };
}
