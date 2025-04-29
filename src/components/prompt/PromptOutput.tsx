"use client";
import React, { useEffect, useState } from "react";
import styles from "./PromptOutput.module.css";

interface PromptOutputProps {
  refreshTrigger?: number;
}

type PromptOptionType = {
  id: number;
  optionId: string;
  optionName: string;
  isSelected: boolean;
};

type PromptType = {
  id: number;
  text: string;
  createdAt: string;
  options: PromptOptionType[];
};

const PromptOutput = ({ refreshTrigger = 0 }: PromptOutputProps) => {
  const [latestPrompt, setLatestPrompt] = useState<PromptType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestPrompt = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/prompts");
        if (!response.ok) {
          throw new Error("Failed to fetch prompts");
        }
        const data = await response.json();
        const prompts = data.prompts || [];

        // 가장 최근에 추가된 프롬프트 (배열의 첫 번째 항목)
        setLatestPrompt(prompts.length > 0 ? prompts[0] : null);
      } catch {
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestPrompt();
  }, [refreshTrigger]);

  return (
    <div className={styles.container}>
      <div className={styles.output}>
        {isLoading && (
          <p className={styles.loadingText}>데이터를 불러오는 중...</p>
        )}
        {!isLoading && error && <p className={styles.errorText}>{error}</p>}
        {!isLoading && !error && !latestPrompt && (
          <p className={styles.emptyText}>아직 제출된 프롬프트가 없습니다.</p>
        )}
        {!isLoading && !error && latestPrompt && (
          <div className={styles.promptContent}>
            <h3 className={styles.promptTitle}>최근 추가된 프롬프트</h3>
            <div className={styles.promptText}>{latestPrompt.text}</div>
            <div className={styles.promptMeta}>
              <p className={styles.promptTime}>
                {new Date(latestPrompt.createdAt).toLocaleString("ko-KR")}
              </p>
              <div className={styles.promptOptions}>
                {latestPrompt.options
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
