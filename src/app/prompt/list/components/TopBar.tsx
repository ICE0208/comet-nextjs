import React from "react";
import styles from "./TopBar.module.css";

interface TopBarProps {
  view: "grid" | "list";
  setView: (view: "grid" | "list") => void;
  sort: "latest" | "created";
  setSort: (sort: "latest" | "created") => void;
}

export default function TopBar({ view, setView, sort, setSort }: TopBarProps) {
  return (
    <div className={styles.topBar}>
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
        <option value="latest">최신순</option>
        <option value="created">생성순</option>
      </select>
    </div>
  );
}
