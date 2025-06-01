import React from "react";
import { getQueueStatusAll, getWorkspaceById } from "./actions";
import { WorkspacePageProps } from "./types";
import ClientWorkspacePage from "./client-page";

/**
 * WorkspacePage 컴포넌트
 * 서버 컴포넌트로 워크스페이스 데이터를 로드하고 클라이언트 컴포넌트로 전달
 */
const WorkspacePage = async ({ params }: WorkspacePageProps) => {
  // 워크스페이스 데이터 조회
  const workspacePromise = getWorkspaceById((await params).id);
  const queueStatusPromise = getQueueStatusAll();

  const [workspace, queueStatus] = await Promise.allSettled([
    workspacePromise,
    queueStatusPromise,
  ]);

  if (workspace.status === "rejected" || queueStatus.status === "rejected") {
    return <div>Error</div>;
  }

  return (
    <ClientWorkspacePage
      workspace={workspace.value}
      queueStatus={queueStatus.value}
    />
  );
};

export default WorkspacePage;
