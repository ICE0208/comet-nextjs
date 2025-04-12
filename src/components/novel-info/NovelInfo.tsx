"use client";
import React, { useState } from "react";
import Image from "next/image";
import styles from "./NovelInfo.module.css";

interface NovelInfoData {
  id: string;
  title: string;
  author: string;
  like: boolean;
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

// 클라이언트 컴포넌트로 UI 렌더링 및 상태 관리
const NovelInfoClient = ({ novel }: NovelInfoClientProps) => {
  const [like, setLike] = useState(novel?.like || false);

  const handleClickLike = () => {
    // const newLikeState = !like;
    setLike(!like);

    if (novel) {
      novel.like = like; // 서버에 좋아요 상태 업데이트 요청을 보내는 로직 추가 필요
    }
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
                {novel.like ? "❤️" : "🤍"}
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
