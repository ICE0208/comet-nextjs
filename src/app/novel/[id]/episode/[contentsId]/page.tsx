"use client";

import React, { useState, useEffect, use } from "react";
import styles from "./page.module.css";
import NovelContents from "@/components/novel-contents/NovelContents";
import { getNovelContentsData } from "@/app/actions";
import NovelComment from "@/components/novel-contents/NovelComment";

type Props = {
  params: Promise<{
    contentsId: string;
  }>;
};

interface NovelContentsData {
  episode: Episode[];
}
interface Episode {
  id: string;
  title: string;
  date: string;
  rating: number;
  thumbnail?: string;
  contents: string;
}

const NovelContentsPage = ({ params }: Props) => {
  // params를 React.use()를 사용하여 언래핑
  const unwrappedParams = use(params);
  const { contentsId } = unwrappedParams;

  const [currentEpisodeId, setCurrentEpisodeId] = useState(contentsId);
  const [novelContents, setNovelContents] = useState<NovelContentsData | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getNovelContentsData();
        setNovelContents(data);
        setLoading(false);
      } catch {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || !novelContents) {
    return <div>로딩 중...</div>;
  }

  const episode: Episode[] = novelContents.episode;
  const selectedEpisode = episode.find((ep) => ep.id === currentEpisodeId);

  // 현재 에피소드의 인덱스 찾기
  const currentIndex = episode.findIndex((ep) => ep.id === currentEpisodeId);

  // 컴포넌트를 전활할지... Link로 페이지를 전환할지...
  // 이전화 이동 함수
  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentEpisodeId(episode[currentIndex - 1].id);
    }
  };

  // 다음화 이동 함수
  const goToNext = () => {
    if (currentIndex < episode.length - 1) {
      setCurrentEpisodeId(episode[currentIndex + 1].id);
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
              disabled={currentIndex <= 0}
              className={styles.navButton}
            >
              이전화
            </button>
            <button
              onClick={goToNext}
              disabled={currentIndex >= episode.length - 1}
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
