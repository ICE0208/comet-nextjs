import { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface PortalProps {
  children: ReactNode;
  containerId?: string;
}

const ReactPortal = ({
  children,
  containerId = "portal-root",
}: PortalProps) => {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    let element = document.getElementById(containerId);
    // layout에 해당 ID의 요소가 없으면 새로 생성
    if (!element) {
      element = document.createElement("div");
      element.id = containerId;
      document.body.appendChild(element);
    }
    setContainer(element);

    // 컴포넌트 언마운트 시 포털 요소 제거
    return () => {
      if (element && element.parentNode) {
        element.parentNode.removeChild(element);
      }
    };
  }, [containerId]);

  if (!container) return null;

  return createPortal(children, container);
};

export default ReactPortal;
