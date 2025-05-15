import React from "react";
import Image from "next/image";
import styles from "./MainImage.module.css";

const MainImage = () => (
  <div>
    <div className={styles.mainImage}>
      <Image
        src="/images/main-image.webp"
        alt="main"
        fill
        priority
        style={{ objectFit: "cover" }}
      />
      <div className={styles.mainImageCover} />
      <div className={styles.tryToDemo}>
        <div className={styles.tryToDemoTitle}>교열 해보기</div>
        <div className={styles.tryToDemoInputContainer}>
          <input
            type="text"
            placeholder="책 제목을 입력해주세요"
          />
          <div>📖</div>
        </div>
      </div>
    </div>
  </div>
);

export default MainImage;
