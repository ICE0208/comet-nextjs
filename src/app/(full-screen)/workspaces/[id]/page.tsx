import React from "react";
import { getWorkspaceById } from "./actions";
import { WorkspacePageProps } from "./types";
import ClientWorkspacePage from "./client-page";

/**
 * WorkspacePage 컴포넌트
 * 서버 컴포넌트로 워크스페이스 데이터를 로드하고 클라이언트 컴포넌트로 전달
 */
const WorkspacePage = async ({ params }: WorkspacePageProps) => {
  // 워크스페이스 데이터 조회
  const workspace = await getWorkspaceById((await params).id);

  return <ClientWorkspacePage workspace={workspace} />;
};

export default WorkspacePage;
