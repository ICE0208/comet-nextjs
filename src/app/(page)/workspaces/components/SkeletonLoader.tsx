import React from "react";
import styles from "./SkeletonLoader.module.css";

interface SkeletonLoaderProps {
  view: "grid" | "list";
  count?: number;
}

export default function SkeletonLoader({
  view,
  count = 6,
}: SkeletonLoaderProps) {
  return (
    <div
      className={view === "grid" ? styles.skeletonGrid : styles.skeletonList}
    >
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className={
            view === "grid" ? styles.skeletonCard : styles.skeletonListItem
          }
        >
          {view === "grid" ? <SkeletonGridItem /> : <SkeletonListItem />}
        </div>
      ))}
    </div>
  );
}

function SkeletonGridItem() {
  return (
    <>
      {/* 옵션 버튼 스켈레톤 */}
      <div className={styles.skeletonOptionBtn} />

      {/* 제목 스켈레톤 */}
      <div className={styles.skeletonTitle}>
        <div className={styles.skeletonLine} />
      </div>

      {/* 메타 정보 스켈레톤 */}
      <div className={styles.skeletonMeta}>
        <div className={styles.skeletonMetaItem}>
          <div className={styles.skeletonMetaLabel} />
          <div className={styles.skeletonMetaValue} />
        </div>
        <div className={styles.skeletonMetaItem}>
          <div className={styles.skeletonMetaLabel} />
          <div className={styles.skeletonMetaValue} />
        </div>
        <div className={styles.skeletonMetaItem}>
          <div className={styles.skeletonMetaLabel} />
          <div className={styles.skeletonMetaValue} />
        </div>
      </div>
    </>
  );
}

function SkeletonListItem() {
  return (
    <>
      {/* 콘텐츠 영역 */}
      <div className={styles.skeletonContent}>
        {/* 제목 */}
        <div className={styles.skeletonListTitle} />

        {/* 메타 정보 */}
        <div className={styles.skeletonListInfo}>
          <div className={styles.skeletonInfoItem}>
            <div className={styles.skeletonInfoLabel} />
            <div className={styles.skeletonInfoValue} />
          </div>
          <div className={styles.skeletonInfoItem}>
            <div className={styles.skeletonInfoLabel} />
            <div className={styles.skeletonInfoValue} />
          </div>
          <div className={styles.skeletonInfoItem}>
            <div className={styles.skeletonInfoLabel} />
            <div className={styles.skeletonInfoValue} />
          </div>
        </div>
      </div>

      {/* 액션 버튼 */}
      <div className={styles.skeletonActions}>
        <div className={styles.skeletonActionBtn} />
      </div>
    </>
  );
}
