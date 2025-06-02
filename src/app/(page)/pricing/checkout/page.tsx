"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./page.module.css";

const CheckoutPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
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

  const formatCardNumber = (value: string) => {
    // Format card number to groups of 4 digits with spaces
    const digitsOnly = value.replace(/\D/g, "");
    const formattedValue = digitsOnly.replace(/(\d{4})(?=\d)/g, "$1 ");
    return formattedValue.substring(0, 19); // Max length 16 digits + 3 spaces
  };

  const formatExpiryDate = (value: string) => {
    // Format expiry date as MM/YY
    const digitsOnly = value.replace(/\D/g, "");
    if (digitsOnly.length > 2) {
      return `${digitsOnly.substring(0, 2)}/${digitsOnly.substring(2, 4)}`;
    }
    return digitsOnly;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCardNumber(e.target.value);
    setFormData({
      ...formData,
      cardNumber: formattedValue,
    });

    if (errors.cardNumber) {
      setErrors({
        ...errors,
        cardNumber: null,
      });
    }
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatExpiryDate(e.target.value);
    setFormData({
      ...formData,
      expiryDate: formattedValue,
    });

    if (errors.expiryDate) {
      setErrors({
        ...errors,
        expiryDate: null,
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (
      !formData.cardNumber.trim() ||
      formData.cardNumber.replace(/\s/g, "").length < 16
    ) {
      newErrors.cardNumber = "유효한 카드 번호를 입력해주세요";
    }

    if (!formData.cardHolder.trim()) {
      newErrors.cardHolder = "카드 소유자 이름을 입력해주세요";
    }

    if (!formData.expiryDate || formData.expiryDate.length < 5) {
      newErrors.expiryDate = "유효기간을 입력해주세요";
    } else {
      const [month, year] = formData.expiryDate.split("/");
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;

      if (
        parseInt(month) < 1 ||
        parseInt(month) > 12 ||
        parseInt(year) < currentYear ||
        (parseInt(year) === currentYear && parseInt(month) < currentMonth)
      ) {
        newErrors.expiryDate = "유효하지 않은 유효기간입니다";
      }
    }

    if (!formData.cvv || formData.cvv.length < 3) {
      newErrors.cvv = "보안 코드를 입력해주세요";
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
      // 실제 구현 시에는 여기서 결제 API 호출
      // 예: const response = await fetch('/api/subscribe', { method: 'POST', body: JSON.stringify(formData) });

      // 성공 시 결제 완료 페이지로 리다이렉트 (3초 후)
      setTimeout(() => {
        // 결제 성공 시 리다이렉트할 페이지
        router.push("/profile");
      }, 3000);
    } catch (error) {
      console.error("결제 처리 중 오류가 발생했습니다:", error);
      setErrors({
        form: "결제 처리 중 오류가 발생했습니다. 다시 시도해주세요.",
      });
    } finally {
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
          >
            <div className={styles.formGroup}>
              <label htmlFor="cardNumber">카드 번호</label>
              <div className={styles.inputWithIcon}>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={formData.cardNumber}
                  onChange={handleCardNumberChange}
                  maxLength={19}
                  className={errors.cardNumber ? styles.inputError : ""}
                />
                <div className={styles.cardIcons}>
                  <Image
                    src="/icons/card-visa.svg"
                    alt="Visa"
                    width={24}
                    height={16}
                  />
                  <Image
                    src="/icons/card-mastercard.svg"
                    alt="Mastercard"
                    width={24}
                    height={16}
                  />
                </div>
              </div>
              {errors.cardNumber && (
                <div className={styles.errorText}>{errors.cardNumber}</div>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="cardHolder">카드 소유자 이름</label>
              <input
                type="text"
                id="cardHolder"
                name="cardHolder"
                placeholder="카드에 표시된 이름"
                value={formData.cardHolder}
                onChange={handleInputChange}
                className={errors.cardHolder ? styles.inputError : ""}
              />
              {errors.cardHolder && (
                <div className={styles.errorText}>{errors.cardHolder}</div>
              )}
            </div>

            <div className={styles.formRowGroup}>
              <div className={styles.formGroup}>
                <label htmlFor="expiryDate">유효기간</label>
                <input
                  type="text"
                  id="expiryDate"
                  name="expiryDate"
                  placeholder="MM/YY"
                  value={formData.expiryDate}
                  onChange={handleExpiryDateChange}
                  maxLength={5}
                  className={errors.expiryDate ? styles.inputError : ""}
                />
                {errors.expiryDate && (
                  <div className={styles.errorText}>{errors.expiryDate}</div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="cvv">보안 코드 (CVV)</label>
                <input
                  type="text"
                  id="cvv"
                  name="cvv"
                  placeholder="123"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  maxLength={4}
                  className={errors.cvv ? styles.inputError : ""}
                />
                {errors.cvv && (
                  <div className={styles.errorText}>{errors.cvv}</div>
                )}
              </div>
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
                    결제 처리 중...
                  </>
                ) : (
                  "결제 완료"
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
