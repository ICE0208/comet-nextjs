import React from "react";
import styles from "./page.module.css";

import PromptInput from "./components/PromptInput";
import PromptOutput from "./components/PromptOutput";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { getWorkspaceById } from "./actions";
import { WorkspacePageProps } from "./types";

/**
 * WorkspacePage 컴포넌트
 * 워크스페이스의 메인 페이지를 렌더링
 *
 * @param params - URL 파라미터 (워크스페이스 ID)
 */
const WorkspacePage = async ({ params }: WorkspacePageProps) => {
  // 워크스페이스 데이터 조회
  const workspace = await getWorkspaceById((await params).id);

  // 최근 히스토리에서 입력 텍스트와 AI 응답 추출
  const latestHistory = workspace.history[0] || {
    userRequest: "",
    aiResponse: null,
  };

  return (
    <div className={styles.container}>
      <Header />

      <div className={styles.header}>
        <h1 className={styles.title}>{workspace.title}</h1>
      </div>

      <div className={styles.ioComponents}>
        <PromptInput
          workspaceId={workspace.id}
          savedInputText={latestHistory.userRequest}
        />
        <PromptOutput savedAIResponse={latestHistory.aiResponse} />
      </div>

      <Footer lastEditDate={new Date(workspace.updatedAt)} />
    </div>
  );
};

export default WorkspacePage;
