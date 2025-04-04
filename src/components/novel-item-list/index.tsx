import React from "react";
import Image from "next/image";
import styles from "./styles.module.css";

const NovelItemList = ({
  data,
}: {
  data: {
    title: string;
    author: string;
    description: string;
    thumbnail: string;
  }[];
}) => (
  <div className={styles.novelPageCards}>
    {data.map((item) => (
      <div
        className={styles.novelCards}
        key={item.title}
      >
        <Image
          className={styles.thumbnail}
          src={item.thumbnail}
          alt={item.title}
          width={200}
          height={300}
        />
        <p className={styles.title}>{item.title}</p>
        <p className={styles.author}>{item.author}</p>
      </div>
    ))}
  </div>
);

export default NovelItemList;
