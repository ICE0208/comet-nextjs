"use client";
import React, { useEffect } from "react";
import styles from "./PromptOutput.module.css";
import { usePromptStore } from "@/store/promptStore"; // Zustand 스토어 가져오기
import { getWorkspaceById } from "../actions";

type AIResponse = Awaited<
  ReturnType<typeof getWorkspaceById>
>["history"][0]["aiResponse"];

interface PromptOutputProps {
  savedAIResponse: AIResponse;
}

const PromptOutput = ({ savedAIResponse }: PromptOutputProps) => {
  const outputData = usePromptStore((state) => state.outputData);
  const isLoading = usePromptStore((state) => state.isLoading);
  const error = usePromptStore((state) => state.error);
  // const setLoading = usePromptStore((state) => state.actions.setLoading);
  // const setError = usePromptStore((state) => state.actions.setError);
  const setOutputData = usePromptStore((state) => state.actions.setOutputData);

  useEffect(
    () => () => {
      setOutputData(null);
    },
    [setOutputData]
  );

  useEffect(() => {
    if (savedAIResponse) {
      setOutputData(savedAIResponse);
    }
  }, [savedAIResponse, setOutputData]);

  return (
    <div className={styles.container}>
      <div className={styles.output}>
        {isLoading && (
          <p className={styles.loadingText}>데이터를 불러오는 중...</p>
        )}
        {!isLoading && error && <p className={styles.errorText}>{error}</p>}
        {!isLoading && !error && !outputData && (
          <p className={styles.emptyText}>아직 제출된 문장이 없습니다.</p>
        )}
        {!isLoading && !error && outputData && (
          <div className={styles.promptContent}>
            <h3 className={styles.promptTitle}>교열된 문장</h3>
            <div className={styles.promptText}>{outputData.text}</div>
            <div className={styles.promptMeta}>
              <p className={styles.promptTime}>
                {new Date(outputData.createdAt).toLocaleString("ko-KR")}
              </p>
              <div className={styles.promptOptions}>
                {outputData.details.map((detail) => (
                  <span
                    key={detail.id}
                    className={styles.optionTag}
                  >
                    {detail.type}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromptOutput;
