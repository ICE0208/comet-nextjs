"use client";
import React, { useState } from "react";
import Image from "next/image";
import styles from "./NovelInfo.module.css";
import { Novel } from "@/app/novel/[id]/page"; // 서버 컴포넌트에서 가져온 Novel 타입을 사용

type NovelProps = {
  novel: Novel;
};

const NovelInfoClient = ({ novel }: NovelProps) => {
  const [like, setLike] = useState("-----");

  const handleClickLike = () => {
    setLike(like + "-");
  };

  return (
    <main className={styles.container}>
      {novel ? (
        <div className={styles.novelInfo}>
          <Image
            src={novel.imageUrl}
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
                <p>{novel.author.userId}</p>
              </div>
              <p
                className={styles.like}
                onClick={handleClickLike}
              >
                {like}
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
