"use client";
import Link from "next/link";
import React, { useState } from "react";
import NovelInfoItem from "./NovelInfoItem";
import styles from "./NovelInfoItemList.module.css";

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
interface Props {
  novel: NovelInfoData;
}

const NovelInfoItemList = ({ novel }: Props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const episodesPerPage = 5;

  // Sort episodes based on the current sort order
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

  // Reset to first page when changing sort order
  const handleSortChange = (order: "newest" | "oldest") => {
    setSortOrder(order);
    setCurrentPage(1);
  };

  // 현재 페이지에 표시할 에피소드 계산
  const indexOfLastEpisode = currentPage * episodesPerPage;
  const indexOfFirstEpisode = indexOfLastEpisode - episodesPerPage;
  const currentEpisodes = sortedEpisodes.slice(
    indexOfFirstEpisode,
    indexOfLastEpisode
  );

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // 페이지 번호 배열 생성
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

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

              {pageNumbers.map((number) => (
                <button
                  key={number}
                  onClick={() => handlePageChange(number)}
                  className={`${styles.pageButton} ${
                    currentPage === number ? styles.activePageButton : ""
                  }`}
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
