import React from "react";
import styles from "./NovelInfoItem.module.css";
import Image from "next/image";
import { formatDateTime } from "@/utils/date";

interface Episode {
  title: string;
  uploadDate: Date;
  imageUrl?: string;
}

const NovelInfoItem = ({ title, uploadDate, imageUrl }: Episode) => (
  <div className={styles.episodeItem}>
    <Image
      src={imageUrl ? imageUrl : "/images/novel-temp-thumbnail/n.png"}
      alt="episode thumbnail"
      width={80}
      height={80}
      className={styles.episodeThumbnail}
    />
    <div className={styles.episodeInfo}>
      <h3 className={styles.episodeTitle}>{title}</h3>
      <p className={styles.episodeDate}>{formatDateTime(uploadDate)}</p>
      <p className={styles.episodeRating}>-----</p>
    </div>
  </div>
);

export default NovelInfoItem;
