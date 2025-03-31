import React from "react";
import Image from "next/image";
import styles from "./styles.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.divider} />
      <div className={styles.title}>
        <Image
          src="/icons/footer-logo.svg"
          alt="logo"
          width={24}
          height={24}
        />
        COMET
      </div>
      <div className={styles.description}>
        <p>대표자 이서준</p>
        <p>전화번호 010-2514-5034</p>
        <p>이메일 seojunlee27@naver.com</p>
        <p>주소 충청남도 아산시 탕정면 선문로 221번길 70 인문관 301B</p>
        <p>사업자 등록번호 123-45-67890</p>
        <p>운영시간 09:00 ~ 18:00 (주말 및 공휴일 휴무)</p>
      </div>
      <div className={styles.under_line}>
        <div>Copyright ⓒ 2023. COMET All rights reserved.</div>
        <div className={styles.under_line_right}>
          <div>이용약관 | 개인정보처리방침</div>
          <div>고객센터 070-1234-5678</div>
        </div>
      </div>
    </footer>
  );
}
