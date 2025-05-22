"use client";
import React, { useState, useEffect, useRef } from "react";
import styles from "./PromptInput.module.css";
import { usePromptStore } from "@/store/promptStore";
import { submitWork } from "../actions";
import useCheckTextStore from "@/store/checkTextStore";

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
  const highlighterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (savedText) {
      setText(savedText);
    }
  }, [savedText]);

  // 컴포넌트 마운트 시 로딩 상태 확인 (디버깅용)
  useEffect(() => {
    console.log("PromptInput 마운트 시 로딩 상태:", loadingState);
  }, [loadingState]);

  useEffect(() => {
    const textarea = textareaRef.current;
    const highlighter = highlighterRef.current;
    if (!textarea || !highlighter) return;

    // 하이라이터 스타일 정확히 동기화
    highlighter.style.width = `${textarea.clientWidth + 4}px`;
    highlighter.style.height = `${textarea.clientHeight}px`;
    highlighter.style.padding = window.getComputedStyle(textarea).padding;
    highlighter.style.border = window.getComputedStyle(textarea).border;
    highlighter.style.borderColor = "transparent"; // 테두리는 투명하게
    highlighter.style.boxSizing = "border-box";
    highlighter.style.lineHeight = window.getComputedStyle(textarea).lineHeight;
    highlighter.style.fontFamily = window.getComputedStyle(textarea).fontFamily;
    highlighter.style.fontSize = window.getComputedStyle(textarea).fontSize;

    // 텍스트 내용 복사 및 하이라이트 적용
    if (!targetText.trim()) {
      // targetText가 비어있으면 하이라이트 제거
      highlighter.innerHTML = "";
      return;
    }

    const textContent = textarea.value;
    let foundIndex = -1;

    // targetText의 n번째 위치 찾기 (textOrder는 0부터 시작)
    // 정확한 단어 경계를 확인하여 일치하는 텍스트 찾기
    const findExactTextOccurrence = (
      text: string,
      searchText: string,
      order: number
    ): number => {
      // 정규식을 사용하여 단어 경계를 고려한 검색
      // 단어 경계는 공백, 줄바꿈, 문장 부호 등으로 구분
      const pattern = new RegExp(
        `(^|[\\s\\n.,;!?])${escapeRegExp(searchText)}([\\s\\n.,;!?]|$)`,
        "g"
      );
      pattern.lastIndex = 0; // 검색 시작 위치 초기화

      let count = 0;
      let match;
      while ((match = pattern.exec(text)) !== null) {
        // 정확한 시작 위치 계산 (매치된 단어 경계를 제외한 실제 텍스트 위치)
        const exactStart = match.index + match[1].length;

        if (count === order) {
          return exactStart;
        }

        count++;
        // 다음 검색을 위해 lastIndex 조정 (중복 매치 방지)
        pattern.lastIndex = exactStart + searchText.length;
      }

      // 정규식으로 찾지 못한 경우 단순 indexOf로 시도
      if (count === 0) {
        let fallbackIndex = 0;
        let fallbackCount = 0;

        while (fallbackCount <= order) {
          const index = text.indexOf(searchText, fallbackIndex);
          if (index === -1) break;

          if (fallbackCount === order) {
            return index;
          }

          fallbackIndex = index + searchText.length;
          fallbackCount++;
        }
      }

      return -1; // 찾지 못한 경우
    };

    // 정규식 특수문자 이스케이프 함수
    const escapeRegExp = (string: string): string =>
      string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // 정확한 위치 찾기
    foundIndex = findExactTextOccurrence(textContent, targetText, textOrder);

    if (foundIndex !== -1) {
      // 현재 스크롤 위치 저장
      const savedScrollTop = textarea.scrollTop;

      // 선택된 텍스트의 위치 계산을 위한 임시 텍스트 생성
      const textBeforeTarget = textContent.substring(0, foundIndex);

      // 임시 textarea 생성 및 스타일 복사
      const tempTextarea = document.createElement("textarea");
      tempTextarea.style.width = textarea.offsetWidth + "px";
      tempTextarea.style.height = "auto";
      tempTextarea.style.position = "absolute";
      tempTextarea.style.left = "-9999px";
      tempTextarea.style.top = "-9999px";
      tempTextarea.style.whiteSpace = "pre-wrap";
      tempTextarea.style.wordBreak =
        window.getComputedStyle(textarea).wordBreak;
      tempTextarea.style.font = window.getComputedStyle(textarea).font;
      tempTextarea.style.lineHeight =
        window.getComputedStyle(textarea).lineHeight;
      tempTextarea.style.padding = window.getComputedStyle(textarea).padding;
      tempTextarea.value = textBeforeTarget;

      document.body.appendChild(tempTextarea);
      const targetTop = tempTextarea.scrollHeight;
      document.body.removeChild(tempTextarea);

      // 선택된 텍스트가 화면의 40% 지점에 오도록 스크롤 조정
      const scrollPosition = Math.max(
        0,
        targetTop - textarea.clientHeight * 0.4
      );

      // 줄바꿈과 공백을 보존하기 위해 HTML 엔티티로 변환
      const formatText = (text: string) =>
        text
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/\n/g, "<br>")
          .replace(/ /g, "&nbsp;")
          .replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;");

      // 대상 줄의 시작과 끝 인덱스 계산
      const linesBeforeTarget = textBeforeTarget.split("\n");
      const targetLineIndex = linesBeforeTarget.length - 1;
      const allLines = textContent.split("\n");

      // 각 줄의 시작 인덱스 계산
      const lineStartIndices = [0];
      let currentLineStart = 0;
      for (let i = 0; i < textContent.length; i++) {
        if (textContent[i] === "\n") {
          currentLineStart = i + 1;
          lineStartIndices.push(currentLineStart);
        }
      }

      // 대상 줄의 시작과 끝 인덱스
      const targetLineStart = lineStartIndices[targetLineIndex];
      const targetLineEnd =
        targetLineIndex < allLines.length - 1
          ? lineStartIndices[targetLineIndex + 1] - 1
          : textContent.length;

      // 전체 HTML 생성
      let html = "";

      // 대상 줄 이전의 텍스트
      if (targetLineStart > 0) {
        html += formatText(textContent.substring(0, targetLineStart));
      }

      // 대상 줄 (세로선 표시)
      html += `<div class="${styles.lineIndicator}">`;
      html += formatText(textContent.substring(targetLineStart, targetLineEnd));
      html += "</div>";

      // 대상 줄 이후의 텍스트
      if (targetLineEnd < textContent.length) {
        html += formatText(textContent.substring(targetLineEnd));
      }

      // 하이라이터에 HTML 적용
      highlighter.innerHTML = html;

      // 스크롤 위치 조정을 위한 함수
      let startTime: number | null = null;
      const duration = 300;

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // 더 빠른 easeOutQuad 이징 함수
        const easeProgress = 1 - (1 - progress) * (1 - progress);

        // 현재 저장된 스크롤 위치에서 목표 위치로 부드럽게 이동
        textarea.scrollTop =
          savedScrollTop + (scrollPosition - savedScrollTop) * easeProgress;
        // 하이라이터도 같은 스크롤 위치로 설정
        highlighter.scrollTop = textarea.scrollTop;

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      // 애니메이션 시작
      requestAnimationFrame(animate);
    }
  }, [targetText, textOrder, text]);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  // textarea 스크롤 시 하이라이터도 같이 스크롤되도록 처리
  const handleScroll = () => {
    if (highlighterRef.current && textareaRef.current) {
      highlighterRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const handleSubmit = async () => {
    if (!text.trim() || loadingState !== "idle") return;

    try {
      setLoadingState("correctionLoading");

      const historyId = await submitWork(workspaceId, text);

      setSelectedHistoryId(historyId);
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
      <div className={styles.textareaWrapper}>
        <textarea
          ref={textareaRef}
          name="inp"
          id="in"
          className={styles.textarea}
          value={text}
          onChange={handleTextareaChange}
          onScroll={handleScroll}
          placeholder="교정할 텍스트를 입력해주세요..."
          disabled={loadingState !== "idle"}
          required
        />
        <div
          ref={highlighterRef}
          className={styles.highlighter}
        />
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
