import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./IntroSection.module.css";

const IntroSection = () => (
  <section className={styles.introSection}>
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>소설의 별, 코멧</h1>
        <p className={styles.description}>
          창작의 빛나는 순간을 함께하세요. 코멧에서 당신만의 이야기를 발견하고,
          새로운 세계로 떠나는 여정을 시작하세요.
        </p>
        <div className={styles.buttonGroup}>
          <Link
            href="/workspaces"
            className={`${styles.button} ${styles.secondaryButton}`}
          >
            지금 시작하기
          </Link>
        </div>
        <div className={styles.features}>
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>
              <Image
                src="/icons/write.svg"
                alt="창작"
                width={24}
                height={24}
              />
            </div>
            <span>당신의 이야기를 세상에</span>
          </div>
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>
              <Image
                src="/icons/magic.svg"
                alt="발견"
                width={24}
                height={24}
              />
            </div>
            <span>새로운 세계로의 여행</span>
          </div>
        </div>
      </div>
      <div className={styles.imageContainer}>
        <Image
          src="/images/main-image.webp"
          alt="코멧 소개 이미지"
          fill
          priority
          className={styles.mainImage}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className={styles.imageBadge}>
          <span>2025</span>
          <strong>
            작품의 바다에서
            <br />
            당신의 별을 찾으세요
          </strong>
        </div>
      </div>
    </div>
  </section>
);

export default IntroSection;
