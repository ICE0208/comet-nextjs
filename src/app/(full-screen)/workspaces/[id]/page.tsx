import {
  getIsCorrectionTutorial,
  getQueueStatusAll,
  getWorkspaceById,
} from "./actions";
import { WorkspacePageProps } from "./types";
import ClientWorkspacePage from "./client-page";

/**
 * WorkspaceContent 컴포넌트
 * 실제 데이터 로딩을 담당하는 서브 컴포넌트
 */
export default async function WorkspaceContent({ params }: WorkspacePageProps) {
  // 워크스페이스 데이터 조회
  const workspacePromise = getWorkspaceById((await params).id);
  const queueStatusPromise = getQueueStatusAll();
  const isCorrectionTutorialPromise = getIsCorrectionTutorial();
  const minLoadingTimePromise = new Promise((resolve) =>
    setTimeout(resolve, 500)
  );

  const [workspace, queueStatus, isCorrectionTutorial] =
    await Promise.allSettled([
      workspacePromise,
      queueStatusPromise,
      isCorrectionTutorialPromise,
      minLoadingTimePromise,
    ]);

  if (
    workspace.status === "rejected" ||
    queueStatus.status === "rejected" ||
    isCorrectionTutorial.status === "rejected"
  ) {
    return <div>Error</div>;
  }

  return (
    <ClientWorkspacePage
      workspace={workspace.value}
      queueStatus={queueStatus.value}
      isCorrectionTutorial={isCorrectionTutorial.value}
    />
  );
}
