"use client";

import { novelData } from "./actions";
import NovelItemList from "@/components/novel/NovelItemList";
import BestsellerRow from "@/components/novel/BestsellerRow";
import styles from "./page.module.css";
import { useState, useEffect } from "react";

// novelData() returns a direct array, not an object with a novels property
export type Novel = Awaited<ReturnType<typeof novelData>>;

const NovelPage = () => {
  /* 불러온 데이터, 선택된 장르, 선택된 장르에따라 필터링된 데이터 */
  const [novelsData, setNovelsData] = useState<Novel>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filtered, setFiltered] = useState<Novel>([]);

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  /* 카테고리 목록 ( 필터링시 장르랑 id랑 비교 )*/
  /* 올일떄 따로하나만들어라*/
  const categories = [
    { id: "all", name: "전체" },
    { id: "fantasy", name: "판타지" },
    { id: "romance", name: "로멘스" },
    { id: "scifi", name: "과학" },
    { id: "life", name: "일상" },
    { id: "mystery", name: "미스테리" },
    { id: "etc", name: "기타" },
  ];

  /* 처음 마운트될때 한번 렌더링 (데이터 없음)
     novelData상태 변해서 두번째 렌더링 */
  useEffect(() => {
    const fetchData = async () => {
      const data = await novelData();
      setNovelsData(data);
      /* data = Novel[] >>> fetch 데이터 이렇게생김... */
    };
    fetchData();
  }, []);

  /* 두번째 렌더링에서 novelData상태 변해서 useEffect실행 >>> filtered상태 변해서 세번째 렌더링 */
  useEffect(() => {
    if (selectedCategory === "all") {
      setFiltered(novelsData);
    } else {
      setFiltered(novelsData.filter((item) => item.genre === selectedCategory));
    }
  }, [selectedCategory, novelsData]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Our Web Novel Collection</h1>
        <p className={styles.subtitle}>Discover your next favorite story</p>
      </div>

      <BestsellerRow />

      <div className={styles.categoriesContainer}>
        <div className={styles.categories}>
          {categories.map((category) => (
            <div
              key={category.id}
              className={`${styles.categoryItem} ${selectedCategory === category.id ? styles.active : ""}`}
              onClick={() => handleCategoryClick(category.id)}
            >
              {category.name}
            </div>
          ))}
        </div>
      </div>

      <NovelItemList data={filtered} />
    </div>
  );
};
export default NovelPage;
