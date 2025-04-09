import Image from "next/image";
import styles from "./page.module.css";
import IconMenu from "@/components/icon-menu";
import NovelThumbnailList from "@/components/novel-thumbnail-list";
import { getMainPageNovelData, getBestsellersData } from "@/app/actions";
import Link from "next/link";
import BestsellerRow from "@/components/novel/BestsellerRow";

export default async function Home() {
  const novelData = await getMainPageNovelData();
  const bestsellersData = await getBestsellersData();

  return (
    <main>
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
        <Link href={"/novel"}>
          <IconMenu
            svgPath="/icons/book-open.svg"
            description="소설"
          />
        </Link>
        <IconMenu
          svgPath="/icons/question-circle.svg"
          description="FAQ"
        />
      </div>
      {/* 소설 목록 */}
      <div>
        {/* Top 10 */}
        <NovelThumbnailList
          title="TOP 10"
          data={novelData.top10}
        />
        <div style={{ marginBottom: "40px" }} />
        {/* 추천 */}
        <NovelThumbnailList
          title="추천"
          data={novelData.recommend}
        />
        <div style={{ marginBottom: "360px" }} />
      </div>
      {/* If you're showing bestsellers on the homepage: */}
      <BestsellerRow novels={bestsellersData.bestsellers} />
    </main>
  );
}
