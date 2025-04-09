import React from "react";
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
        //여기 Link말고 컴포넌트만 필터링해서 랜더링하고싶은데
        //activeCategory가 바뀔때마다 NovelItemList를 다시 랜더링해야함 => 컴포넌트 합쳐야대나?
        // <Link
        //   key={category.id}
        //   href={`/novel?category=${category.id}`}
        //   className={`${styles.categoryItem} ${activeCategory === category.id ? styles.active : ""}`}
        // >
        <div
          key={category.id}
          className={`${styles.categoryItem} ${activeCategory === category.id ? styles.active : ""}`}
        >
          {category.name}
        </div>
        // </Link>
      ))}
    </div>
  </div>
);

export default NovelCategories;
