"use client";
import React, { useEffect, useState, useRef } from "react";
import styles from "./page.module.css";

import PromptInput, { PromptInputHandle } from "./components/PromptInput";
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
  const promptInputRef = useRef<PromptInputHandle>(null);

  useEffect(() => {
    let eventSource: EventSource | null = null;
    if (selectedHistoryId) {
      const listenToHistory = (historyId: string) => {
        eventSource = new EventSource(
          `https://icehome.hopto.org/events/${historyId}`
        );

        eventSource.onmessage = (event) => {
          const { status, response } = JSON.parse(event.data) as {
            response: string;
            status: string;
          };

          if (status === "PROCESSING" && response) {
            const aiResponse = {
              id: -1,
              createdAt: new Date(),
              workspaceHistoryId: historyId,
              text: response,
            };
            setOutputData(aiResponse);
            setLoadingState("processing");
            // 서버 상태 최신화 - 히스토리 목록 갱신
          }

          if (status === "COMPLETED" && response) {
            const aiResponse = JSON.parse(response) as AIResponse;
            setOutputData(aiResponse);
            eventSource?.close();
            // 서버 상태 최신화 - 히스토리 목록 갱신
          }

          if (status === "ERROR") {
            setOutputData(null);
          }

          if (status !== "PENDING" && status !== "PROCESSING") {
            router.refresh();
            eventSource?.close();
            setLoadingState("idle");
          }
        };

        eventSource.onerror = (error) => {
          console.error("SSE 연결 실패", error);
          eventSource?.close();
          setLoadingState("networkError");
        };
      };

      listenToHistory(selectedHistoryId);
    }

    return () => {
      if (eventSource) {
        console.log("eventSource.close()");
        eventSource.close();
      }
    };
  }, [selectedHistoryId, setOutputData, setLoadingState, router]);

  // 교정 결과 적용 핸들러
  const handleApplyCorrections = (text: string) => {
    if (promptInputRef.current) {
      promptInputRef.current.setText(text);
    }
  };

  return (
    <div className={styles.container}>
      <Header onToggleHistory={toggleHistorySidebar} />

      <div className={styles.header}>
        <h1 className={styles.title}>{workspace.title}</h1>
      </div>

      <div className={styles.ioComponents}>
        <PromptInput
          ref={promptInputRef}
          workspaceId={workspace.id}
          savedInputText={selectedHistory ? selectedHistory.userRequest : ""}
          setSelectedHistoryId={setSelectedHistoryId}
          selectedHistory={selectedHistory}
        />
        <PromptOutput
          selectedHistory={selectedHistory}
          historyCount={historyCount}
          onApplyCorrections={handleApplyCorrections}
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
