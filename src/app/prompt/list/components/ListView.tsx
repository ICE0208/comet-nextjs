import React from "react";
import styles from "./ListView.module.css";
import { ChatItem } from "../types";

interface ListViewProps {
  chats: ChatItem[];
  optionOpenId: number | null;
  setOptionOpenId: (id: number | null) => void;
  handleCardClick: (id: number) => void;
  handleRename: (id: number, e: React.MouseEvent) => void;
  handleDelete: (id: number, e: React.MouseEvent) => void;
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
        <div className={styles.listIcon} />
        <div className={`${styles.listHeaderItem}`}>제목</div>
        <div className={`${styles.listHeaderItem} ${styles.date}`}>
          생성 시간
        </div>
        <div className={`${styles.listHeaderItem} ${styles.date}`}>
          최근 사용
        </div>
        <div className={`${styles.listHeaderItem} ${styles.revision}`}>
          교열 횟수
        </div>
        <div
          className={styles.listHeaderItem}
          style={{ flex: "0 0 50px" }}
        />
      </div>

      {chats.map((chat) => (
        <div
          className={styles.listItem}
          key={chat.id}
          onClick={() => handleCardClick(chat.id)}
        >
          <div className={styles.listIcon}>{chat.icon}</div>
          <div className={styles.listCol}>{chat.title}</div>
          <div className={`${styles.listCol} ${styles.date}`}>
            {chat.createdAt}
          </div>
          <div className={`${styles.listCol} ${styles.date}`}>
            {chat.lastUsedAt}
          </div>
          <div className={`${styles.listCol} ${styles.revision}`}>
            {chat.revisionCount}회
          </div>
          <div style={{ position: "relative", flex: "0 0 50px" }}>
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
