import React, { useState, useRef } from "react";
import styles from "./CorrectedText.module.css";
import { Segment } from "@/utils/ai";
import useCheckTextStore from "@/store/checkTextStore";

interface CorrectedTextProps {
  segment: Segment & { order: number };
  setIgnoreChangedTexts: React.Dispatch<React.SetStateAction<Set<string>>>;
  ignoreChangedTexts: Set<string>;
}

// 교정된 텍스트 컴포넌트
const CorrectedText = ({
  segment,
  setIgnoreChangedTexts,
  ignoreChangedTexts,
}: CorrectedTextProps) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const textRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const setTargetText = useCheckTextStore(
    (state) => state.actions.setTargetText
  );
  const setTextOrder = useCheckTextStore((state) => state.actions.setTextOrder);

  if (!segment.correction) {
    return <span className={styles.normalText}>{segment.text}</span>;
  }

  const handleMouseEnter = () => {
    const originalText = segment.correction?.before;
    if (!originalText) return;

    setTargetText(originalText);
    setTextOrder(segment.order);
    if (textRef.current) {
      const rect = textRef.current.getBoundingClientRect();
      setTooltipPosition({
        top: rect.top,
        left: rect.left + rect.width / 2,
      });
    }
    setShowTooltip(true);
  };

  const handleIgnoreChangedText = () => {
    setIgnoreChangedTexts((prev) => {
      const newSet = new Set(prev);
      const textWithOrder = JSON.stringify([segment.text, segment.order]);
      newSet.add(textWithOrder);
      return newSet;
    });
  };

  const handleCancelIgnoreChangedText = () => {
    setIgnoreChangedTexts((prev) => {
      const newSet = new Set(prev);
      const textWithOrder = JSON.stringify([segment.text, segment.order]);
      newSet.delete(textWithOrder);
      return newSet;
    });
  };

  return (
    <div
      className={`${styles.correctionContainer} ${
        ignoreChangedTexts.has(JSON.stringify([segment.text, segment.order]))
          ? styles.ignoredCorrectionContainer
          : ""
      }`}
    >
      <span
        ref={textRef}
        className={`${styles.correctedText} ${
          ignoreChangedTexts.has(JSON.stringify([segment.text, segment.order]))
            ? styles.ignoreChangedText
            : ""
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => {
          setShowTooltip(false);
          setTargetText("");
          setTextOrder(0);
        }}
      >
        {ignoreChangedTexts.has(JSON.stringify([segment.text, segment.order]))
          ? segment.correction.before
          : segment.text}
        {showTooltip &&
          !ignoreChangedTexts.has(
            JSON.stringify([segment.text, segment.order])
          ) && (
            <div
              ref={tooltipRef}
              className={styles.tooltipContainer}
              style={{
                left: tooltipPosition.left,
                bottom: `calc(100vh - ${tooltipPosition.top}px + 15px)`,
              }}
            >
              <div className={styles.tooltipContent}>
                <div className={styles.tooltipItem}>
                  <strong>원문:</strong>
                  <span>{segment.correction.before}</span>
                </div>
                <div className={styles.tooltipItem}>
                  <strong>이유:</strong>
                  <span>{segment.correction.reason}</span>
                </div>
                <div className={styles.tooltipArrow} />
              </div>
            </div>
          )}
      </span>

      <div className={styles.buttonWrapper}>
        {ignoreChangedTexts.has(
          JSON.stringify([segment.text, segment.order])
        ) ? (
          <button
            className={styles.actionButton}
            onClick={() => handleCancelIgnoreChangedText()}
          >
            <span className={styles.buttonIcon}>↺</span>
            교정 적용하기
          </button>
        ) : (
          <button
            className={styles.ignoreButton}
            onClick={() => handleIgnoreChangedText()}
          >
            <span className={styles.buttonIcon}>✕</span>
            교정 무시하기
          </button>
        )}
      </div>
    </div>
  );
};

export default CorrectedText;
