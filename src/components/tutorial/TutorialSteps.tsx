import React, { useCallback, useEffect, useState } from "react";
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

const TutorialSteps = ({ title, content, targetSelector }: Props) => {
  const [tooltipPosition, setTooltipPosition] = useState({
    top: `${-500}px`,
    left: `${-500}px`,
    arrowClass: "",
  });

  // 이전 타겟 선택자 저장
  // targetSelector가 변경됨으로 인해 -> position을 업데이트하기 전에 콘텐츠가 렌더링되지 않도록 하기 위함
  const [prevTargetSelector, setPrevTargetSelector] = useState<string | null>(
    null
  );

  // 하이라이트 대상이 준비되었을 때 말풍선 위치 조정
  const adjustTooltipPosition = useCallback(() => {
    if (targetSelector) {
      const target = document.querySelector(targetSelector);
      if (target) {
        const rect = target.getBoundingClientRect();

        // 화면 오른쪽에 공간이 있으면 요소 오른쪽에 말풍선 표시, 아니면 왼쪽에 표시
        const spaceOnRight = window.innerWidth - rect.right > 350;
        const tooltipLeft = spaceOnRight
          ? rect.right + 20
          : Math.max(10, rect.right - 300 - rect.width - 20);

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
        setPrevTargetSelector(targetSelector);
      }
    }
  }, [targetSelector]);

  // useEffect(() => {
  //   if (!targetSelector) {
  //     // 타겟 선택자가 없을 경우 초기 position 사용
  //     setTooltipPosition({
  //       top: `${position.top}px`,
  //       left: `${position.right}px`,
  //       arrowClass: "",
  //     });
  //   }
  // }, [targetSelector, position]);

  useEffect(() => {
    // 리사이즈 이벤트 리스너 등록
    window.addEventListener("resize", adjustTooltipPosition);

    // 클린업 함수
    return () => {
      window.removeEventListener("resize", adjustTooltipPosition);
    };
  }, [adjustTooltipPosition]);

  return (
    <>
      <HighlightTarget
        targetSelector={targetSelector || ""}
        active={!!targetSelector}
        onHighlightReady={adjustTooltipPosition}
      />
      {prevTargetSelector === targetSelector && (
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
      )}
    </>
  );
};

export default TutorialSteps;
