"use client";

import React, { useState } from "react";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";

const PricingPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { isLoggedIn, isLoading: authLoading } = useAuth();

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      // 로그인 상태 확인
      if (!isLoggedIn) {
        // 현재 경로를 저장하여 로그인 후 돌아올 수 있도록 함
        const returnUrl = encodeURIComponent("/pricing/checkout");
        router.push(`/auth/login?returnUrl=${returnUrl}`);
        return;
      }

      // 로그인된 경우 체크아웃 페이지로 이동
      router.push("/pricing/checkout");
    } catch (error) {
      console.error("결제 과정에서 오류가 발생했습니다:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>COMET PRO</h1>
        <p className={styles.subtitle}>더 강력한 기능으로 업그레이드하세요</p>
      </div>

      <div className={styles.planContainer}>
        <div className={styles.plan}>
          <div className={styles.planHeader}>
            <h2 className={styles.planTitle}>PRO 구독</h2>
            <div className={styles.planPrice}>
              <span className={styles.currency}>₩</span>
              <span className={styles.amount}>19,900</span>
              <span className={styles.period}>/월</span>
            </div>
            <p className={styles.planDescription}>
              모든 프리미엄 기능에 무제한 접근
            </p>
          </div>

          <div className={styles.planComparison}>
            <div className={styles.freeFeatures}>
              <h3>무료 계정에 포함된 기능</h3>
              <ul>
                <li>기본 AI 기능 접근</li>
                <li>기본 AI 모델 (GEMINI)</li>
                <li>일 50개 작업 제한</li>
                <li>기본 고객 지원</li>
              </ul>
            </div>
            <div className={styles.proFeatures}>
              <h3>PRO 계정에만 포함된 기능</h3>
              <ul>
                <li>고급 AI 모델 (자사 모델)</li>
                <li>무제한 작업 생성</li>
                <li>상세한 작업 분석 및 인사이트</li>
                <li>24/7 우선 고객 지원</li>
              </ul>
            </div>
          </div>

          <button
            className={styles.subscribeButton}
            onClick={handleSubscribe}
            disabled={isLoading || authLoading}
          >
            {isLoading ? "처리 중..." : "구독하기"}
          </button>
        </div>
      </div>

      <div className={styles.guarantee}>
        <div className={styles.guaranteeIcon}>
          <Image
            src="/icons/question-circle.svg"
            alt="보증"
            width={32}
            height={32}
          />
        </div>
        <div className={styles.guaranteeContent}>
          <h3>100% 만족 보증</h3>
          <p>
            첫 7일 동안 COMET PRO를 체험해보세요. 만족하지 않으시면 전액
            환불해드립니다.
          </p>
        </div>
      </div>

      <div className={styles.faq}>
        <h2>자주 묻는 질문</h2>
        <div className={styles.faqItem}>
          <h3>결제는 어떻게 진행되나요?</h3>
          <p>
            신용카드, 체크카드 를 통해 안전하게 결제할 수 있습니다. 모든 결제는
            암호화되어 처리됩니다.
          </p>
        </div>
        <div className={styles.faqItem}>
          <h3>언제든지 구독을 취소할 수 있나요?</h3>
          <p>
            네, 언제든지 구독을 취소할 수 있으며 다음 결제 주기부터 요금이
            청구되지 않습니다.
          </p>
        </div>
        <div className={styles.faqItem}>
          <h3>환불 정책은 어떻게 되나요?</h3>
          <p>
            구독 후 7일 이내에 요청하시면 전액 환불해 드립니다. 7일 이후에는
            부분 환불이 적용될 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
