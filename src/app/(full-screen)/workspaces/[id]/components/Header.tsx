"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./Header.module.css";
import { IconButtonProps, QueueStatus, QueueStatusAll } from "../types";
import { HEADER_BUTTONS } from "../constants";
import { useAdaptiveTooltip } from "@/hooks/useAdaptiveTooltip";

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
 * 큐 상태를 GitHub Pro 스타일 뱃지로 표시하는 컴포넌트
 */
interface QueueStatusBarProps {
  queueStatus: QueueStatus;
  isRefreshing?: boolean;
  label?: string;
}

const QueueStatusBar: React.FC<QueueStatusBarProps> = ({
  queueStatus,
  isRefreshing = false,
  label = "Basic",
}) => {
  const currentJobs = queueStatus.totalUserJobs;
  const totalSlots = queueStatus.totalUserJobs + queueStatus.availableSlots;
  const percentage = totalSlots > 0 ? (currentJobs / totalSlots) * 100 : 0;

  // 퍼센티지에 따른 뱃지 색상 클래스 결정
  const getBadgeColorClass = () => {
    if (percentage < 33.34) return styles.queueBadgeLow;
    if (percentage < 66.67) return styles.queueBadgeMedium;
    return styles.queueBadgeHigh;
  };

  if (isRefreshing) {
    return (
      <div className={`${styles.queueBadge} ${styles.queueBadgeSkeleton}`}>
        <span className={styles.skeletonText} />
      </div>
    );
  }

  return (
    <div className={`${styles.queueBadge} ${getBadgeColorClass()}`}>
      <span className={styles.queueLabel}>{label}</span>
      <span className={styles.queueCount}>
        {currentJobs}/{totalSlots}
      </span>
    </div>
  );
};

/**
 * Header 컴포넌트
 * 워크스페이스 페이지의 상단 헤더를 렌더링
 */
interface HeaderProps {
  onToggleHistory?: () => void;
  queueStatus: QueueStatusAll;
}

const Header: React.FC<HeaderProps> = ({ onToggleHistory, queueStatus }) => {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { tooltipPosition, handleMouseEnter } = useAdaptiveTooltip({
    offset: 8,
  });
  const [showTooltip, setShowTooltip] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    router.refresh();

    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  const tooltipStyle = {
    position: "fixed" as const,
    left: tooltipPosition.left,
    transform: tooltipPosition.transform,
    zIndex: 9999,
    ...(tooltipPosition.placement === "top"
      ? { bottom: tooltipPosition.bottom }
      : { top: tooltipPosition.top }),
  };

  return (
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
        <div className={styles.queueBadgesContainer}>
          <span className={styles.queueSectionLabel}>작업 현황</span>
          <QueueStatusBar
            queueStatus={queueStatus.basic}
            label="Basic"
            isRefreshing={isRefreshing}
          />
          <QueueStatusBar
            queueStatus={queueStatus.pro}
            label="Pro"
            isRefreshing={isRefreshing}
          />
          <button
            className={styles.queueRefreshButton}
            onClick={handleRefresh}
            onMouseEnter={(e) => {
              handleMouseEnter(e);
              setShowTooltip(true);
            }}
            onMouseLeave={() => setShowTooltip(false)}
            disabled={isRefreshing}
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
              className={isRefreshing ? styles.refreshSpinner : ""}
            >
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
              <path d="M3 21v-5h5" />
            </svg>
            {showTooltip && (
              <div
                className={`${styles.customTooltip} ${
                  tooltipPosition.placement === "bottom"
                    ? styles.tooltipBottom
                    : styles.tooltipTop
                }`}
                style={tooltipStyle}
              >
                작업 현황 새로고침
                <div
                  className={`${styles.tooltipArrow} ${
                    tooltipPosition.placement === "bottom"
                      ? styles.arrowTop
                      : styles.arrowBottom
                  }`}
                />
              </div>
            )}
          </button>
        </div>
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
};

export default Header;
