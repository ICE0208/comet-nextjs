"use client";
import React, { useEffect, useState } from "react";
import styles from "./page.module.css";

import PromptInput from "./components/PromptInput";
import PromptOutput from "./components/PromptOutput";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HistorySidebar from "./components/HistorySidebar";
import { WorkspaceWithHistory } from "./types";
import { usePromptStore } from "@/store/promptStore";
import { AIResponse } from "@prisma/client";
import { useRouter } from "next/navigation";
/**
 * ClientWorkspacePage 컴포넌트
 * 워크스페이스의 메인 클라이언트 컴포넌트
 *
 * @param workspace - 서버에서 로드한 워크스페이스 데이터
 */
interface ClientWorkspacePageProps {
  workspace: WorkspaceWithHistory;
}

const ClientWorkspacePage = ({ workspace }: ClientWorkspacePageProps) => {
  const [isHistorySidebarOpen, setIsHistorySidebarOpen] = useState(false);
  const [selectedHistoryId, setSelectedHistoryId] = useState(
    workspace.history.length > 0 ? workspace.history[0].id : null
  );

  // 최근 히스토리에서 입력 텍스트와 AI 응답 추출
  const selectedHistory =
    workspace.history.find((history) => history.id === selectedHistoryId) ||
    null;
  const historyCount = workspace.history.length;

  // 히스토리 사이드바 토글 함수
  const toggleHistorySidebar = () => {
    setIsHistorySidebarOpen(!isHistorySidebarOpen);
  };

  const setOutputData = usePromptStore((state) => state.actions.setOutputData);
  const setLoadingState = usePromptStore(
    (state) => state.actions.setLoadingState
  );
  const router = useRouter();
  useEffect(() => {
    let eventSource: EventSource | null = null;
    if (selectedHistoryId) {
      const listenToHistory = (historyId: string) => {
        eventSource = new EventSource(
          `http://icehome.hopto.org:5005/events/${historyId}`
        );

        eventSource.onmessage = (event) => {
          const { status, response } = JSON.parse(event.data) as {
            response: string;
            status: string;
          };

          if (status === "COMPLETED" && response) {
            router.refresh();

            const aiResponse = JSON.parse(response) as AIResponse;
            setOutputData(aiResponse);
            // 서버 상태 최신화 - 히스토리 목록 갱신
          }

          if (status !== "PENDING") {
            eventSource?.close();
            setLoadingState("idle");
          }
        };

        eventSource.onerror = () => {
          console.error("SSE 연결 실패");
          eventSource?.close();
          setLoadingState("idle");
        };
      };

      listenToHistory(selectedHistoryId);
    }

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [selectedHistoryId, setOutputData, setLoadingState, router]);

  return (
    <div className={styles.container}>
      <Header onToggleHistory={toggleHistorySidebar} />

      <div className={styles.header}>
        <h1 className={styles.title}>{workspace.title}</h1>
      </div>

      <div className={styles.ioComponents}>
        <PromptInput
          workspaceId={workspace.id}
          savedInputText={selectedHistory ? selectedHistory.userRequest : ""}
          setSelectedHistoryId={setSelectedHistoryId}
        />
        <PromptOutput
          selectedHistory={selectedHistory}
          historyCount={historyCount}
        />
      </div>

      <Footer lastEditDate={new Date(workspace.updatedAt)} />

      {/* 히스토리 사이드바 */}
      <HistorySidebar
        history={workspace.history}
        isOpen={isHistorySidebarOpen}
        onClose={() => setIsHistorySidebarOpen(false)}
        selectedHistoryId={selectedHistoryId}
        setSelectedHistoryId={setSelectedHistoryId}
      />

      {/* 백그라운드 오버레이 */}
      {isHistorySidebarOpen && (
        <div
          className={styles.historyOverlay}
          onClick={() => setIsHistorySidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default ClientWorkspacePage;
