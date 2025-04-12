import React from "react";
import styles from "./page.module.css";
import { getNovelInfoData } from "@/app/actions";
import Image from "next/image";
import NovelInfoItemList from "@/components/novel-info/NovelInfoItemList";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

interface Novels {
  novels: NovelInfoData[];
}

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

const NovelInfoPage = async ({ params }: Props) => {
  /* 동적라우트 파라미터 사용할때 비동기적으로 처리해야한다...위에 타입확인 */
  const { id } = await params;
  const novelInfoData: Novels = await getNovelInfoData();
  const novels = novelInfoData.novels;
  /* 조건에 맞는 요소가 없으면 undefined을 반환, novel ? ():() 조건부 렌더링ㄱㄱ */
  const novel = novels.find((novel) => novel.id === id);

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
              <p>{novel.like ? "❤️" : "🤍"}</p>
            </div>
            <p className={styles.description}>{novel.description}</p>
          </div>
        </div>
      ) : (
        <div className={styles.novelInfo}>
          <h2>Novel not found</h2>
        </div>
      )}
      {novel ? <NovelInfoItemList novel={novel} /> : null}
    </main>
  );
};

export default NovelInfoPage;
