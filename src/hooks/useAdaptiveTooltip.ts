import { useState, useCallback } from "react";

interface TooltipPosition {
  top?: number;
  bottom?: number;
  left: number;
  transform: string;
  placement: "top" | "bottom";
}

interface UseAdaptiveTooltipProps {
  offset?: number;
}

export const useAdaptiveTooltip = ({
  offset = 15,
}: UseAdaptiveTooltipProps = {}) => {
  const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition>({
    left: 0,
    transform: "translateX(-50%)",
    placement: "top",
  });

  const calculatePosition = useCallback(
    (targetElement: HTMLElement): TooltipPosition => {
      const rect = targetElement.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const windowWidth = window.innerWidth;

      // 화면 세로 중점을 기준으로 상/하 결정
      const isUpperHalf = rect.top < windowHeight / 2;

      // 기본 left 위치 (요소 중앙)
      let left = rect.left + rect.width / 2;
      let transform = "translateX(-50%)";

      // 화면 양쪽 끝에서 툴팁이 잘리지 않도록 조정
      // 창 크기에 따라 툴팁 너비 조정
      const tooltipWidth = Math.min(400, windowWidth * 0.9); // 최대 400px, 또는 화면 너비의 90%
      const padding = 10;

      if (left - tooltipWidth / 2 < padding) {
        // 왼쪽에서 잘릴 경우
        left = rect.left;
        transform = "translateX(0)";
      } else if (left + tooltipWidth / 2 > windowWidth - padding) {
        // 오른쪽에서 잘릴 경우
        left = rect.right;
        transform = "translateX(-100%)";
      }

      if (isUpperHalf) {
        // 상단에 있으면 아래쪽에 툴팁 표시
        return {
          top: rect.bottom + offset,
          left,
          transform,
          placement: "bottom",
        };
      } else {
        // 하단에 있으면 위쪽에 툴팁 표시
        return {
          bottom: windowHeight - rect.top + offset,
          left,
          transform,
          placement: "top",
        };
      }
    },
    [offset]
  );

  const updateTooltipPosition = useCallback(
    (targetElement: HTMLElement) => {
      const position = calculatePosition(targetElement);
      setTooltipPosition(position);
    },
    [calculatePosition]
  );

  const handleMouseEnter = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      updateTooltipPosition(event.currentTarget);
    },
    [updateTooltipPosition]
  );

  return {
    tooltipPosition,
    updateTooltipPosition,
    handleMouseEnter,
  };
};
