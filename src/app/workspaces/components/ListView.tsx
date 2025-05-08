import React from "react";
import styles from "./ListView.module.css";
import { WorkItem } from "../types";
import { formatDateTime, formatRelativeTime } from "@/utils/date";

interface ListViewProps {
  chats: WorkItem[];
  optionOpenId: string | null;
  setOptionOpenId: (id: string | null) => void;
  handleCardClick: (id: string) => void;
  handleRename: (id: string, e: React.MouseEvent) => void;
  handleDelete: (id: string, e: React.MouseEvent) => void;
}

export default function ListView({
  chats,
  optionOpenId,
  setOptionOpenId,
  handleCardClick,
  handleRename,
  handleDelete,
}: ListViewProps) {
  return (
    <div className={styles.list}>
      {chats.map((chat) => (
        <div
          className={styles.listItem}
          key={chat.id}
          onClick={() => handleCardClick(chat.id)}
        >
          <div className={styles.itemContent}>
            <div className={styles.itemTitle}>{chat.title}</div>
            <div className={styles.itemInfo}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>교정 횟수:</span>
                <span className={styles.infoValue}>
                  {chat._count.history}개
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>최근 사용:</span>
                <span className={styles.infoValue}>
                  {formatRelativeTime(chat.lastUsedAt)}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>생성일:</span>
                <span className={styles.infoValue}>
                  {formatDateTime(chat.createdAt)}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.itemActions}>
            <button
              className={styles.optionBtn}
              onClick={(e) => {
                e.stopPropagation();
                setOptionOpenId(optionOpenId === chat.id ? null : chat.id);
              }}
              aria-label="옵션"
              type="button"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle
                  cx="12"
                  cy="6"
                  r="1.5"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="1.5"
                />
                <circle
                  cx="12"
                  cy="18"
                  r="1.5"
                />
              </svg>
            </button>
            {optionOpenId === chat.id && (
              <div className={styles.optionMenu}>
                <button
                  className={styles.optionMenuItem}
                  onClick={(e) => handleRename(chat.id, e)}
                  type="button"
                >
                  제목 변경
                </button>
                <button
                  className={styles.optionMenuItem}
                  onClick={(e) => handleDelete(chat.id, e)}
                  type="button"
                >
                  삭제
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
