import React from "react";
import styles from "./GridView.module.css";
import { ChatItem } from "../types";

interface GridViewProps {
  chats: ChatItem[];
  optionOpenId: number | null;
  setOptionOpenId: (id: number | null) => void;
  handleCardClick: (id: number) => void;
  handleRename: (id: number, e: React.MouseEvent) => void;
  handleDelete: (id: number, e: React.MouseEvent) => void;
}

export default function GridView({
  chats,
  optionOpenId,
  setOptionOpenId,
  handleCardClick,
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
              <span>생성: {chat.createdAt}</span>
              <span>최근 사용: {chat.lastUsedAt}</span>
              <span>교열 {chat.revisionCount}회</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
