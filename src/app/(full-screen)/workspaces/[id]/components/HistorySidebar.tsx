"use client";
import { useState } from "react";
import styles from "./HistorySidebar.module.css";
import {
  getWorkspaceById,
  toggleFavorite,
  updateHistoryName,
} from "../actions";

// 히스토리 항목의 타입 정의
type HistoryItem = Awaited<
  ReturnType<typeof getWorkspaceById>
>["history"][number];

interface HistorySidebarProps {
  history: HistoryItem[];
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
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    {}
  );
  const [editingHistoryId, setEditingHistoryId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  // 히스토리 이름 표시 로직: historyName이 있으면 표시, 없으면 userRequest 표시
  const getDisplayText = (item: HistoryItem) =>
    item.historyName || item.userRequest;

  const getHistoryDate = (item: HistoryItem) => {
    if (item.aiResponse) {
      return new Date(item.aiResponse.createdAt).toLocaleDateString("ko-KR", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    if (item.status === "PENDING") return "교열중...";
    if (item.status === "ERROR") return "교열 실패";
    return new Date(item.createdAt).toLocaleDateString("ko-KR", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getHistoryDateColor = (item: HistoryItem) => {
    if (item.status === "ERROR") return "#ef4444cb";
    if (item.status === "PENDING") return "#6365f1bf";
    return "";
  };

  // 히스토리 항목 클릭 시 해당 히스토리로 이동하는 핸들러
  const handleHistoryItemClick = (historyId: string) => {
    if (!historyId) return;
    setSelectedHistoryId(historyId);
    onClose();
  };

  const handleToggleFavorite = async (historyId: string) => {
    if (loadingStates[historyId]) return;

    setLoadingStates((prev) => ({ ...prev, [historyId]: true }));
    try {
      await toggleFavorite(historyId);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [historyId]: false }));
    }
  };

  const handleEditStart = (item: HistoryItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingHistoryId(item.id);
    // 편집 시에도 현재 표시되는 텍스트를 사용
    setEditText(getDisplayText(item));
  };

  const handleEditCancel = () => {
    setEditingHistoryId(null);
    setEditText("");
  };

  const handleEditSave = async () => {
    if (!editingHistoryId) return;

    try {
      await updateHistoryName(editingHistoryId, editText);
      setEditingHistoryId(null);
      setEditText("");
    } catch (error) {
      console.error("히스토리 이름 업데이트 실패:", error);
      alert("히스토리 이름 업데이트에 실패했습니다.");
    }
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
                  {editingHistoryId === item.id ? (
                    <div className={styles.editContainer}>
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className={styles.editInput}
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.stopPropagation();
                            handleEditSave();
                          }
                          if (e.key === "Escape") {
                            e.stopPropagation();
                            handleEditCancel();
                          }
                        }}
                        autoFocus
                        placeholder="히스토리 이름 입력"
                      />
                      <div className={styles.editButtons}>
                        <button
                          className={styles.editSaveButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditSave();
                          }}
                          title="저장"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </button>
                        <button
                          className={styles.editCancelButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditCancel();
                          }}
                          title="취소"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M18 6L6 18M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className={styles.historyItemText}>
                        {getDisplayText(item).length > 50
                          ? `${getDisplayText(item).substring(0, 50)}...`
                          : getDisplayText(item)}
                      </p>
                      <button
                        className={styles.editButton}
                        onClick={(e) => handleEditStart(item, e)}
                        title="히스토리 이름 수정"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                    </>
                  )}
                </div>
                <div className={styles.historyItemFooter}>
                  <span
                    className={styles.historyDate}
                    style={{ color: getHistoryDateColor(item) }}
                  >
                    {getHistoryDate(item)}
                  </span>
                  <button
                    className={`${styles.starButton} ${item.historyFavorite ? styles.active : ""} ${loadingStates[item.id] ? styles.loading : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFavorite(item.id);
                    }}
                    disabled={loadingStates[item.id]}
                    title="즐겨찾기"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
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
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistorySidebar;
