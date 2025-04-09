import React from "react";
import Link from "next/link";
import styles from "./NovelCategories.module.css";

type Category = {
  id: string;
  name: string;
};

interface NovelCategoriesProps {
  categories: Category[];
  activeCategory: string;
}

const NovelCategories: React.FC<NovelCategoriesProps> = ({
  categories,
  activeCategory,
}) => (
  <div className={styles.categoriesContainer}>
    <div className={styles.categories}>
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/novel?category=${category.id}`}
          className={`${styles.categoryItem} ${activeCategory === category.id ? styles.active : ""}`}
        >
          {category.name}
        </Link>
      ))}
    </div>
  </div>
);

export default NovelCategories;
