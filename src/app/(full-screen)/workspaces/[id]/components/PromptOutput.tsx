"use client";
import React, { useEffect, useState, useRef } from "react";
import styles from "./PromptOutput.module.css";
import { usePromptStore } from "@/store/promptStore"; // Zustand 스토어 가져오기
import { getWorkspaceById } from "../actions";
import { CorrectionData, ProcessLiteraryTextResult } from "@/utils/ai";
import { useRouter } from "next/navigation";
import useCheckTextStore from "@/store/checkTextStore";
import useChangedTextStore from "@/store/changedTextStore";
import CorrectedText from "./CorrectedText";
import { FiCheckCircle } from "react-icons/fi";

type WorkspaceHistory = Awaited<
  ReturnType<typeof getWorkspaceById>
>["history"][number];

interface PromptOutputProps {
  selectedHistory: WorkspaceHistory | null;
  historyCount: number;
}

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
  const setMultipleChangedTexts = useChangedTextStore(
    (state) => state.actions.setMultipleChangedTexts
  );
  const [ignoreChangedTexts, setIgnoreChangedTexts] = useState<Set<string>>(
    new Set()
  );
  const [changedTextCount, setChangedTextCount] = useState(0);

  // output 영역에 대한 ref 추가
  const outputRef = useRef<HTMLDivElement>(null);
  // correctionResult 영역에 대한 ref 추가
  const resultRef = useRef<HTMLDivElement>(null);

  // 컴포넌트 언마운트 시 정리 - PromptOutput 컴포넌트에서만 resetStore 호출
  useEffect(
    () => () => {
      // 컴포넌트 언마운트 시 스토어 전체 초기화
      usePromptStore.getState().actions.resetStore();
      useCheckTextStore.getState().actions.resetStore();
      useChangedTextStore.getState().actions.resetStore();
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
    // 부드러운 스크롤 실행
    setTimeout(() => {
      if (resultRef.current) {
        resultRef.current.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }

      if (outputRef.current) {
        outputRef.current.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    }, 100);

    setIgnoreChangedTexts(new Set());

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
    if (!outputData) {
      setCorrectionData(null);
      return;
    }

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

  // 데이터가 있고 교정 데이터가 파싱된 상태
  // 같은 문장이 여러 번 나왔을 때 몇 번째 순서인지 확인 할 수 있도록 순서를 부여
  // 0번째 순서부터 시작
  // texts 객체를 useMemo 내부로 이동하여 의존성 문제 해결
  const correctionDataWithOrder = React.useMemo(() => {
    const texts: { [key: string]: number } = {};
    let count = 0;

    return correctionData?.map((line) => {
      const segments = line.segments.map((segment) => {
        const text = segment.text;
        texts[text] = (texts[text] ?? -1) + 1;
        const order = texts[text];

        if (segment.correction) {
          count++;
        }

        return {
          ...segment,
          order,
        };
      });

      setChangedTextCount(count);
      return {
        segments,
      };
    });
  }, [correctionData]);

  // 교정 데이터가 있을 때 correction이 있는 텍스트들만 changedTextStore에 저장
  useEffect(() => {
    if (correctionDataWithOrder && correctionDataWithOrder.length > 0) {
      // 모든 세그먼트에서 correction이 있는 것들만 수집
      const allCorrections = correctionDataWithOrder.flatMap((line) =>
        line.segments
          .filter((segment) => segment.correction)
          .map((segment) => ({
            text: segment.correction?.before || segment.text,
            textOrder: segment.order,
          }))
      );

      // 한번에 저장
      setMultipleChangedTexts(allCorrections);
    } else {
      setMultipleChangedTexts([]);
    }
  }, [correctionDataWithOrder, setMultipleChangedTexts]);

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
        <div
          ref={resultRef}
          className={styles.correctionResult}
        >
          {correctionDataWithOrder?.map((line, idx) => (
            <div
              key={idx}
              className={styles.correctionLine}
              style={{ wordSpacing: "normal", letterSpacing: "-0.02em" }}
            >
              {line.segments.map((segment, i) => (
                <span key={i}>
                  <CorrectedText
                    segment={segment}
                    setIgnoreChangedTexts={setIgnoreChangedTexts}
                    ignoreChangedTexts={ignoreChangedTexts}
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

        <div className={styles.bottomContainer}>
          <p className={styles.promptTime}>
            {loadingState === "processing"
              ? "교정 데이터를 처리하는 중입니다..."
              : new Date(outputData.createdAt).toLocaleString("ko-KR")}
          </p>
          <div
            className={styles.buttonContainer}
            style={
              ignoreChangedTexts.size === changedTextCount ||
              loadingState === "processing"
                ? { opacity: 0.5 }
                : {}
            }
          >
            <button>
              <FiCheckCircle style={{ marginRight: "8px" }} />
              {ignoreChangedTexts.size === 0
                ? "전부 반영하기"
                : `부분 반영하기 (${changedTextCount - ignoreChangedTexts.size}/${changedTextCount})`}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div
        ref={outputRef}
        className={styles.output}
      >
        {renderContent()}
      </div>
    </div>
  );
};

export default PromptOutput;
