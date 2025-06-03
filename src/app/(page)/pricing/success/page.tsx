import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

// 정적 페이지로 변환 - 클라이언트 측 파라미터 처리 없음
export default function PaymentSuccessPage() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.successIcon}>
          <Image
            src="/icons/check-circle.svg"
            alt="성공"
            width={100}
            height={100}
            priority
          />
        </div>

        <h1 className={styles.title}>결제가 완료되었습니다!</h1>

        <div className={styles.message}>
          <p>COMET PRO 구독이 성공적으로 완료되었습니다.</p>
          <p>이제 모든 프리미엄 기능을 이용하실 수 있습니다.</p>
        </div>

        <div className={styles.benefits}>
          <h2>이용 가능한 프리미엄 기능:</h2>
          <ul>
            <li>고급 AI 모델 접근 권한</li>
            <li>무제한 작업 생성</li>
            <li>우선 처리 및 빠른 응답 시간</li>
            <li>고급 분석 및 인사이트</li>
            <li>우선 고객 지원</li>
          </ul>
        </div>

        <div className={styles.redirect}>
          <p>결제가 완료되었습니다</p>
        </div>

        <Link href="/workspaces">
          <button className={styles.button}>작업 공간으로 이동</button>
        </Link>
      </div>
    </div>
  );
}
