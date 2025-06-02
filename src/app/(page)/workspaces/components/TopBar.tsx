import React, { useState } from "react";
import styles from "./TopBar.module.css";

interface QueueStatus {
  totalUserJobs: number;
  runningJobs: number;
  availableSlots: number;
}

interface QueueStatusAll {
  basic: QueueStatus;
  pro: QueueStatus;
}

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

  // 더 은은한 색상 선택
  const getProgressColor = () => {
    if (percentage < 50) return "#cbd5e1"; // 연한 회색
    if (percentage < 80) return "#d1d5db"; // 조금 더 진한 회색
    return "#e5e7eb"; // 가장 진한 회색 (빨간색 대신)
  };

  if (isRefreshing) {
    return (
      <div className={styles.queueProgressContainer}>
        <div className={styles.queueProgressLabel}>{label}</div>
        <div className={styles.queueProgressBar}>
          <div
            className={`${styles.queueProgressFill} ${styles.queueProgressSkeleton}`}
          />
        </div>
        <div className={styles.queueProgressText}>--/--</div>
      </div>
    );
  }

  return (
    <div className={styles.queueProgressContainer}>
      <div className={styles.queueProgressLabel}>{label}</div>
      <div className={styles.queueProgressBar}>
        <div
          className={styles.queueProgressFill}
          style={{
            width: `${percentage}%`,
            backgroundColor: getProgressColor(),
          }}
        />
      </div>
      <div className={styles.queueProgressText}>
        {currentJobs}/{totalSlots}
      </div>
    </div>
  );
};

interface TopBarProps {
  view: "grid" | "list";
  setView: (view: "grid" | "list") => void;
  sort: "latest" | "created";
  setSort: (sort: "latest" | "created") => void;
  onCreateClick: () => void;
  queueStatus?: QueueStatusAll;
  onRefreshQueue?: () => void;
}

export default function TopBar({
  view,
  setView,
  sort,
  setSort,
  onCreateClick,
  queueStatus,
  onRefreshQueue,
}: TopBarProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleRefresh = async () => {
    if (onRefreshQueue) {
      setIsRefreshing(true);
      await onRefreshQueue();

      setTimeout(() => {
        setIsRefreshing(false);
      }, 800);
    }
  };

  return (
    <div className={styles.topBar}>
      <div className={styles.leftSection}>
        <button
          className={styles.createButton}
          onClick={onCreateClick}
          type="button"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={styles.plusIcon}
          >
            <path
              d="M8 1V15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M1 8H15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          새 작업
        </button>

        {queueStatus && (
          <div className={styles.queueSection}>
            <span className={styles.queueSectionLabel}>작업 현황</span>
            <div className={styles.refreshButtonContainer}>
              <button
                className={styles.queueRefreshButton}
                onClick={handleRefresh}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                disabled={isRefreshing}
                title="새로고침"
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
              </button>
              {showTooltip && (
                <div className={styles.simpleTooltip}>작업 현황 새로고침</div>
              )}
            </div>
            <div className={styles.queueProgressGroup}>
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
            </div>
          </div>
        )}
      </div>

      <div className={styles.rightControls}>
        <div className={styles.viewToggle}>
          <button
            className={
              view === "grid"
                ? `${styles.viewBtn} ${styles.selected}`
                : styles.viewBtn
            }
            onClick={() => setView("grid")}
            aria-label="그리드 뷰"
            type="button"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <rect
                x="2"
                y="2"
                width="6"
                height="6"
                rx="2"
                fill="currentColor"
              />
              <rect
                x="12"
                y="2"
                width="6"
                height="6"
                rx="2"
                fill="currentColor"
              />
              <rect
                x="2"
                y="12"
                width="6"
                height="6"
                rx="2"
                fill="currentColor"
              />
              <rect
                x="12"
                y="12"
                width="6"
                height="6"
                rx="2"
                fill="currentColor"
              />
            </svg>
          </button>
          <button
            className={
              view === "list"
                ? `${styles.viewBtn} ${styles.selected}`
                : styles.viewBtn
            }
            onClick={() => setView("list")}
            aria-label="리스트 뷰"
            type="button"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <rect
                x="3"
                y="4"
                width="14"
                height="3"
                rx="1.5"
                fill="currentColor"
              />
              <rect
                x="3"
                y="9"
                width="14"
                height="3"
                rx="1.5"
                fill="currentColor"
              />
              <rect
                x="3"
                y="14"
                width="14"
                height="3"
                rx="1.5"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
        <select
          className={styles.sortSelect}
          value={sort}
          onChange={(e) => setSort(e.target.value as "latest" | "created")}
        >
          <option value="latest">최근 사용</option>
          <option value="created">최근 생성</option>
        </select>
      </div>
    </div>
  );
}
