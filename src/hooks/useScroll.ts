import { useState, useEffect } from "react";

/**
 * 스크롤 위치를 감지하는 커스텀 훅
 * @param threshold 스크롤 임계값 (기본값: 100px)
 * @returns 임계값 이상 스크롤 되었는지 여부
 */
export function useScroll(threshold = 100) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > threshold);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [threshold]);

  return isScrolled;
}
