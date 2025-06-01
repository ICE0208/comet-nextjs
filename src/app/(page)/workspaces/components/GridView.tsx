import React from "react";
import styles from "./GridView.module.css";
import { WorkItem } from "../types";
import { formatDateTime, formatRelativeTime } from "@/utils/date";

interface GridViewProps {
  chats: WorkItem[];
  optionOpenId: string | null;
  setOptionOpenId: (id: string | null) => void;
  handleCardClick: (id: string) => void;
  handleCardHover: (id: string) => void;
  handleRename: (id: string, e: React.MouseEvent) => void;
  handleDelete: (id: string, e: React.MouseEvent) => void;
}

export default function GridView({
  chats,
  optionOpenId,
  setOptionOpenId,
  handleCardClick,
  handleCardHover,
  handleRename,
  handleDelete,
}: GridViewProps) {
  return (
    <div className={styles.grid}>
      {chats.map((chat) => (
        <div
          className={styles.card}
          key={chat.id}
          onClick={() => handleCardClick(chat.id)}
          onMouseEnter={() => handleCardHover(chat.id)}
        >
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
          <div className={styles.info}>
            <div className={styles.chatTitle}>{chat.title}</div>
            <div className={styles.meta}>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>교정 횟수:</span>
                <span className={styles.metaValue}>
                  {chat._count.history}개
                </span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>최근 사용:</span>
                <span className={styles.metaValue}>
                  {formatRelativeTime(chat.lastUsedAt)}
                </span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>생성일:</span>
                <span className={styles.metaValue}>
                  {formatDateTime(chat.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
