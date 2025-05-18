"use client";
import React from "react";
import Link from "next/link";
import styles from "../page.module.css";
import { IconButtonProps } from "../types";
import { HEADER_BUTTONS } from "../constants";

/**
 * IconButton 컴포넌트
 * 헤더의 아이콘 버튼을 렌더링하는 재사용 가능한 컴포넌트
 */
const IconButton: React.FC<IconButtonProps> = ({
  title,
  onClick,
  children,
}) => (
  <button
    className={styles.iconButton}
    title={title}
    onClick={onClick}
  >
    {children}
  </button>
);

/**
 * Header 컴포넌트
 * 워크스페이스 페이지의 상단 헤더를 렌더링
 */
interface HeaderProps {
  onToggleHistory?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleHistory }) => (
  <header className={styles.headerBar}>
    <div className={styles.headerLeft}>
      <Link
        href="/workspaces"
        className={styles.backLink}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        <span>워크스페이스</span>
      </Link>
    </div>
    <div className={styles.headerRight}>
      <IconButton title={HEADER_BUTTONS.NEW_CORRECTION.title}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d={HEADER_BUTTONS.NEW_CORRECTION.iconPath} />
        </svg>
      </IconButton>
      <IconButton
        title={HEADER_BUTTONS.VIEW_LIST.title}
        onClick={onToggleHistory}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {HEADER_BUTTONS.VIEW_LIST.iconPaths.map((path, index) => (
            <path
              key={index}
              d={path}
            />
          ))}
        </svg>
      </IconButton>
      <IconButton title={HEADER_BUTTONS.SETTINGS.title}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {HEADER_BUTTONS.SETTINGS.iconPaths.map((path, index) => (
            <path
              key={index}
              d={path}
            />
          ))}
        </svg>
      </IconButton>
    </div>
  </header>
);

export default Header;
