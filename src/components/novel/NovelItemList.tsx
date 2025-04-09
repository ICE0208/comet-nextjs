import React from "react";
import NovelItem from "./NovelItem";
import styles from "./NovelItemList.module.css";

type Novel = {
  title: string;
  author: string;
  description: string;
  thumbnail: string;
};

interface NovelItemListProps {
  data: Novel[];
}

const NovelItemList: React.FC<NovelItemListProps> = ({ data }) => (
  <div className={styles.container}>
    <div className={styles.grid}>
      {data.map((novel, key) => (
        <NovelItem
          key={key}
          novel={novel}
        />
      ))}
    </div>
  </div>
);

export default NovelItemList;
