"use client";
/* 처음에 page에서 작업했는데, use client 쓸라니깐 async 쓰고있어서 안된다함...
그래서 컴포넌트 따로 만듬. */
import React, { useState } from "react";
import Image from "next/image";
import styles from "./NovelInfo.module.css";

interface NovelInfoData {
  id: string;
  title: string;
  author: string;
  like: number;
  description: string;
  thumbnail: string;
  episode: Episode[];
}

interface Episode {
  id: string;
  title: string;
  date: string;
  rating: number;
  thumbnail?: string;
}

interface NovelInfoClientProps {
  novel: NovelInfoData | undefined;
}

const NovelInfoClient = ({ novel }: NovelInfoClientProps) => {
  const [like, setLike] = useState(novel?.like || 0);

  const handleClickLike = () => {
    setLike(like + 1);
  };

  return (
    <main className={styles.container}>
      {novel ? (
        <div className={styles.novelInfo}>
          <Image
            src={novel.thumbnail}
            alt={`${novel.title} 표지 이미지`}
            width={200}
            height={0}
            priority
            className={styles.thumbnail}
          />
          <div className={styles.novelInfoText}>
            <div className={styles.novelInfoHeader}>
              <div className={styles.novelInfoTitle}>
                <h2>{novel.title}</h2>
                <p>{novel.author}</p>
              </div>
              <p
                className={styles.like}
                onClick={handleClickLike}
              >
                {novel.like}
              </p>
            </div>
            <p className={styles.description}>{novel.description}</p>
          </div>
        </div>
      ) : (
        <div className={styles.novelInfo}>
          <h2>Novel not found</h2>
        </div>
      )}
    </main>
  );
};

export default NovelInfoClient;
