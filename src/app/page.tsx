import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div>
      {/* 메인 이미지 */}
      <div className={styles.mainImage}>
        <Image
          src="/images/main-image.webp"
          alt="main"
          fill
          priority
          style={{ objectFit: "cover" }}
        />
        <div className={styles.mainImageCover} />
        {/* 교열 해보기 */}
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
      {/* 카테고리 */}
      <div></div>
      {/* 소설 목록 */}
      <div>
        {/* Top 10 */}
        <div></div>
        {/* 추천 */}
        <div></div>
      </div>
    </div>
  );
}
