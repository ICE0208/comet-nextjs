import React from "react";
import Image from "next/image";
import styles from "./styles.module.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footer_content}>
        <div className={styles.title}>
          <Image
            src="/icons/footer-logo.png"
            alt="COMET"
            width={40}
            height={40}
          />
          COMET
        </div>
        <div className={styles.description}>
          <p>
            <span>충청남도 아산시 탕정면 선문로 221번길 70 인문관 301B</span>
          </p>
          <p>
            <span>
              301B, Humanities Building, 70, Sunmun-ro 221beon-gil,
              Tangjeong-myeon, Asan-si, Chungcheongnam-do
            </span>
          </p>
          <p>
            <span>seojunlee27@naver.com</span>
            <span>010-2514-5034</span>
          </p>
          <p>
            <span>사업자 등록번호 123-45-67890</span>
            <span>운영시간 09:00 ~ 18:00</span>
          </p>
        </div>
      </div>
      <div className={styles.under_line}>
        <div>Copyright ⓒ {currentYear}. COMET All rights reserved.</div>
        <div className={styles.under_line_right}>
          <div>이용약관</div>
          <div>개인정보처리방침</div>
          <div>고객센터 070-1234-5678</div>
        </div>
      </div>
    </footer>
  );
}
