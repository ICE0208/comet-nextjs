import React from "react";
import styles from "./page.module.css";

import PromptInput from "./components/PromptInput";
import PromptOutput from "./components/PromptOutput";
import Detail from "./components/Detail";
import { getWorkspaceById } from "./actions";

type WorkspacePageProps = {
  params: Promise<{
    id: string;
  }>;
};

const WorkspacePage = async ({ params }: WorkspacePageProps) => {
  const workspace = await getWorkspaceById((await params).id);

  return (
    <div className={styles.container}>
      {/* 헤더 배경 이미지 */}
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
      <Detail />
    </div>
  );
};

export default WorkspacePage;
