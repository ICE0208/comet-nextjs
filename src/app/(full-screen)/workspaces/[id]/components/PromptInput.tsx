"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./PromptInput.module.css";
import { usePromptStore } from "@/store/promptStore";
import { submitWork } from "../actions";
import useCheckTextStore from "@/store/checkTextStore";
import { RichTextarea } from "rich-textarea";

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
  const targetText = useCheckTextStore((state) => state.targetText);
  const textOrder = useCheckTextStore((state) => state.textOrder);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (savedText) {
      setText(savedText);
    }
  }, [savedText]);

  // 텍스트 하이라이트를 위한 로직 - useCallback으로 감싸기
  const getHighlights = useCallback(() => {
    if (!targetText || !targetText.trim()) {
      return [];
    }

    // 정규식 특수 문자 이스케이프
    const escapeRegExp = (string: string) =>
      string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // 개행 문자와 공백을 더 유연하게 처리하는 정규식
    const searchPattern = escapeRegExp(targetText).replace(/\s+/g, "\\s+"); // 공백 시퀀스를 유연하게 매치

    const regex = new RegExp(searchPattern, "g");

    // 모든 매칭되는 위치 찾기
    const highlights: { start: number; end: number }[] = [];
    let match;
    let count = 0;

    // 정규식으로 모든 매치 찾기
    while ((match = regex.exec(text)) !== null) {
      const start = match.index;
      const end = start + match[0].length;

      // 정확한 텍스트 순서 확인
      if (textOrder === null || count === textOrder) {
        highlights.push({
          start,
          end,
        });

        // textOrder가 null이 아니면 정확히 일치하는 항목만 찾기
        if (textOrder !== null) {
          break;
        }
      }

      count++;
    }

    // 정규식 매치가 실패하면 원래 방식으로 시도
    if (highlights.length === 0) {
      let currentPos = 0;
      count = 0;

      while (currentPos < text.length) {
        const foundPos = text.indexOf(targetText, currentPos);
        if (foundPos === -1) break;

        // 정확한 텍스트 순서 확인
        if (textOrder === null || count === textOrder) {
          highlights.push({
            start: foundPos,
            end: foundPos + targetText.length,
          });

          // textOrder가 null이 아니면 정확히 일치하는 항목만 찾기
          if (textOrder !== null) break;
        }

        count++;
        currentPos = foundPos + 1; // 겹치는 매칭을 피하기 위해 1만 증가
      }
    }

    return highlights;
  }, [targetText, textOrder, text]); // 의존성 배열 추가

  // 하이라이트 스타일 설정 - 최소한의 스타일만 인라인으로 적용
  const highlightStyle = {
    backgroundColor: "rgba(99, 102, 241, 0.3)",
    display: "inline",
    position: "relative" as const,
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleSubmit = async () => {
    if (!text.trim() || loadingState !== "idle") return;
    setOutputData(null);

    try {
      setLoadingState("correctionLoading");

      const historyId = await submitWork(workspaceId, text);

      setSelectedHistoryId(historyId);
    } catch (error) {
      alert("텍스트 교정 중 오류가 발생했습니다.");
      console.error("Submission error:", error);
      setLoadingState("idle");
    }
  };

  // RichTextarea 렌더러 함수
  const renderHighlights = (value: string) => {
    if (!targetText || !targetText.trim() || !value) {
      return value;
    }

    const highlights = getHighlights();
    if (highlights.length === 0) {
      return value;
    }

    const result: React.ReactNode[] = [];
    let lastIndex = 0;

    highlights.forEach(({ start, end }) => {
      // 하이라이트 전 텍스트
      if (start > lastIndex) {
        result.push(
          <span key={`text-${lastIndex}`}>{value.slice(lastIndex, start)}</span>
        );
      }

      // 하이라이트된 텍스트 - 스타일은 CSS 모듈에서 정의
      result.push(
        <span
          key={`highlight-${start}`}
          style={highlightStyle}
          className="highlight-text"
        >
          {value.slice(start, end)}
        </span>
      );

      lastIndex = end;
    });

    // 마지막 하이라이트 이후 텍스트
    if (lastIndex < value.length) {
      result.push(
        <span key={`text-${lastIndex}`}>{value.slice(lastIndex)}</span>
      );
    }

    return result;
  };

  // 스크롤 위치 조정
  useEffect(() => {
    if (!targetText.trim()) return;

    // DOM이 완전히 렌더링된 후 실행
    requestAnimationFrame(() => {
      try {
        // 에디터 컨테이너 접근
        const wrapper = document.querySelector(`.${styles.textareaWrapper}`);
        if (!wrapper) return;

        // 실제 textarea 요소 찾기
        const textareaElement = wrapper.querySelector(
          "textarea"
        ) as HTMLTextAreaElement;
        if (!textareaElement) return;

        const highlights = getHighlights();
        if (highlights.length === 0) return;

        const { start } = highlights[0];

        // 정확한 텍스트 위치 계산을 위한 임시 요소
        const tempTextarea = document.createElement("textarea");
        tempTextarea.style.width = textareaElement.offsetWidth + "px";
        tempTextarea.style.height = "auto";
        tempTextarea.style.position = "absolute";
        tempTextarea.style.left = "-9999px";
        tempTextarea.style.top = "-9999px";
        tempTextarea.style.whiteSpace = "pre-wrap";
        tempTextarea.style.wordBreak =
          window.getComputedStyle(textareaElement).wordBreak;
        tempTextarea.style.font = window.getComputedStyle(textareaElement).font;
        tempTextarea.style.lineHeight =
          window.getComputedStyle(textareaElement).lineHeight;
        tempTextarea.style.padding =
          window.getComputedStyle(textareaElement).padding;
        tempTextarea.value = text.substring(0, start);

        document.body.appendChild(tempTextarea);
        const targetTop = tempTextarea.scrollHeight;
        document.body.removeChild(tempTextarea);

        // 선택된 텍스트가 화면의 정확히 중앙에 오도록 스크롤 조정
        // 추가 여백을 두어 더 자연스럽게 보이도록 함
        const scrollPosition = Math.max(
          0,
          targetTop - textareaElement.clientHeight * 0.45
        );

        // 현재 스크롤 위치 저장
        const savedScrollTop = textareaElement.scrollTop;

        // 스크롤 거리가 너무 작으면 애니메이션 생략
        if (Math.abs(scrollPosition - savedScrollTop) < 50) {
          textareaElement.scrollTop = scrollPosition;
          return;
        }

        // 스크롤 애니메이션
        let startTime: number | null = null;
        const duration = 600; // 애니메이션 지속 시간 늘림

        function animate(timestamp: number) {
          if (!startTime) startTime = timestamp;
          const elapsed = timestamp - startTime;
          const progress = Math.min(elapsed / duration, 1);

          // 이징 함수 (easeInOutQuad) 적용 - 더 부드러운 시작과 끝
          const easeProgress =
            progress < 0.5
              ? 2 * progress * progress
              : 1 - Math.pow(-2 * progress + 2, 2) / 2;

          textareaElement.scrollTop =
            savedScrollTop + (scrollPosition - savedScrollTop) * easeProgress;

          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        }

        requestAnimationFrame(animate);
      } catch (error) {
        console.error("Error in scroll handling:", error);
      }
    });
  }, [targetText, textOrder, text, styles.textareaWrapper, getHighlights]);

  // 버튼 비활성화 로직 - loadingState가 idle이 아니면 비활성화
  const isDisabled = loadingState !== "idle" || !text.trim();

  return (
    <div className={styles.container}>
      <div className={styles.textareaWrapper}>
        <RichTextarea
          ref={textareaRef}
          value={text}
          onChange={handleTextareaChange}
          placeholder="교정할 텍스트를 입력해주세요..."
          disabled={loadingState !== "idle"}
          className={styles.textarea}
          style={{
            width: "100%",
            height: "100%",
            minHeight: "400px",
            padding: "1rem",
            border: "1px solid #e4e9f0",
            borderRadius: "12px",
            backgroundColor: "transparent",
            resize: "none",
            fontSize: "1rem",
            lineHeight: 1.6,
            whiteSpace: "pre-wrap",
            overflowY: "auto",
            fontFamily: "inherit",
            position: "relative",
            wordBreak: "break-word",
            boxSizing: "border-box",
          }}
          required
        >
          {renderHighlights}
        </RichTextarea>
      </div>
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
