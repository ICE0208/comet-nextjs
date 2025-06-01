import React from "react";
import styles from "./loading.module.css";

/**
 * WorkspaceDetailSkeleton 컴포넌트
 * 워크스페이스 상세 페이지 로딩 시 표시되는 스켈레톤 UI
 */
export default function Loading() {
  return (
    <div className={styles.container}>
      {/* 헤더 스켈레톤 - 실제 Header 컴포넌트와 동일한 구조 */}
      <div className={styles.headerBar}>
        <div className={styles.headerLeft}>
          <div className={styles.backLinkSkeleton}>
            <div className={styles.backIconSkeleton} />
            <div className={styles.backTextSkeleton} />
          </div>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.queueBadgesContainer}>
            <div className={styles.queueLabelSkeleton} />
            <div className={styles.queueBadgeSkeleton} />
            <div className={styles.queueBadgeSkeleton} />
            <div className={styles.refreshButtonSkeleton} />
          </div>
          <div className={styles.iconButtonSkeleton} />
        </div>
      </div>

      {/* 제목 스켈레톤 - 실제 h1과 동일한 구조 */}
      <div className={styles.header}>
        <h1 className={styles.titleSkeleton} />
      </div>

      {/* 메인 입출력 컴포넌트 스켈레톤 */}
      <div className={styles.ioComponents}>
        {/* 입력 컴포넌트 스켈레톤 - 실제 PromptInput 구조 반영 */}
        <div className={styles.inputContainer}>
          <div className={styles.inputTitleContainer}>
            <div className={styles.inputTitleSkeleton} />
          </div>
          <div className={styles.textareaWrapperSkeleton}>
            <div className={styles.textareaSkeleton} />
          </div>
          <div className={styles.bottomContainer}>
            <div className={styles.buttonContainer}>
              <div className={styles.submitButtonSkeleton} />
            </div>
          </div>
        </div>

        {/* 출력 컴포넌트 스켈레톤 */}
        <div className={styles.outputContainer}>
          <div className={styles.outputTitleContainer}>
            <div className={styles.outputTitleSkeleton} />
            <div className={styles.outputButtonsSkeleton}>
              <div className={styles.outputButtonSkeleton} />
              <div className={styles.outputButtonSkeleton} />
            </div>
          </div>
          <div className={styles.outputContentSkeleton}>
            <div className={styles.outputTextLineSkeleton} />
            <div className={styles.outputTextLineSkeleton} />
            <div className={styles.outputTextLineSkeleton} />
            <div
              className={`${styles.outputTextLineSkeleton} ${styles.shortLine}`}
            />
          </div>
        </div>
      </div>

      {/* 푸터 스켈레톤 - 실제 Footer와 동일한 구조 (left, center만) */}
      <footer className={styles.footer}>
        <div className={styles.footerLeft}>
          <div className={styles.copyrightSkeleton} />
        </div>
        <div className={styles.footerCenter}>
          <div className={styles.lastEditSkeleton} />
        </div>
      </footer>
    </div>
  );
}
