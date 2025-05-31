"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "../page.module.css";
import { IconButtonProps, QueueStatus } from "../types";
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
 * QueueStatusBar 컴포넌트
 * 큐 상태를 바 형식으로 표시하는 컴포넌트
 */
interface QueueStatusBarProps {
  queueStatus: QueueStatus;
  isRefreshing?: boolean;
}

const QueueStatusBar: React.FC<QueueStatusBarProps> = ({
  queueStatus,
  isRefreshing = false,
}) => {
  const router = useRouter();
  const [localRefreshing, setLocalRefreshing] = useState(false);

  const currentJobs = queueStatus.totalUserJobs;
  const totalSlots = queueStatus.totalUserJobs + queueStatus.availableSlots;
  const percentage = totalSlots > 0 ? (currentJobs / totalSlots) * 100 : 0;

  // 퍼센티지에 따른 색상 클래스 결정 (더 명확한 경계값 사용)
  const getColorClass = () => {
    if (percentage < 33.34) return styles.queueBarLow;
    if (percentage < 66.67) return styles.queueBarMedium;
    return styles.queueBarHigh;
  };

  // 상태에 따른 텍스트 색상 클래스 결정
  const getTextColorClass = () => {
    if (percentage < 33.34) return styles.queueTextLow;
    if (percentage < 66.67) return styles.queueTextMedium;
    return styles.queueTextHigh;
  };

  const handleRefresh = async () => {
    setLocalRefreshing(true);
    router.refresh();

    setTimeout(() => {
      setLocalRefreshing(false);
    }, 800);
  };

  const isCurrentlyRefreshing = isRefreshing || localRefreshing;

  if (isCurrentlyRefreshing) {
    return (
      <div className={styles.queueStatusContainer}>
        <div className={styles.queueBar}>
          <div
            className={styles.queueBarSkeleton}
            style={{ width: "100%" }}
          />
        </div>
        <span className={styles.queueTextSkeleton}>
          <span className={styles.skeletonText} />
        </span>
        <button
          className={styles.queueRefreshButton}
          disabled
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
            <path d="M3 21v-5h5" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className={styles.queueStatusContainer}>
      <div className={styles.queueBar}>
        <div
          className={`${styles.queueBarFill} ${getColorClass()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className={`${styles.queueStatusText} ${getTextColorClass()}`}>
        <span className={styles.queueNumbers}>{currentJobs}</span>
        <span className={styles.queueSeparator}>/</span>
        <span className={styles.queueNumbers}>{totalSlots}</span>
      </span>
      <button
        className={styles.queueRefreshButton}
        onClick={handleRefresh}
        title="큐 상태 새로고침"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
          <path d="M21 3v5h-5" />
          <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
          <path d="M3 21v-5h5" />
        </svg>
      </button>
    </div>
  );
};

/**
 * Header 컴포넌트
 * 워크스페이스 페이지의 상단 헤더를 렌더링
 */
interface HeaderProps {
  onToggleHistory?: () => void;
  queueStatus: QueueStatus;
}

const Header: React.FC<HeaderProps> = ({ onToggleHistory, queueStatus }) => (
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
      <QueueStatusBar queueStatus={queueStatus} />
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
    </div>
  </header>
);

export default Header;
