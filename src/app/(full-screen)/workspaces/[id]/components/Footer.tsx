import React from "react";
import styles from "../page.module.css";
import { FooterProps } from "../types";
import { COPYRIGHT_TEXT, DATE_FORMAT_OPTIONS } from "../constants";

/**
 * Footer 컴포넌트
 * 워크스페이스 페이지의 하단 푸터를 렌더링
 */
const Footer: React.FC<FooterProps> = ({ lastEditDate }) => (
  <footer className={styles.footer}>
    <div className={styles.footerLeft}>
      <span className={styles.copyright}>{COPYRIGHT_TEXT}</span>
    </div>
    <div className={styles.footerCenter}>
      <span className={styles.lastEdit}>
        최종 수정: {lastEditDate.toLocaleString("ko-KR", DATE_FORMAT_OPTIONS)}
      </span>
    </div>
  </footer>
);

export default Footer;
