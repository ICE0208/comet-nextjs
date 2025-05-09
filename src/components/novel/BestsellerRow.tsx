"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./BestsellerRow.module.css";

type NovelResponse = {
  novels: {
    id: string;
    title: string;
    imageUrl: string;
    author: {
      userId: string;
    };
    _count: {
      novelLike: number;
    };
  }[];
};

// 인터벌 ID 저장할 변수
let intervalState: NodeJS.Timeout;

const BestsellerRow = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [sortedNovels, setSortedNovels] = useState<NovelResponse["novels"]>([]);

  useEffect(() => {
    // API를 통해 소설 데이터 가져오기
    const getNovels = async () => {
      try {
        const response = await fetch("/api/novel/topten");
        const data: NovelResponse = await response.json();
        setSortedNovels(data.novels);
      } catch (error) {
        return error;
      }
    };

    getNovels();

    // 나머지 스크롤 로직은 데이터 가져오기와 별도로 실행
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    let cardWidth = 0;

    const setupCardWidth = () => {
      const firstCard = scrollContainer.querySelector(`.${styles.novelCard}`);
      if (firstCard) {
        // 카드의 너비와 마진/간격을 포함한 전체 너비 계산
        cardWidth = firstCard.getBoundingClientRect().width + 16; // 16px는 간격
      } else {
        // 카드가 아직 렌더링되지 않았다면 기본값 설정
        cardWidth = 300 + 16; // 기본 카드 너비 + 간격
      }
    };

    // 초기 카드 너비 설정
    setupCardWidth();

    // 스크롤 로직을 함수로 추출하여 중복 제거
    const scrollToNextItem = () => {
      if (!scrollContainer) return;

      // 카드 요소가 추가된 후 너비를 다시 확인
      if (cardWidth === 0) {
        setupCardWidth();
      }

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
          {sortedNovels.map((novel, index) => (
            <Link
              href={`/novel/${novel.id}`}
              key={novel.id}
              className={styles.novelCard}
            >
              <div className={styles.rankBadge}>{index + 1}</div>
              <div className={styles.imageWrapper}>
                <Image
                  src={novel.imageUrl}
                  alt={novel.title}
                  width={180}
                  height={270}
                  className={styles.image}
                  priority={index < 3} // Prioritize loading first 3 items
                />
                <div className={styles.overlay}>
                  <div className={styles.overlayContent}>
                    <h3 className={styles.title}>{novel.title}</h3>
                    <p className={styles.author}>{novel.author.userId}</p>
                    {/* {novel.rating && ( */}
                    <div className={styles.rating}>
                      <span className={styles.starIcon}>★</span>{" "}
                      {/* {novel.rating.toFixed(1)} */}
                      {4.5} {/* 임시로 고정된 값 */}
                    </div>
                    {/* )} */}
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
