"use client";

import { getNovelData } from "@/app/actions";
import NovelItemList from "@/components/novel/NovelItemList";
import BestsellerRow from "@/components/novel/BestsellerRow";
import styles from "./page.module.css";
import { useState, useEffect } from "react";

type Novel = {
  id: string;
  title: string;
  author: string;
  description: string;
  thumbnail: string;
  genre: string;
  viewCount: number;
  rating: number;
};

type NovelData = {
  novelAll: Novel[];
};

// type Category = {
//   id: string;
//   name: string;
// };

// interface NovelCategoriesProps {
//   categories: Category[];
//   activeCategory: string;
// }

const NovelPage = () => {
  const [novelData, setNovelData] = useState<NovelData>({ novelAll: [] });
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filtered, setFiltered] = useState<Novel[]>(novelData.novelAll);

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  // You would typically fetch these categories from your API
  const categories = [
    { id: "all", name: "전체" },
    { id: "fantasy", name: "판타지" },
    { id: "romance", name: "로멘스" },
    { id: "scifi", name: "과학" },
    { id: "life", name: "일상" },
    { id: "mystery", name: "미스테리" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const data = await getNovelData();
      setNovelData(data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedCategory === "all") {
      setFiltered(novelData.novelAll);
    } else {
      setFiltered(
        novelData.novelAll.filter((item) => item.genre === selectedCategory)
      );
    }
  }, [selectedCategory, novelData.novelAll]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Our Web Novel Collection</h1>
        <p className={styles.subtitle}>Discover your next favorite story</p>
      </div>

      <BestsellerRow novels={novelData.novelAll} />

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

      {/* <NovelItemList data={novelData.novelAll} /> */}
      <NovelItemList data={filtered} />
    </div>
  );
};
export default NovelPage;
