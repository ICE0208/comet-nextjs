import React, { useState, useRef } from "react";
import styles from "./CorrectedText.module.css";
import { Segment } from "@/utils/ai";
import useCheckTextStore from "@/store/checkTextStore";

interface CorrectedTextProps {
  segment: Segment & { order: number };
}

// 교정된 텍스트 컴포넌트
const CorrectedText = ({ segment }: CorrectedTextProps) => {
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
    const originalText = segment.correction?.before ?? segment.text;
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
    </div>
  );
};

export default CorrectedText;
