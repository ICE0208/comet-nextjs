import React, { useEffect, useState, useRef } from "react";
import styles from "./HighlightTarget.module.css";

interface HighlightTargetProps {
  targetSelector: string;
  active: boolean;
  onHighlightReady?: () => void;
}

const HighlightTarget: React.FC<HighlightTargetProps> = ({
  targetSelector,
  active,
  onHighlightReady,
}) => {
  // 콜백이 이미 호출되었는지 추적하기 위한 ref
  const highlightReadyCalledRef = useRef(false);

  const [position, setPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });

  // targetSelector 또는 active 상태가 변경될 때 ref를 재설정
  useEffect(() => {
    highlightReadyCalledRef.current = false;
  }, [targetSelector, active]);

  // 위치 업데이트 로직
  useEffect(() => {
    if (!active || !targetSelector) return;

    const updatePosition = () => {
      const target = document.querySelector(targetSelector);
      if (!target) return;

      const rect = target.getBoundingClientRect();
      setPosition({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });

      // 위치가 업데이트되고 콜백이 아직 호출되지 않았을 때 콜백 실행
      if (
        rect.width > 0 &&
        rect.height > 0 &&
        onHighlightReady &&
        !highlightReadyCalledRef.current
      ) {
        highlightReadyCalledRef.current = true;
        onHighlightReady();
      }
    };

    // 초기 업데이트
    updatePosition();

    // 리사이즈 이벤트 리스너 등록
    window.addEventListener("resize", updatePosition);

    // 클린업 함수
    return () => {
      window.removeEventListener("resize", updatePosition);
    };
  }, [targetSelector, active, onHighlightReady]);

  if (!active || !targetSelector) {
    return null;
  }

  return (
    <div
      className={styles.highlightOverlay}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        width: `${position.width}px`,
        height: `${position.height}px`,
      }}
    />
  );
};

export default HighlightTarget;
