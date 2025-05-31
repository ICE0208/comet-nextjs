import React from "react";
import Image from "next/image";
import styles from "./MainImage.module.css";

const MainImage = () => (
  <div className={styles.mainImageContainer}>
    <div className={styles.floatingElements}>
      <div
        className={styles.floatingElement}
        style={{ animationDelay: "0s" }}
      >
        ✨
      </div>
      <div
        className={styles.floatingElement}
        style={{ animationDelay: "1.2s" }}
      >
        🌟
      </div>
      <div
        className={styles.floatingElement}
        style={{ animationDelay: "2.5s" }}
      >
        💫
      </div>
      <div
        className={styles.floatingElement}
        style={{ animationDelay: "3.7s" }}
      >
        ⭐
      </div>
      <div
        className={styles.floatingElement}
        style={{ animationDelay: "4.9s" }}
      >
        ✨
      </div>
    </div>

    <div className={styles.mainImage}>
      <Image
        src="/images/main-image.webp"
        alt="당신의 창작 여정을 함께하는 코멧"
        fill
        priority
        className={styles.imageElement}
      />
      <div className={styles.mainImageCover} />

      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>
          소설의 <span className={styles.highlight}>별</span>이 되세요
        </h1>
        <p className={styles.heroSubtitle}>
          코멧에서 당신의 이야기를 펼쳐보세요
        </p>
      </div>

      <div className={styles.scrollIndicator}>
        <span>SCROLL</span>
        <div className={styles.scrollArrow} />
      </div>
    </div>

    <div className={styles.imageBadge}>
      <div className={styles.badgeIcon}>✨</div>
      <div className={styles.badgeContent}>
        <span className={styles.badgeYear}>2025</span>
        <strong className={styles.badgeText}>새로운 이야기의 세계</strong>
      </div>
    </div>
  </div>
);

export default MainImage;
