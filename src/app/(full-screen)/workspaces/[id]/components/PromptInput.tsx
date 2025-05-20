"use client";
import React, { useState, useEffect } from "react";
import styles from "./PromptInput.module.css";
import { usePromptStore } from "@/store/promptStore";
import { submitWork } from "../actions";

interface PromptInputProps {
  workspaceId: string;
  savedInputText: string;
  setSelectedHistoryId: (historyId: string) => void;
}

const PromptInput = ({
  workspaceId,
  savedInputText: savedText,
  setSelectedHistoryId,
}: PromptInputProps) => {
  const [text, setText] = useState<string>(savedText);
  const setLoadingState = usePromptStore(
    (state) => state.actions.setLoadingState
  );
  const setOutputData = usePromptStore((state) => state.actions.setOutputData);
  const loadingState = usePromptStore((state) => state.loadingState);

  useEffect(() => {
    if (savedText) {
      setText(savedText);
    }
  }, [savedText]);

  // 컴포넌트 마운트 시 로딩 상태 확인 (디버깅용)
  useEffect(() => {
    console.log("PromptInput 마운트 시 로딩 상태:", loadingState);
  }, [loadingState]);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  // const listenToHistory = (historyId: string) => {
  //   const eventSource = new EventSource(
  //     `http://localhost:5005/events/${historyId}`
  //   );

  //   eventSource.onmessage = (event) => {
  //     const { status, response } = JSON.parse(event.data) as {
  //       response: string;
  //       status: string;
  //     };

  //     if (status === "COMPLETED" && response) {
  //       const aiResponse = JSON.parse(response) as AIResponse;
  //       setOutputData(aiResponse);
  //     }

  //     if (status !== "PENDING") {
  //       eventSource.close();
  //       setLoadingState("idle");
  //     }
  //   };

  //   eventSource.onerror = () => {
  //     console.error("SSE 연결 실패");
  //     eventSource.close();
  //     setLoadingState("idle");
  //   };
  // };

  const handleSubmit = async () => {
    if (!text.trim() || loadingState !== "idle") return;

    try {
      setLoadingState("correctionLoading");

      const historyId = await submitWork(workspaceId, text);

      setSelectedHistoryId(historyId);
      // listenToHistory(historyId); // ← SSE 연결
    } catch (error) {
      alert("텍스트 교정 중 오류가 발생했습니다.");
      console.error("Submission error:", error);
      setOutputData(null);
      setLoadingState("idle");
    }
  };

  // 버튼 비활성화 로직 - loadingState가 idle이 아니면 비활성화
  const isDisabled = loadingState !== "idle" || !text.trim();

  return (
    <div className={styles.container}>
      <textarea
        name="inp"
        id="in"
        className={styles.textarea}
        value={text}
        onChange={handleTextareaChange}
        placeholder="교정할 텍스트를 입력해주세요..."
        disabled={loadingState !== "idle"}
        required
      />
      <div className={styles.checkboxContainer}>
        <button
          className={`${styles.submitButton} ${loadingState === "correctionLoading" ? styles.submitting : ""}`}
          onClick={handleSubmit}
          disabled={isDisabled}
        >
          {loadingState === "correctionLoading" ? "교정 중..." : "교정하기"}
        </button>
      </div>
    </div>
  );
};

export default PromptInput;
