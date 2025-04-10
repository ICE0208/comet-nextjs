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

interface ScrollState {
  bestsellerAutoScrollInterval?: NodeJS.Timeout;
  bestsellerAutoScrollTimeout?: NodeJS.Timeout;
}

// 베스트셀러 viewCount 기준으로 정렬
const sortNovelsByViewCount = (novels: Novel[]): Novel[] =>
  [...novels].sort((a, b) => b.viewCount - a.viewCount);

// 인터벌과 타임아웃 ID를 저장하기 위한 싱글톤 객체 생성
const scrollState: ScrollState = {};

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

    // 3초마다 자동 스크롤
    const interval = setInterval(() => {
      if (scrollContainer) {
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
      }
    }, 3000);

    // 사용자가 캐러셀과 상호작용할 때 자동 스크롤 일시 중지
    const pauseAutoScroll = () => {
      clearInterval(interval);

      // 기존 타임아웃이 있다면 정리
      if (scrollState.bestsellerAutoScrollTimeout) {
        clearTimeout(scrollState.bestsellerAutoScrollTimeout);
      }
      if (scrollState.bestsellerAutoScrollInterval) {
        clearInterval(scrollState.bestsellerAutoScrollInterval);
      }
    };

    // 자동 스크롤 재개
    const resumeAutoScroll = () => {
      // 기존 인터벌이나 타임아웃이 있다면 정리
      if (scrollState.bestsellerAutoScrollInterval) {
        clearInterval(scrollState.bestsellerAutoScrollInterval);
      }

      // 새로운 인터벌 생성
      const newInterval = setInterval(() => {
        if (scrollContainer) {
          const maxScrollLeft =
            scrollContainer.scrollWidth - scrollContainer.clientWidth;
          let nextScrollPosition = scrollContainer.scrollLeft + cardWidth;
          if (nextScrollPosition >= maxScrollLeft) {
            nextScrollPosition = 0;
          }
          scrollContainer.scrollTo({
            left: nextScrollPosition,
            behavior: "smooth",
          });
        }
      }, 3000);

      // 새 인터벌 ID를 타입이 지정된 변수에 저장
      scrollState.bestsellerAutoScrollInterval = newInterval;
    };

    // 마우스가 들어오면 자동 스크롤 멈춤
    const handleMouseEnter = () => {
      pauseAutoScroll();
    };

    // 마우스가 나가면 자동 스크롤 재개
    const handleMouseLeave = () => {
      resumeAutoScroll();
    };

    scrollContainer.addEventListener("mouseenter", handleMouseEnter);
    scrollContainer.addEventListener("mouseleave", handleMouseLeave);

    // 컴포넌트 언마운트 시 이벤트 리스너와 인터벌 정리
    return () => {
      clearInterval(interval);
      if (scrollState.bestsellerAutoScrollTimeout) {
        clearTimeout(scrollState.bestsellerAutoScrollTimeout);
      }
      if (scrollState.bestsellerAutoScrollInterval) {
        clearInterval(scrollState.bestsellerAutoScrollInterval);
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
          {sortedNovels.map((novel, index) => (
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
