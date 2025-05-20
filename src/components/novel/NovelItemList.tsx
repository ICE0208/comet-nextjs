"use client";
import React, { useEffect, useState } from "react";
import NovelItem from "./NovelItem";
import styles from "./NovelItemList.module.css";
import { Novel } from "@/app/(page)/novel/page";

interface NovelItemListProps {
  data: Novel;
}

const NovelItemList = ({ data }: NovelItemListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 전체 페이지 수 계산
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // 현재 페이지에 해당하는 아이템을 가져오기
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // 페이지 이동
  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
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

  useEffect(() => {
    // 데이터( 선택된 장르 )가 바뀔때마다 페이지를 1로 초기화
    setCurrentPage(1);
  }, [data]);

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {currentItems.map((novel) => (
          <NovelItem
            key={novel.id}
            novel={novel}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={styles.paginationButton}
          >
            이전
          </button>

          {getPageNumbers().map((number) => (
            <button
              key={number}
              onClick={() => goToPage(number)}
              className={`${styles.pageNumber} ${currentPage === number ? styles.activePage : ""}`}
            >
              {number}
            </button>
          ))}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={styles.paginationButton}
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
};

export default NovelItemList;
