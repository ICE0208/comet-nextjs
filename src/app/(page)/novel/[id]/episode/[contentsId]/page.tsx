"use client";

import React, { useState, useEffect, use } from "react";
import styles from "./page.module.css";
import NovelContents from "@/components/novel-contents/NovelContents";
import { novelInfoData } from "../../actions";
import NovelComment from "@/components/novel-contents/NovelComment";
import { Novel } from "@/app/novel/[id]/page"; // 서버 컴포넌트에서 가져온 Novel 타입을 사용
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{
    id: string;
    contentsId: string;
  }>;
};

interface Episode {
  id: number;
  title: string;
  imageUrl: string;
  content: string;
  uploadDate: Date;
}

const NovelContentsPage = ({ params }: Props) => {
  // params를 React.use()를 사용하여 언래핑
  const { id, contentsId } = use(params);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const novel: Novel = await novelInfoData(id);
        const episode = novel.episodes.find(
          (ep) => ep.id === Number(contentsId)
        );
        if (episode !== null) {
          setSelectedEpisode(episode || null);
        }
        setEpisodes(novel.episodes);
        setLoading(false);
      } catch {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, contentsId]);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  const goToPrevious = () => {
    if (episodes.length > 1) {
      redirect(`/novel/${id}/episode/${+contentsId - 1}`);
    }
  };

  const goToNext = () => {
    if (episodes.length > 0) {
      const currentIndex = episodes.findIndex(
        (episode) => episode.id === Number(contentsId)
      );
      if (currentIndex < episodes.length - 1) {
        redirect(`/novel/${id}/episode/${+contentsId + 1}`);
      }
    }
  };

  return (
    <div className={styles.container}>
      {selectedEpisode ? (
        <>
          <NovelContents data={selectedEpisode} />
          <div className={styles.navigationButtons}>
            <button
              onClick={goToPrevious}
              disabled={episodes.length <= 1}
              className={styles.navButton}
            >
              이전화
            </button>
            <button
              onClick={goToNext}
              disabled={
                episodes.findIndex(
                  (episode) => episode.id === Number(contentsId)
                ) ==
                episodes.length - 1
              }
              className={styles.navButton}
            >
              다음화
            </button>
          </div>
        </>
      ) : (
        <div>에피소드를 찾을 수 없습니다</div>
      )}
      <NovelComment />
    </div>
  );
};
export default NovelContentsPage;
