"use client";
import React, { useState } from "react";
import NovelItem from "./NovelItem";
import styles from "./NovelItemList.module.css";

type Novel = {
  id: string;
  title: string;
  author: string;
  description: string;
  thumbnail: string;
};

interface NovelItemListProps {
  data: Novel[];
}

const NovelItemList = ({ data }: NovelItemListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Calculate total pages
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];

    // Show up to 5 pages (current page in the middle when possible)
    let startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + 4);

    // Adjust start page if end page is maxed out
    if (endPage === totalPages) {
      startPage = Math.max(1, endPage - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {currentItems.map((novel, key) => (
          <NovelItem
            key={key}
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
