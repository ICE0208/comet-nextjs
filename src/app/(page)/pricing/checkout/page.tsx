"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./page.module.css";

const CheckoutPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    agreeTerms: false,
  });
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email || !formData.email.includes("@")) {
      newErrors.email = "유효한 이메일 주소를 입력해주세요";
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = "결제 약관에 동의해주세요";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Stripe 결제 세션 생성 API 호출
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.url) {
        // Stripe 결제 페이지로 리다이렉트
        window.location.href = data.url;
      } else {
        setErrors({
          form: "결제 세션 URL을 받지 못했습니다. 다시 시도해주세요.",
        });
        setIsLoading(false);
      }
    } catch {
      // 오류 상태 설정
      setErrors({
        form: "결제 처리 중 오류가 발생했습니다. 다시 시도해주세요.",
      });
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>구독 결제</h1>
        <p className={styles.subtitle}>COMET PRO 구독 결제를 진행합니다</p>
      </div>

      <div className={styles.checkoutContainer}>
        <div className={styles.orderSummary}>
          <h2>주문 요약</h2>
          <div className={styles.planDetails}>
            <div className={styles.planName}>COMET PRO 구독</div>
            <div className={styles.planPrice}>₩19,900/월</div>
          </div>
          <div className={styles.planFeatures}>
            <ul>
              <li>고급 AI 모델 접근 권한</li>
              <li>무제한 작업 생성</li>
              <li>우선 처리 및 빠른 응답 시간</li>
              <li>고급 분석 및 인사이트</li>
              <li>우선 고객 지원</li>
            </ul>
          </div>
          <div className={styles.totalSection}>
            <div className={styles.totalRow}>
              <span>월 구독료</span>
              <span>₩19,900</span>
            </div>
            <div className={styles.totalRow}>
              <span>세금</span>
              <span>₩1,990</span>
            </div>
            <div className={styles.totalAmount}>
              <span>총 결제 금액</span>
              <span>₩21,890</span>
            </div>
          </div>
          <div className={styles.guaranteeInfo}>
            <Image
              src="/icons/question-circle.svg"
              alt="안내"
              width={16}
              height={16}
            />
            <span>7일 환불 보장 제공</span>
          </div>
        </div>

        <div className={styles.paymentSection}>
          <h2>결제 정보</h2>
          {errors.form && <div className={styles.formError}>{errors.form}</div>}

          <form
            onSubmit={handleSubmit}
            className={styles.paymentForm}
            noValidate
          >
            <div className={styles.formGroup}>
              <label htmlFor="email">이메일 주소</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? styles.inputError : ""}
                autoComplete="email"
              />
              {errors.email && (
                <div className={styles.errorText}>{errors.email}</div>
              )}
            </div>

            <div className={styles.infoMessage}>
              <Image
                src="/icons/info-circle.svg"
                alt="정보"
                width={16}
                height={16}
              />
              <span>
                카드 정보는 다음 단계에서 안전하게 입력하실 수 있습니다.
              </span>
            </div>

            <div className={styles.checkboxGroup}>
              <input
                type="checkbox"
                id="agreeTerms"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleInputChange}
              />
              <label htmlFor="agreeTerms">
                <span className={styles.checkbox} />
                구독 결제 약관 및 개인정보 처리방침에 동의합니다
              </label>
            </div>
            {errors.agreeTerms && (
              <div className={styles.errorText}>{errors.agreeTerms}</div>
            )}

            <div className={styles.formActions}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={handleCancel}
                disabled={isLoading}
              >
                취소
              </button>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className={styles.loadingSpinner} />
                    결제 진행 중...
                  </>
                ) : (
                  "결제 계속하기"
                )}
              </button>
            </div>
          </form>

          <div className={styles.securePaymentInfo}>
            <Image
              src="/icons/lock.svg"
              alt="보안"
              width={16}
              height={16}
            />
            <span>모든 결제 정보는 안전하게 암호화됩니다</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
