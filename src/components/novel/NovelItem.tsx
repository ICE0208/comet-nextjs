import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./NovelItem.module.css";
import { Novel } from "@/app/(page)/novel/page";

interface NovelItemProps {
  novel: Novel[number];
}

const NovelItem = ({ novel }: NovelItemProps) => (
  <Link
    href={`/novel/${novel.id}`}
    className={styles.card}
  >
    <div className={styles.imageContainer}>
      <Image
        src={novel.imageUrl}
        alt={novel.title}
        width={200}
        height={300}
        className={styles.image}
      />
    </div>
    <div className={styles.content}>
      <h3 className={styles.title}>{novel.title}</h3>
      <p className={styles.author}>by {novel.author.userId}</p>
      {novel.description && (
        <p className={styles.description}>
          {novel.description.length > 30
            ? `${novel.description.substring(0, 30)}...`
            : novel.description}
        </p>
      )}
    </div>
  </Link>
);

export default NovelItem;
