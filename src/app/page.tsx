import Image from "next/image";
import styles from "./page.module.css";
import IconMenu from "@/components/icon-menu";

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
      <div className={styles.categoryContainer}>
        <IconMenu
          svgPath="/icons/magic.svg"
          description="교열"
        />
        <IconMenu
          svgPath="/icons/write.svg"
          description="창작하기"
        />
        <IconMenu
          svgPath="/icons/book-open.svg"
          description="소설"
        />
        <IconMenu
          svgPath="/icons/question-circle.svg"
          description="FAQ"
        />
      </div>
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
