"use client";
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import styles from "./PromptInput.module.css";
import { usePromptStore } from "@/store/promptStore";
import { submitWork } from "../actions";
import useCheckTextStore from "@/store/checkTextStore";
import { RichTextarea } from "rich-textarea";
import useChangedTextStore from "@/store/changedTextStore";
import { getWorkspaceById } from "../actions";
import { FaSpellCheck } from "react-icons/fa";

type WorkspaceHistory = Awaited<
  ReturnType<typeof getWorkspaceById>
>["history"][number];

interface PromptInputProps {
  workspaceId: string;
  savedInputText: string;
  setSelectedHistoryId: (historyId: string) => void;
  selectedHistory?: WorkspaceHistory | null;
}

export interface PromptInputHandle {
  setText: (text: string) => void;
}

const PromptInput = forwardRef<PromptInputHandle, PromptInputProps>(
  (
    {
      workspaceId,
      savedInputText: savedText,
      setSelectedHistoryId,
      selectedHistory,
    },
    ref
  ) => {
    const [text, setText] = useState<string>(savedText);
    const [isPro, setIsPro] = useState<boolean>(false);
    const setLoadingState = usePromptStore(
      (state) => state.actions.setLoadingState
    );
    const setOutputData = usePromptStore(
      (state) => state.actions.setOutputData
    );
    const loadingState = usePromptStore((state) => state.loadingState);
    const targetText = useCheckTextStore((state) => state.targetText);
    const textOrder = useCheckTextStore((state) => state.textOrder);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const changedText = useChangedTextStore((state) => state.changedText);

    useEffect(() => {
      if (savedText) {
        setText(savedText);
      }
    }, [savedText]);

    // selectedHistory가 바뀔 때 스크롤을 맨 위로 이동
    useEffect(() => {
      if (selectedHistory) {
        requestAnimationFrame(() => {
          const wrapper = document.querySelector(`.${styles.textareaWrapper}`);
          const textareaElement = wrapper?.querySelector(
            "textarea"
          ) as HTMLTextAreaElement;

          if (textareaElement) {
            textareaElement.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }
        });
      }
    }, [selectedHistory, styles.textareaWrapper]);

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
    }, [targetText, textOrder, text]);

    // 변경된 텍스트의 하이라이트를 위한 별도 로직
    const getChangedHighlights = useCallback(() => {
      if (!changedText || changedText.length === 0) {
        return [];
      }

      const highlights: { start: number; end: number; isMatching: boolean }[] =
        [];

      // changedText 항목 하나씩 처리
      for (const item of changedText) {
        if (!item.text || !item.text.trim()) continue;

        // 이 항목이 현재 targetText와 동일한지 확인 (보라색으로 표시할지 여부)
        const isMatching =
          item.text === targetText && item.textOrder === textOrder;

        // 해당 텍스트 찾기
        let currentPos = 0;
        let count = 0;

        while (currentPos < text.length) {
          const foundPos = text.indexOf(item.text, currentPos);
          if (foundPos === -1) break;

          // 정확한 텍스트 순서 확인
          if (count === item.textOrder) {
            highlights.push({
              start: foundPos,
              end: foundPos + item.text.length,
              isMatching,
            });
            break;
          }

          count++;
          currentPos = foundPos + 1;
        }
      }

      return highlights;
    }, [changedText, text, targetText, textOrder]);

    // 하이라이트 스타일 설정 - 최소한의 스타일만 인라인으로 적용
    const highlightStyle = {
      backgroundColor: "rgba(99, 102, 241, 0.3)",
      display: "inline",
      position: "relative" as const,
    };

    const changedHighlightStyle = {
      backgroundColor: "rgba(239, 68, 68, 0.2)",
      display: "inline",
      position: "relative" as const,
    };

    const handleTextareaChange = (
      e: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
      setText(e.target.value);
    };

    const handleSubmit = async () => {
      if (!text.trim() || loadingState !== "idle") return;

      // Pro 모드일 때 관리자 문의 메시지 표시
      if (isPro) {
        alert("프로모드를 이용하기 위해서는 관리자에게 문의주세요");
        return;
      }

      setOutputData(null);

      try {
        setLoadingState("correctionLoading");
        useChangedTextStore.getState().actions.resetStore();

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
      if (!value) return value;

      // 두 하이라이트 배열을 모두 가져옴
      const targetHighlights =
        !targetText || !targetText.trim() ? [] : getHighlights();
      const changedHighlights = getChangedHighlights();

      // 하이라이트가 없으면 그대로 반환
      if (targetHighlights.length === 0 && changedHighlights.length === 0) {
        return value;
      }

      // 모든 하이라이트 경계점 수집
      const boundaries = new Set<number>();
      boundaries.add(0);
      boundaries.add(value.length);

      // target highlights 경계점 추가
      targetHighlights.forEach(({ start, end }) => {
        boundaries.add(start);
        boundaries.add(end);
      });

      // changed highlights 경계점 추가
      changedHighlights.forEach(({ start, end }) => {
        boundaries.add(start);
        boundaries.add(end);
      });

      // 경계점을 정렬된 배열로 변환
      const sortedBoundaries = Array.from(boundaries).sort((a, b) => a - b);

      const result: React.ReactNode[] = [];

      // 각 세그먼트 처리
      for (let i = 0; i < sortedBoundaries.length - 1; i++) {
        const start = sortedBoundaries[i];
        const end = sortedBoundaries[i + 1];
        const segmentText = value.slice(start, end);

        if (segmentText.length === 0) continue;

        // 이 세그먼트가 어떤 하이라이트에 속하는지 확인
        const isTarget = targetHighlights.some(
          ({ start: hStart, end: hEnd }) => start >= hStart && end <= hEnd
        );

        const changedHighlight = changedHighlights.find(
          ({ start: hStart, end: hEnd }) => start >= hStart && end <= hEnd
        );
        const isChanged = changedHighlight && !changedHighlight.isMatching;

        if (isTarget) {
          // target 하이라이트 (보라색 - 최우선)
          result.push(
            <span
              key={`highlight-target-${start}-${end}`}
              style={highlightStyle}
              className="highlight-text"
            >
              {segmentText}
            </span>
          );
        } else if (isChanged) {
          // changed 하이라이트 (빨간색)
          result.push(
            <span
              key={`highlight-changed-${start}-${end}`}
              style={changedHighlightStyle}
              className="highlight-text-changed"
            >
              {segmentText}
            </span>
          );
        } else {
          // 일반 텍스트
          result.push(<span key={`text-${start}-${end}`}>{segmentText}</span>);
        }
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
          tempTextarea.style.font =
            window.getComputedStyle(textareaElement).font;
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

    // ref를 통해 setText 함수 노출
    useImperativeHandle(ref, () => ({
      setText,
    }));

    return (
      <div className={styles.container}>
        <div className={styles.inputArea}>
          <div className={styles.inputTitleContainer}>
            <div className={styles.inputTitle}>소설 입력</div>
          </div>
          <div className={styles.inputContent}>
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
                  border: "none",
                  borderRadius: "0",
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
            <div className={styles.bottomContainer}>
              <div className={styles.buttonContainer}>
                {/* Pro 모드 토글 */}
                <div className={styles.proToggleContainer}>
                  <span className={styles.proToggleLabel}>Pro 모드</span>
                  <button
                    className={`${styles.proToggle} ${isPro ? styles.proToggleActive : ""}`}
                    onClick={() => setIsPro(!isPro)}
                    disabled={loadingState !== "idle"}
                  >
                    <div className={styles.proToggleSlider} />
                  </button>
                </div>

                <button
                  className={`${styles.submitButton} ${loadingState === "correctionLoading" || loadingState === "processing" ? styles.submitting : ""}`}
                  onClick={handleSubmit}
                  disabled={isDisabled}
                >
                  <FaSpellCheck style={{ marginRight: "0.4rem" }} />
                  {loadingState === "correctionLoading" ||
                  loadingState === "processing"
                    ? "교정 중..."
                    : "교정하기"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

PromptInput.displayName = "PromptInput";

export default PromptInput;
