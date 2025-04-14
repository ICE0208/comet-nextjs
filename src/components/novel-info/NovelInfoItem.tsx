import React from "react";
import styles from "./NovelInfoItem.module.css";
import Image from "next/image";

interface Episode {
  id: string;
  title: string;
  date: string;
  rating: number;
  thumbnail?: string; // 아직 thumbnail 없는애들도 있어서... 일단 bualapha로 대체
}

const NovelInfoItem = ({ title, date, rating, thumbnail }: Episode) => (
  <div className={styles.episodeItem}>
    <Image
      src={thumbnail ? thumbnail : "/images/novel-temp-thumbnail/n.png"}
      alt="episode thumbnail"
      width={80}
      height={80}
      className={styles.episodeThumbnail}
    />
    <div className={styles.episodeInfo}>
      <h3 className={styles.episodeTitle}>{title}</h3>
      <p className={styles.episodeDate}>{date}</p>
      <p className={styles.episodeRating}>{rating}</p>
    </div>
  </div>
);

export default NovelInfoItem;
