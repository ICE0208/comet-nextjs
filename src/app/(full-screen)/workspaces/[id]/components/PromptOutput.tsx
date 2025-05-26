"use client";
import React, { useEffect, useState, useRef } from "react";
import styles from "./PromptOutput.module.css";
import { usePromptStore } from "@/store/promptStore"; // Zustand 스토어 가져오기
import { getWorkspaceById } from "../actions";
import { CorrectionData, Segment, ProcessLiteraryTextResult } from "@/utils/ai";
import { useRouter } from "next/navigation";
import useCheckTextStore from "@/store/checkTextStore";

type WorkspaceHistory = Awaited<
  ReturnType<typeof getWorkspaceById>
>["history"][number];

interface PromptOutputProps {
  selectedHistory: WorkspaceHistory | null;
  historyCount: number;
}

// 교정된 텍스트 컴포넌트 분리
const CorrectedText = ({
  segment,
}: {
  segment: Segment & { order: number };
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const textRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const setTargetText = useCheckTextStore(
    (state) => state.actions.setTargetText
  );
  const setTextOrder = useCheckTextStore((state) => state.actions.setTextOrder);

  if (!segment.correction) {
    return (
      <span style={{ wordSpacing: "normal", margin: "0 0.2em" }}>
        {segment.text}
      </span>
    );
  }

  const handleMouseEnter = () => {
    const originalText = segment.correction?.before ?? segment.text;
    setTargetText(originalText);
    setTextOrder(segment.order);
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
    <div>
      <span
        ref={textRef}
        className={styles.correctedText}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => {
          setShowTooltip(false);
          setTargetText("");
          setTextOrder(0);
        }}
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
                wordSpacing: "normal",
              }}
            >
              <div style={{ marginBottom: "6px" }}>
                <strong style={{ color: "#111" }}>원문:</strong>
                <span style={{ color: "#666" }}>
                  {segment.correction.before}
                </span>
              </div>
              <div>
                <strong style={{ color: "#111" }}>이유:</strong>
                <span style={{ color: "#666" }}>
                  {segment.correction.reason}
                </span>
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
    </div>
  );
};

const PromptOutput = ({ selectedHistory, historyCount }: PromptOutputProps) => {
  const outputData = usePromptStore((state) => state.outputData);
  const loadingState = usePromptStore((state) => state.loadingState);
  const error = usePromptStore((state) => state.error);
  const setOutputData = usePromptStore((state) => state.actions.setOutputData);
  const setLoadingState = usePromptStore(
    (state) => state.actions.setLoadingState
  );
  const router = useRouter();
  const [correctionData, setCorrectionData] = useState<CorrectionData | null>(
    null
  );

  // 컴포넌트 언마운트 시 정리 - PromptOutput 컴포넌트에서만 resetStore 호출
  useEffect(
    () => () => {
      // 컴포넌트 언마운트 시 스토어 전체 초기화
      usePromptStore.getState().actions.resetStore();
      useCheckTextStore.getState().actions.resetStore();
    },
    []
  );

  useEffect(() => {
    if (historyCount === 0) {
      setLoadingState("idle");
    }
  }, [historyCount, setLoadingState]);

  // 저장된 응답 데이터 설정
  useEffect(() => {
    if (!selectedHistory) {
      return;
    }

    if (selectedHistory.status === "COMPLETED") {
      setOutputData(selectedHistory.aiResponse);
      setLoadingState("idle");
    } else if (selectedHistory.status === "PENDING") {
      setLoadingState("correctionLoading");
    } else if (selectedHistory.status === "ERROR") {
      setOutputData(null);
      setLoadingState("idle");
    }
  }, [selectedHistory, setOutputData, setLoadingState]);

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

  // loadingState에 따른 UI 표시를 처리하는 함수
  const renderContent = () => {
    // 에러 상태
    if (error) {
      return <p className={styles.errorText}>{error}</p>;
    }

    // 초기 로딩 상태 (페이지 첫 로드)
    if (loadingState === "initialLoading") {
      return (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingIndicator}>
            <div className={styles.loadingCircle} />
            <p className={styles.loadingText}>데이터를 불러오는 중입니다...</p>
          </div>
        </div>
      );
    }

    // 교정 요청 로딩 상태
    if (loadingState === "correctionLoading") {
      return (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingIndicator}>
            <div className={styles.correctionLoadingAnimation}>
              <span />
              <span />
              <span />
              <span />
            </div>
            <p className={styles.loadingText}>텍스트를 교정하는 중입니다...</p>
            <p className={styles.loadingSubtext}>잠시만 기다려주세요</p>
          </div>
        </div>
      );
    }

    if (!outputData) {
      if (historyCount === 0) {
        return <p className={styles.emptyText}>아직 제출된 문장이 없습니다.</p>;
      }

      return <p className={styles.errorText}>교열에 실패하였습니다.</p>;
    }

    // 데이터가 있지만 교정 데이터가 아직 파싱되지 않은 상태
    if (!correctionData || !Array.isArray(correctionData)) {
      return (
        <div className={styles.promptText}>
          <p>데이터를 처리하는 중입니다...</p>
        </div>
      );
    }

    if (loadingState === "processing" && correctionData.length === 0) {
      return (
        <div className={styles.promptText}>
          <p>교정 데이터를 처리하는 중입니다...</p>
        </div>
      );
    }

    // 데이터가 있고 교정 데이터가 파싱된 상태
    // 같은 문장이 여러 번 나왔을 때 몇 번째 순서인지 확인 할 수 있도록 순서를 부여
    // 0번째 순서부터 시작
    const texts: { [key: string]: number } = {};
    const correctionDataWithOrder = correctionData.map((line) => {
      const segments = line.segments.map((segment) => {
        const text = segment.text;
        texts[text] = (texts[text] ?? -1) + 1;
        const order = texts[text];
        return {
          ...segment,
          order,
        };
      });
      return {
        segments,
      };
    });

    return (
      <div className={styles.promptContent}>
        <div className={styles.promptTitleContainer}>
          <h3 className={styles.promptTitle}>교정된 문장</h3>
          <p className={styles.promptSubtitle}>
            {loadingState === "processing" && "응답 받아오는 중..."}
          </p>
          {loadingState === "processing" && (
            <div className={styles.loadingAnimation} />
          )}
        </div>
        <div className={styles.correctionResult}>
          {correctionDataWithOrder.map((line, idx) => (
            <div
              key={idx}
              className={styles.correctionLine}
              style={{ wordSpacing: "normal", letterSpacing: "-0.02em" }}
            >
              {line.segments.map((segment, i) => (
                <span key={i}>
                  <CorrectedText
                    key={i}
                    segment={segment}
                  />
                </span>
              ))}
            </div>
          ))}
          {loadingState === "processing" && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                height: "40px",
              }}
            >
              <div className={styles.loadingAnimationBig} />
            </div>
          )}
        </div>

        <div className={styles.promptMeta}>
          <p className={styles.promptTime}>
            {new Date(outputData.createdAt).toLocaleString("ko-KR")}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.output}>{renderContent()}</div>
    </div>
  );
};

export default PromptOutput;
