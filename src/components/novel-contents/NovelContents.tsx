import React from "react";
import Image from "next/image";
import styles from "./NovelContents.module.css";

interface Episode {
  id: string;
  title: string;
  date: string;
  rating: number;
  thumbnail?: string;
  contents: string;
}

interface Props {
  data: Episode;
}

const NovelContents = ({ data }: Props) => (
  <div className={styles.container}>
    <div className={styles.header}>
      {data.thumbnail && (
        <Image
          src={data.thumbnail}
          alt={data.title}
          width={80}
          height={80}
          className={styles.thumbnail}
        />
      )}
      <div className={styles.meta}>
        <div>
          <h1 className={styles.title}>{data.title}</h1>
          <div className={styles.date} />
          {new Date(data.date).toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
        <div className={styles.rating}>{data.rating}</div>
      </div>
    </div>
    <div className={styles.contents}>{data.contents}</div>
  </div>
);

export default NovelContents;
