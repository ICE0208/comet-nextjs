import React from "react";
import Image from "next/image";
import styles from "./NovelContents.module.css";

interface Episode {
  id: number;
  title: string;
  imageUrl: string;
  content: string;
  uploadDate: Date;
}

interface Props {
  data: Episode;
}

const NovelContents = ({ data }: Props) => (
  <div className={styles.container}>
    <div className={styles.header}>
      {data.imageUrl && (
        <Image
          src={data.imageUrl}
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
          {new Date(data.uploadDate).toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
        <div className={styles.rating}>-----</div>
      </div>
    </div>
    <div className={styles.contents}>{data.content}</div>
  </div>
);

export default NovelContents;
