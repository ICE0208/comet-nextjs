import React, { useEffect, useState } from "react";
import styles from "./TutorialSteps.module.css";
import HighlightTarget from "./HighlightTarget";

export type TutorialStep = {
  title: string;
  content: string;
  step: number;
  position: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  targetSelector?: string; // 하이라이트할 요소의 CSS 선택자
};

type Props = TutorialStep & {
  // 네비게이션 버튼이 하단에 고정되므로 여기선 필요없음
};

const TutorialSteps = ({ title, content, position, targetSelector }: Props) => {
  const [tooltipPosition, setTooltipPosition] = useState({
    top: `${position.top}px`,
    left: `${position.right}px`,
    arrowClass: "",
  });

  // 하이라이트 대상이 준비되었을 때 말풍선 위치 조정
  const adjustTooltipPosition = () => {
    if (targetSelector) {
      const target = document.querySelector(targetSelector);
      if (target) {
        const rect = target.getBoundingClientRect();

        // 화면 오른쪽에 공간이 있으면 요소 오른쪽에 말풍선 표시, 아니면 왼쪽에 표시
        const spaceOnRight = window.innerWidth - rect.right > 350;
        const tooltipLeft = spaceOnRight
          ? rect.right + 20
          : Math.max(10, rect.right - 420);

        // 말풍선 화살표 방향 결정
        const arrowClass = spaceOnRight ? styles.arrowLeft : styles.arrowRight;

        // 상하 위치 계산 - 가능하면 중앙에 맞춤
        const tooltipTop = Math.max(
          10,
          rect.top + rect.height / 2 - 80 // tooltip 높이의 절반 정도로 조정
        );

        setTooltipPosition({
          top: `${tooltipTop}px`,
          left: `${tooltipLeft}px`,
          arrowClass,
        });
      }
    }
  };

  useEffect(() => {
    if (!targetSelector) {
      // 타겟 선택자가 없을 경우 초기 position 사용
      setTooltipPosition({
        top: `${position.top}px`,
        left: `${position.right}px`,
        arrowClass: "",
      });
    }
  }, [targetSelector, position]);

  return (
    <>
      <HighlightTarget
        targetSelector={targetSelector || ""}
        active={!!targetSelector}
        onHighlightReady={adjustTooltipPosition}
      />
      <div
        className={`${styles.container} ${tooltipPosition.arrowClass}`}
        style={{
          top: tooltipPosition.top,
          left: tooltipPosition.left,
        }}
      >
        <h3>{title}</h3>
        <p>{content}</p>
      </div>
    </>
  );
};

export default TutorialSteps;
