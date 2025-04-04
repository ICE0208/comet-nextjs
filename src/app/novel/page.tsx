import React from "react";
import { getNovelData, getMainPageNovelData } from "@/app/actions";
import styles from "./page.module.css";
import NovelThumbnailList from "@/components/novel-thumbnail-list";
import NovelItemList from "@/components/novel-item-list";
import Image from "next/image";

const NovelPageCards = async () => {
  const novelData = await getNovelData();
  const mainPageNovelData = await getMainPageNovelData();

  return (
    <div className={styles.container}>
      <NovelThumbnailList
        title="TOP 10"
        data={mainPageNovelData.top10}
      />
      <div className={styles.eventArea}>
        <Image
          src="/images/main-image.webp"
          alt="no--image"
          width={10000}
          height={390}
        />
      </div>
      <div className={styles.itemsArea}>
        <div className={styles.navbar}>
          <div className={styles.categories}>
            <span>전체</span>
            <span>판타지</span>
            <span>로멘스</span>
            <span>스릴러</span>
            <span>코미디</span>
            <span>엑션</span>
            <span>스포츠</span>
            <span>드라마</span>
            <span>성인</span>
          </div>
          <div>
            <input />
          </div>
        </div>
        <NovelItemList data={novelData.novelAll} />
      </div>
    </div>
  );
};

export default NovelPageCards;
