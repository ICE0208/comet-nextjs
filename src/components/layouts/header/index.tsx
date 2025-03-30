"use client";

import Image from "next/image";
import styles from "./styles.module.css";
import { useScroll } from "@/hooks/useScroll";

export default function Header() {
  // 스크롤이 100px 이상 내려갔을 때 isBgDark 값이 true로 변경됨
  // isBgDark 값이 true일 때 containerDark 클래스가 추가되어 배경색이 검은색으로 변경됨
  const isBgDark = useScroll(100);

  return (
    <div
      className={`${styles.container} ${isBgDark ? styles.containerDark : ""}`}
    >
      <div className={styles.logo}>
        <Image
          src="/images/header-logo.svg"
          alt="logo"
          width={159}
          height={35}
          style={{ width: "100%", height: "auto" }}
        />
      </div>
      <div className={styles.profile}>
        <Image
          src="/images/profile-temp/profile.jpg"
          alt="profile"
          width={30}
          height={30}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
    </div>
  );
}
