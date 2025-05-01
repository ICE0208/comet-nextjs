"use client";
import React, { useEffect } from "react";
import styles from "./PromptOutput.module.css";
import { usePromptStore } from "@/store/promptStore"; // Zustand 스토어 가져오기

interface PromptOutputProps {
  refreshTrigger?: number;
}

const PromptOutput = ({ refreshTrigger = 0 }: PromptOutputProps) => {
  const outputData = usePromptStore((state) => state.outputData);
  const isLoading = usePromptStore((state) => state.isLoading);
  const error = usePromptStore((state) => state.error);
  const setLoading = usePromptStore((state) => state.actions.setLoading);
  const setError = usePromptStore((state) => state.actions.setError);
  const setOutputData = usePromptStore((state) => state.actions.setOutputData);

  useEffect(() => {
    const fetchLatestPrompt = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/prompts");
        if (!response.ok) {
          throw new Error("Failed to fetch prompts");
        }
        const data = await response.json();
        const prompts = data.prompts || [];

        // 가장 최근에 추가된 프롬프트 (배열의 첫 번째 항목)를 스토어의 outputData로 업데이트
        setOutputData(prompts.length > 0 ? prompts[0] : null);
      } catch {
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchLatestPrompt();
  }, [refreshTrigger, setLoading, setError, setOutputData]);

  return (
    <div className={styles.container}>
      <div className={styles.output}>
        {isLoading && (
          <p className={styles.loadingText}>데이터를 불러오는 중...</p>
        )}
        {!isLoading && error && <p className={styles.errorText}>{error}</p>}
        {!isLoading && !error && !outputData && (
          <p className={styles.emptyText}>아직 제출된 프롬프트가 없습니다.</p>
        )}
        {!isLoading && !error && outputData && (
          <div className={styles.promptContent}>
            <h3 className={styles.promptTitle}>최근 추가된 프롬프트</h3>
            <div className={styles.promptText}>{outputData.text}</div>
            <div className={styles.promptMeta}>
              <p className={styles.promptTime}>
                {new Date(outputData.createdAt).toLocaleString("ko-KR")}
              </p>
              <div className={styles.promptOptions}>
                {outputData.options
                  .filter((option) => option.isSelected)
                  .map((option) => (
                    <span
                      key={option.id}
                      className={styles.optionTag}
                    >
                      {option.optionName}
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
