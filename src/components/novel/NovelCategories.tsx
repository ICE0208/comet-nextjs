"use client";

import React, { useState } from "react";
import styles from "./NovelCategories.module.css";

type Category = {
  id: string;
  name: string;
};

interface NovelCategoriesProps {
  categories: Category[];
  activeCategory: string;
}

const NovelCategories = ({
  categories,
  activeCategory,
}: NovelCategoriesProps) => {
  const [selectedCategory, setSelectedCategory] = useState(activeCategory);
  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  return (
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
  );
};

export default NovelCategories;
