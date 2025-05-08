"use client";

import { useScroll } from "@/hooks/useScroll";
import { UserInfo } from "@/lib/auth";
import styles from "./header-client.module.css";
import Logo from "./logo";
import UserSection from "./user-section";

interface HeaderClientProps {
  user: UserInfo | null;
}

export function HeaderClient({ user }: HeaderClientProps) {
  // 스크롤이 100px 이상 내려갔을 때 isBgDark 값이 true로 변경됨
  // isBgDark 값이 true일 때 containerDark 클래스가 추가되어 배경색이 검은색으로 변경됨
  const isBgDark = useScroll(100);

  return (
    <div
      className={`${styles.container} ${isBgDark ? styles.containerDark : ""}`}
    >
      <Logo />
      <UserSection user={user} />
    </div>
  );
}
