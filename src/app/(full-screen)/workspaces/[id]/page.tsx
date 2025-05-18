import React from "react";
import styles from "./page.module.css";

import PromptInput from "./components/PromptInput";
import PromptOutput from "./components/PromptOutput";
import { getWorkspaceById } from "./actions";
import Link from "next/link";

type WorkspacePageProps = {
  params: Promise<{
    id: string;
  }>;
};

const WorkspacePage = async ({ params }: WorkspacePageProps) => {
  const workspace = await getWorkspaceById((await params).id);

  return (
    <div className={styles.container}>
      {/* 헤더 */}
      <header className={styles.headerBar}>
        <div className={styles.headerLeft}>
          <Link
            href="/workspaces"
            className={styles.backLink}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span>워크스페이스</span>
          </Link>
        </div>
        <div className={styles.headerRight}>
          <button
            className={styles.iconButton}
            title="새로 교열하기"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
            </svg>
          </button>
          <button
            className={styles.iconButton}
            title="교열 목록 보기"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line
                x1="8"
                y1="6"
                x2="21"
                y2="6"
              />
              <line
                x1="8"
                y1="12"
                x2="21"
                y2="12"
              />
              <line
                x1="8"
                y1="18"
                x2="21"
                y2="18"
              />
              <line
                x1="3"
                y1="6"
                x2="3.01"
                y2="6"
              />
              <line
                x1="3"
                y1="12"
                x2="3.01"
                y2="12"
              />
              <line
                x1="3"
                y1="18"
                x2="3.01"
                y2="18"
              />
            </svg>
          </button>
          <button
            className={styles.iconButton}
            title="설정"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
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
                cy="12"
                r="3"
              />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
        </div>
      </header>

      <div className={styles.header}>
        <h1 className={styles.title}>{workspace.title}</h1>
      </div>

      <div className={styles.ioComponents}>
        <PromptInput
          workspaceId={workspace.id}
          savedInputText={
            workspace.history.length > 0 ? workspace.history[0].userRequest : ""
          }
        />
        <PromptOutput
          savedAIResponse={
            workspace.history.length > 0
              ? workspace.history[0].aiResponse
              : null
          }
        />
      </div>

      {/* 푸터 */}
      <footer className={styles.footer}>
        <div className={styles.footerLeft}>
          <span className={styles.copyright}>© 2025 Comet</span>
        </div>
        <div className={styles.footerCenter}>
          <span className={styles.lastEdit}>
            최종 수정:{" "}
            {new Date(workspace.updatedAt).toLocaleString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </footer>
    </div>
  );
};

export default WorkspacePage;
