import React, { useState, useRef } from "react";
import styles from "./CorrectedText.module.css";
import { Segment } from "@/utils/ai";
import useCheckTextStore from "@/store/checkTextStore";
import useIgnoreChangedTextStore from "@/store/ignoreChangedTextStore";
import { useAdaptiveTooltip } from "@/hooks/useAdaptiveTooltip";

interface CorrectedTextProps {
  segment: Segment & { order: number };
}

// 교정된 텍스트 컴포넌트
const CorrectedText = ({ segment }: CorrectedTextProps) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const textRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const { tooltipPosition, handleMouseEnter } = useAdaptiveTooltip({
    offset: 15,
  });

  const setTargetText = useCheckTextStore(
    (state) => state.actions.setTargetText
  );
  const setTextOrder = useCheckTextStore((state) => state.actions.setTextOrder);

  const ignoreChangedTexts = useIgnoreChangedTextStore(
    (state) => state.ignoreChangedTexts
  );
  const addIgnoreChangedText = useIgnoreChangedTextStore(
    (state) => state.actions.addIgnoreChangedText
  );
  const removeIgnoreChangedText = useIgnoreChangedTextStore(
    (state) => state.actions.removeIgnoreChangedText
  );

  if (!segment.correction) {
    return <span className={styles.normalText}>{segment.text}</span>;
  }

  const handleMouseEnterText = (event: React.MouseEvent<HTMLSpanElement>) => {
    const originalText = segment.correction?.before;
    if (!originalText) return;

    setTargetText(originalText);
    setTextOrder(segment.order);
    handleMouseEnter(event);
    setShowTooltip(true);
  };

  const handleIgnoreChangedText = () => {
    const textWithOrder = JSON.stringify([
      segment.correction?.before || segment.text,
      segment.order,
    ]);
    addIgnoreChangedText(textWithOrder);
  };

  const handleCancelIgnoreChangedText = () => {
    const textWithOrder = JSON.stringify([
      segment.correction?.before || segment.text,
      segment.order,
    ]);
    removeIgnoreChangedText(textWithOrder);
  };

  const tooltipStyle = {
    position: "fixed" as const,
    left: tooltipPosition.left,
    transform: tooltipPosition.transform,
    zIndex: 9999,
    ...(tooltipPosition.placement === "top"
      ? { bottom: tooltipPosition.bottom }
      : { top: tooltipPosition.top }),
  };

  return (
    <div
      className={`${styles.correctionContainer} ${
        ignoreChangedTexts.has(
          JSON.stringify([
            segment.correction?.before || segment.text,
            segment.order,
          ])
        )
          ? styles.ignoredCorrectionContainer
          : ""
      }`}
    >
      <span
        ref={textRef}
        className={`${styles.correctedText} ${
          ignoreChangedTexts.has(
            JSON.stringify([
              segment.correction?.before || segment.text,
              segment.order,
            ])
          )
            ? styles.ignoreChangedText
            : ""
        }`}
        onMouseEnter={handleMouseEnterText}
        onMouseLeave={() => {
          setShowTooltip(false);
          setTargetText("");
          setTextOrder(0);
        }}
      >
        {ignoreChangedTexts.has(
          JSON.stringify([
            segment.correction?.before || segment.text,
            segment.order,
          ])
        )
          ? segment.correction.before
          : segment.text}
        {showTooltip &&
          !ignoreChangedTexts.has(
            JSON.stringify([
              segment.correction?.before || segment.text,
              segment.order,
            ])
          ) && (
            <div
              ref={tooltipRef}
              className={`${styles.tooltipContainer} ${
                tooltipPosition.placement === "bottom"
                  ? styles.tooltipBottom
                  : styles.tooltipTop
              }`}
              style={tooltipStyle}
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
                <div
                  className={`${styles.tooltipArrow} ${
                    tooltipPosition.placement === "bottom"
                      ? styles.arrowTop
                      : styles.arrowBottom
                  }`}
                />
              </div>
            </div>
          )}
      </span>

      <div className={styles.buttonWrapper}>
        {ignoreChangedTexts.has(
          JSON.stringify([
            segment.correction?.before || segment.text,
            segment.order,
          ])
        ) ? (
          <button
            className={styles.actionButton}
            onClick={() => handleCancelIgnoreChangedText()}
          >
            <span className={styles.buttonIcon}>↺</span>
            반영 적용하기
          </button>
        ) : (
          <button
            className={styles.ignoreButton}
            onClick={() => handleIgnoreChangedText()}
          >
            <span className={styles.buttonIcon}>✕</span>
            반영 무시하기
          </button>
        )}
      </div>
    </div>
  );
};

export default CorrectedText;
