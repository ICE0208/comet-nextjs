import React from "react";
import styles from "./TopBar.module.css";

interface TopBarProps {
  view: "grid" | "list";
  setView: (view: "grid" | "list") => void;
  sort: "latest" | "created";
  setSort: (sort: "latest" | "created") => void;
  onCreateClick: () => void;
}

export default function TopBar({
  view,
  setView,
  sort,
  setSort,
  onCreateClick,
}: TopBarProps) {
  return (
    <div className={styles.topBar}>
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
