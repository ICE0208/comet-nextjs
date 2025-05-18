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
  const setOutputData = usePromptStore((state) => state.actions.setOutputData);
  const setLoadingState = usePromptStore(
    (state) => state.actions.setLoadingState
  );
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

  const handleSubmit = async () => {
    console.log("현재 로딩 상태:", loadingState); // 디버깅용

    // idle 상태일 때만 교정 요청을 허용
    if (!text.trim() || loadingState !== "idle") {
      console.log("교정 요청 무시됨: 텍스트가 비어있거나 로딩 중");
      return;
    }

    try {
      setLoadingState("correctionLoading");

      const newHistory = await submitWork(workspaceId, text);

      setOutputData(newHistory.aiResponse);
      setSelectedHistoryId(newHistory.id);
    } catch (error) {
      alert("텍스트 교정 중 오류가 발생했습니다. 다시 시도해주세요.");
      console.error("Submission error:", error);
    } finally {
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
