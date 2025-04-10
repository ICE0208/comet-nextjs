"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./BestsellerRow.module.css";

type Novel = {
  id: string;
  title: string;
  author: string;
  description: string;
  thumbnail: string;
  genre: string;
  viewCount: number;
  rating: number;
};

interface BestsellerRowProps {
  novels: Novel[];
}

// 베스트셀러 viewCount 기준으로 정렬
const sortNovelsByViewCount = (novels: Novel[]): Novel[] =>
  [...novels].sort((a, b) => b.viewCount - a.viewCount);

// 인터벌 ID 저장할 변수
let intervalState: NodeJS.Timeout;

const BestsellerRow: React.FC<BestsellerRowProps> = ({ novels }) => {
  // viewCount 기준으로 소설 정렬
  const sortedNovels = sortNovelsByViewCount(novels);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    let cardWidth = 0;
    const firstCard = scrollContainer.querySelector(`.${styles.novelCard}`);
    if (firstCard) {
      // 카드의 너비와 마진/간격을 포함한 전체 너비 계산
      cardWidth = firstCard.getBoundingClientRect().width + 16; // 16px는 간격
    }

    // 스크롤 로직을 함수로 추출하여 중복 제거
    const scrollToNextItem = () => {
      if (!scrollContainer) return;

      const maxScrollLeft =
        scrollContainer.scrollWidth - scrollContainer.clientWidth;

      // 다음 스크롤 위치 계산
      let nextScrollPosition = scrollContainer.scrollLeft + cardWidth;

      // 끝에 도달하면 처음으로 돌아가기
      if (nextScrollPosition >= maxScrollLeft) {
        nextScrollPosition = 0;
      }

      // 부드러운 애니메이션으로 다음 위치로 스크롤
      scrollContainer.scrollTo({
        left: nextScrollPosition,
        behavior: "smooth",
      });
    };

    // 사용자가 캐러셀과 상호작용할 때 자동 스크롤 일시 중지
    const pauseAutoScroll = () => {
      // 기존 타임아웃이 있다면 정리
      if (intervalState) {
        clearInterval(intervalState);
      }
    };

    // 자동 스크롤 시작
    const playAutoScroll = () => {
      // 기존 인터벌이나 타임아웃이 있다면 정리
      if (intervalState) {
        clearInterval(intervalState);
      }

      // 새로운 인터벌 생성
      const newInterval = setInterval(scrollToNextItem, 3000);

      // 새 인터벌 ID를 타입이 지정된 변수에 저장
      intervalState = newInterval;
    };

    // 마우스가 들어오면 자동 스크롤 멈춤
    const handleMouseEnter = () => {
      pauseAutoScroll();
    };

    // 마우스가 나가면 자동 스크롤 재개
    const handleMouseLeave = () => {
      playAutoScroll();
    };

    scrollContainer.addEventListener("mouseenter", handleMouseEnter);
    scrollContainer.addEventListener("mouseleave", handleMouseLeave);

    // 처음 렌더링 시 자동 스크롤 시작!
    playAutoScroll();

    // 컴포넌트 언마운트 시 이벤트 리스너와 인터벌 정리
    return () => {
      if (intervalState) {
        clearInterval(intervalState);
      }
      scrollContainer.removeEventListener("mouseenter", handleMouseEnter);
      scrollContainer.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.sectionTitle}>
        <span className={styles.highlightText}>베스트셀러</span>
      </h2>

      <div
        className={styles.scrollContainer}
        ref={scrollContainerRef}
      >
        <div className={styles.row}>
          {sortedNovels.slice(0, 10).map((novel, index) => (
            <Link
              href={`/novel/${novel.id}`}
              key={novel.id}
              className={styles.novelCard}
            >
              <div className={styles.rankBadge}>{index + 1}</div>
              <div className={styles.imageWrapper}>
                <Image
                  src={novel.thumbnail}
                  alt={novel.title}
                  width={180}
                  height={270}
                  className={styles.image}
                  priority={index < 3} // Prioritize loading first 3 items
                />
                <div className={styles.overlay}>
                  <div className={styles.overlayContent}>
                    <h3 className={styles.title}>{novel.title}</h3>
                    <p className={styles.author}>{novel.author}</p>
                    {novel.rating && (
                      <div className={styles.rating}>
                        <span className={styles.starIcon}>★</span>{" "}
                        {novel.rating.toFixed(1)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BestsellerRow;
