"use client";
import Link from "next/link";
import React, { useState } from "react";
import NovelInfoItem from "./NovelInfoItem";
import styles from "./NovelInfoItemList.module.css";

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
interface Props {
  novel: NovelInfoData;
}

const NovelInfoItemList = ({ novel }: Props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const episodesPerPage = 5;

  /* 배열 필터링,정렬.. 무거운 계산.. useMemo로 메모이제이션해서,
   리랜더링돼도 의존성배열 값이 안변하면 실행안하고, 캐싱된 return값 바로사용함 */
  const sortedEpisodes = React.useMemo(
    () =>
      [...novel.episode].sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();

        return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
      }),
    [novel.episode, sortOrder]
  );

  const totalEpisodes = sortedEpisodes.length;
  const totalPages = Math.ceil(totalEpisodes / episodesPerPage);

  /* 정렬 눌렀을때 페이지 초기화 */
  const handleSortChange = (order: "newest" | "oldest") => {
    setSortOrder(order);
    setCurrentPage(1);
  };

  /* 현재 페이지에 표시할 에피소드 계산 */
  const indexOfLastEpisode = currentPage * episodesPerPage; // 2페이지면 10
  const indexOfFirstEpisode = indexOfLastEpisode - episodesPerPage; // 2페이지면 5
  const currentEpisodes = sortedEpisodes.slice(
    indexOfFirstEpisode,
    indexOfLastEpisode
  ); // 정렬된 에피소드 배열에서 현재페이지에 해당하는 에피소드만 추출

  /* 페이지 변경 */
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  /* 페이지네이션 번호 생성 */
  const getPageNumbers = () => {
    const pageNumbers = [];

    /* 현재페이지를 중앙에 표시 >>> 현재 페이지가 7이면 startPage는 5 */
    let startPage = Math.max(1, currentPage - 2);
    /* +4해서 총 5개의 페이지 보여줌 */
    const endPage = Math.min(totalPages, startPage + 4);

    // Adjust start page if end page is maxed out 모르겠다
    if (endPage === totalPages) {
      startPage = Math.max(1, endPage - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  return (
    <div className={styles.episodeContainer}>
      <div className={styles.episodeHeader}>
        <h3 className={styles.episodeListTitle}>에피소드 목록</h3>
        <div className={styles.episodeSort}>
          <div
            className={sortOrder === "newest" ? styles.active : ""}
            onClick={() => handleSortChange("newest")}
          >
            최신순
          </div>
          <div
            className={sortOrder === "oldest" ? styles.active : ""}
            onClick={() => handleSortChange("oldest")}
          >
            오래된순
          </div>
        </div>
      </div>

      {totalEpisodes > 0 ? (
        <>
          {currentEpisodes.map((episode) => (
            <Link
              href={`/novel/${novel.id}/episode/${episode.id}`}
              className={styles.episodeLink}
              key={episode.id}
            >
              <NovelInfoItem
                key={episode.id}
                id={episode.id}
                title={episode.title}
                date={episode.date}
                rating={episode.rating}
                thumbnail={episode.thumbnail}
              />
            </Link>
          ))}

          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                className={styles.pageArrow}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                이전
              </button>

              {getPageNumbers().map((number) => (
                <button
                  key={number}
                  onClick={() => handlePageChange(number)}
                  className={`${styles.pageNumber} ${currentPage === number ? styles.activePage : ""}`}
                >
                  {number}
                </button>
              ))}

              <button
                className={styles.pageArrow}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                다음
              </button>
            </div>
          )}
        </>
      ) : (
        <p className={styles.noEpisodes}>현재 등록된 에피소드가 없습니다.</p>
      )}
    </div>
  );
};

export default NovelInfoItemList;
