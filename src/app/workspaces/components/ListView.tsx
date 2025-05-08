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
      <div className={styles.listHeader}>
        <div className={styles.titleCol}>제목</div>
        <div className={styles.countCol}>대화 기록</div>
        <div className={styles.dateCol}>최근 사용</div>
        <div className={styles.dateCol}>생성일</div>
        <div className={styles.actionCol} />
      </div>

      {chats.map((chat) => (
        <div
          className={styles.listItem}
          key={chat.id}
          onClick={() => handleCardClick(chat.id)}
        >
          <div className={styles.titleCol}>{chat.title}</div>
          <div className={styles.countCol}>{chat._count.history}개</div>
          <div className={styles.dateCol}>
            {formatRelativeTime(chat.lastUsedAt)}
          </div>
          <div className={styles.dateCol}>{formatDateTime(chat.createdAt)}</div>
          <div className={styles.actionCol}>
            <button
              className={styles.optionBtnList}
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
              <div className={styles.optionMenuList}>
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
