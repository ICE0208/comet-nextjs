"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./BestsellerRow.module.css";

type Novel = {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  rating?: number;
  genre?: string;
  description?: string;
};

interface BestsellerRowProps {
  novels: Novel[];
}

interface ScrollState {
  bestsellerAutoScrollInterval?: NodeJS.Timeout;
  bestsellerAutoScrollTimeout?: NodeJS.Timeout;
}

// Create a singleton object to store interval and timeout IDs
const scrollState: ScrollState = {};

const BestsellerRow: React.FC<BestsellerRowProps> = ({ novels }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    let cardWidth = 0;
    const firstCard = scrollContainer.querySelector(`.${styles.novelCard}`);
    if (firstCard) {
      // Get the width of a card plus its margin/gap
      cardWidth = firstCard.getBoundingClientRect().width + 16; // 16px for the gap
    }

    // Auto-scroll every 3 seconds
    const interval = setInterval(() => {
      if (scrollContainer) {
        const maxScrollLeft =
          scrollContainer.scrollWidth - scrollContainer.clientWidth;

        // Calculate the next scroll position
        let nextScrollPosition = scrollContainer.scrollLeft + cardWidth;

        // If we're at the end, reset to the beginning
        if (nextScrollPosition >= maxScrollLeft) {
          nextScrollPosition = 0;
        }

        // Scroll to the next position with smooth animation
        scrollContainer.scrollTo({
          left: nextScrollPosition,
          behavior: "smooth",
        });
      }
    }, 3000);

    // Pause auto-scroll when user interacts with the carousel
    const handleInteraction = () => {
      clearInterval(interval);

      // Resume auto-scroll after 5 seconds of inactivity
      const timeout = setTimeout(() => {
        // We need to recreate the interval
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

        // Store the new interval ID in a properly typed variable
        scrollState.bestsellerAutoScrollInterval = newInterval;
      }, 5000);

      // Store the timeout ID for cleanup
      scrollState.bestsellerAutoScrollTimeout = timeout;
    };

    scrollContainer.addEventListener("mousedown", handleInteraction);
    scrollContainer.addEventListener("touchstart", handleInteraction);

    // Clean up event listeners and intervals on unmount
    return () => {
      clearInterval(interval);
      if (scrollState.bestsellerAutoScrollTimeout) {
        clearTimeout(scrollState.bestsellerAutoScrollTimeout);
      }
      if (scrollState.bestsellerAutoScrollInterval) {
        clearInterval(scrollState.bestsellerAutoScrollInterval);
      }
      scrollContainer.removeEventListener("mousedown", handleInteraction);
      scrollContainer.removeEventListener("touchstart", handleInteraction);
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
          {novels.map((novel, index) => (
            <Link
              href={`/novel/${novel.id}`}
              key={novel.id}
              className={styles.novelCard}
            >
              <div className={styles.rankBadge}>{index + 1}</div>
              <div className={styles.imageWrapper}>
                <Image
                  src={novel.coverImage}
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
