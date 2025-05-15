"use client";
import React, { useEffect, useState, useRef } from "react";
import styles from "./PromptOutput.module.css";
import { usePromptStore } from "@/store/promptStore"; // Zustand 스토어 가져오기
import { getWorkspaceById } from "../actions";
import {
  CorrectionData,
  CorrectionLine,
  Segment,
  ProcessLiteraryTextResult,
} from "@/utils/ai";
import { useRouter } from "next/navigation";

type AIResponse = Awaited<
  ReturnType<typeof getWorkspaceById>
>["history"][0]["aiResponse"];

interface PromptOutputProps {
  savedAIResponse: AIResponse;
}

// 교정된 텍스트 컴포넌트 분리
const CorrectedText = ({ segment }: { segment: Segment }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const textRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  if (!segment.correction) {
    return <span>{segment.text}</span>;
  }

  const handleMouseEnter = () => {
    if (textRef.current) {
      const rect = textRef.current.getBoundingClientRect();
      setTooltipPosition({
        top: rect.top, // 텍스트 상단 위치
        left: rect.left + rect.width / 2,
      });
    }
    setShowTooltip(true);
  };

  return (
    <span
      ref={textRef}
      className={styles.correctedText}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {segment.text}
      {showTooltip && (
        <div
          ref={tooltipRef}
          className={styles.tooltipContainer}
          style={{
            position: "fixed",
            left: tooltipPosition.left,
            transform: "translateX(-50%)",
            zIndex: 9999,
            bottom: `calc(100vh - ${tooltipPosition.top}px + 15px)`,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              color: "#333",
              fontSize: "0.875rem",
              fontWeight: "normal",
              padding: "0.75rem 1rem",
              borderRadius: "6px",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.15)",
              whiteSpace: "normal",
              textAlign: "left",
              position: "relative",
              maxWidth: "300px",
              lineHeight: "1.5",
            }}
          >
            <div style={{ marginBottom: "6px" }}>
              <strong style={{ color: "#111" }}>원문:</strong>
              <span style={{ color: "#666" }}>{segment.correction.before}</span>
            </div>
            <div>
              <strong style={{ color: "#111" }}>이유:</strong>
              <span style={{ color: "#666" }}>{segment.correction.reason}</span>
            </div>
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: "50%",
                transform: "translateX(-50%)",
                borderWidth: "8px",
                borderStyle: "solid",
                borderColor: "white transparent transparent transparent",
                filter: "drop-shadow(0 2px 2px rgba(0, 0, 0, 0.1))",
              }}
            />
          </div>
        </div>
      )}
    </span>
  );
};

const PromptOutput = ({ savedAIResponse }: PromptOutputProps) => {
  const outputData = usePromptStore((state) => state.outputData);
  const isLoading = usePromptStore((state) => state.isLoading);
  const error = usePromptStore((state) => state.error);
  const setOutputData = usePromptStore((state) => state.actions.setOutputData);
  const router = useRouter();
  const [correctionData, setCorrectionData] = useState<CorrectionData | null>(
    null
  );

  // 컴포넌트 언마운트 시 정리
  useEffect(
    () => () => {
      setOutputData(null);
    },
    [setOutputData]
  );

  // 저장된 응답 데이터 설정
  useEffect(() => {
    if (savedAIResponse) {
      setOutputData(savedAIResponse);
    }
  }, [savedAIResponse, setOutputData]);

  // 응답 데이터 파싱
  useEffect(() => {
    if (!outputData) return;

    try {
      // AIResponse에서 텍스트를 파싱하여 ProcessLiteraryTextResult 형태로 변환
      const parsedResult = JSON.parse(
        outputData.text
      ) as ProcessLiteraryTextResult;

      // data 필드에 실제 교정 데이터가 있음
      if (parsedResult.data) {
        setCorrectionData(parsedResult.data);
      } else {
        throw new Error("교정 데이터가 없습니다.");
      }
    } catch (e) {
      console.error("Failed to parse AI response:", e);
      alert(
        "해당 워크스페이스 데이터가 손상되었습니다. 관리자에게 문의하세요."
      );
      router.push("/workspaces");
    }
  }, [outputData, router]);

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

            {correctionData && Array.isArray(correctionData) ? (
              <div className={styles.correctionResult}>
                {correctionData.map((line: CorrectionLine, idx: number) => (
                  <div
                    key={idx}
                    className={styles.correctionLine}
                  >
                    {line.segments.map((segment: Segment, i: number) => (
                      <CorrectedText
                        key={i}
                        segment={segment}
                      />
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.promptText}>
                {outputData.text && !correctionData && (
                  <p>데이터를 처리하는 중입니다...</p>
                )}
              </div>
            )}

            <div className={styles.promptMeta}>
              <p className={styles.promptTime}>
                {new Date(outputData.createdAt).toLocaleString("ko-KR")}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromptOutput;
