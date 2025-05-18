"use client";
import styles from "./HistorySidebar.module.css";

// 히스토리 항목의 타입 정의
interface AIResponseItem {
  id: number;
  createdAt: Date;
  text: string;
  workspaceHistoryId: string;
}

interface HistoryItem {
  id: string;
  createdAt: Date;
  userRequest: string;
  aiResponse: AIResponseItem | null;
  workspaceId: string;
}

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
  // 히스토리 항목 클릭 시 해당 히스토리로 이동하는 핸들러
  const handleHistoryItemClick = (historyId: string) => {
    if (!historyId) return;
    setSelectedHistoryId(historyId);
    onClose();
  };

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

      <div className={styles.historyList}>
        {!history?.length ? (
          <div className={styles.emptyState}>히스토리가 없습니다.</div>
        ) : (
          history.map((item) => (
            <div
              key={item.id}
              className={`${styles.historyItem} ${item.id === selectedHistoryId ? styles.selected : ""}`}
              onClick={() => handleHistoryItemClick(item.id)}
            >
              <div className={styles.historyItemContent}>
                <p className={styles.historyItemText}>
                  {item.userRequest.length > 50
                    ? `${item.userRequest.substring(0, 50)}...`
                    : item.userRequest}
                </p>
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
