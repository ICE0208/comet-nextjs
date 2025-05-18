"use client";
import { useState } from "react";
import styles from "./HistorySidebar.module.css";
import { getWorkspaceById, toggleFavorite } from "../actions";

// 히스토리 항목의 타입 정의
type HistoryItem = Awaited<
  ReturnType<typeof getWorkspaceById>
>["history"][number];

interface HistorySidebarProps {
  history: HistoryItem[];
  workspaceId: string;
  isOpen: boolean;
  onClose: () => void;
  selectedHistoryId: string | null;
  setSelectedHistoryId: (historyId: string) => void;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({
  history,
  isOpen,
  onClose,
  selectedHistoryId,
  setSelectedHistoryId,
}) => {
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(true);

  // 히스토리 항목 클릭 시 해당 히스토리로 이동하는 핸들러
  const handleHistoryItemClick = (historyId: string) => {
    if (!historyId) return;
    setSelectedHistoryId(historyId);
    onClose();
  };

  const handleToggleFavorite = async (historyId: string) => {
    await toggleFavorite(historyId);
  };

  const filteredHistory = showFavoritesOnly
    ? history.filter((item) => item.historyFavorite)
    : history;

  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
      <div className={styles.header}>
        <h2 className={styles.title}>교정 히스토리</h2>
        <button
          className={styles.closeButton}
          onClick={onClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className={styles.filterButtons}>
        <button
          className={`${styles.filterButton} ${!showFavoritesOnly ? styles.active : ""}`}
          onClick={() => setShowFavoritesOnly(false)}
        >
          전체
        </button>
        <button
          className={`${styles.filterButton} ${showFavoritesOnly ? styles.active : ""}`}
          onClick={() => setShowFavoritesOnly(true)}
        >
          즐겨찾기
        </button>
      </div>

      <div className={styles.historyList}>
        {!filteredHistory?.length ? (
          <div className={styles.emptyState}>
            {showFavoritesOnly
              ? "즐겨찾기한 히스토리가 없습니다."
              : "히스토리가 없습니다."}
          </div>
        ) : (
          filteredHistory.map((item) => (
            <div
              key={item.id}
              className={`${styles.historyItem} ${item.id === selectedHistoryId ? styles.selected : ""}`}
              onClick={() => handleHistoryItemClick(item.id)}
            >
              <div className={styles.historyItemContent}>
                <div className={styles.historyItemHeader}>
                  <p className={styles.historyItemText}>
                    {item.userRequest.length > 50
                      ? `${item.userRequest.substring(0, 50)}...`
                      : item.userRequest}
                  </p>
                  <button
                    className={`${styles.starButton} ${item.historyFavorite ? styles.active : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFavorite(item.id);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill={item.historyFavorite ? "currentColor" : "none"}
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </button>
                </div>
                <span className={styles.historyDate}>
                  {new Date(item.createdAt).toLocaleDateString("ko-KR", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistorySidebar;
