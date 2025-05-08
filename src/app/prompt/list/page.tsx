"use client";

import { useState } from "react";
import styles from "./page.module.css";
import { ChatItem, SortType, ViewType } from "./types";
import GridView from "./components/GridView";
import ListView from "./components/ListView";
import TopBar from "./components/TopBar";

// 더미 데이터
const dummyChats: ChatItem[] = [
  {
    id: 1,
    title: "Untitled notebook",
    createdAt: "2025. 5. 8.",
    lastUsedAt: "2025. 5. 8.",
    revisionCount: 0,
    icon: "📒",
  },
  {
    id: 2,
    title: "비정형데이터터",
    createdAt: "2025. 3. 27.",
    lastUsedAt: "2025. 3. 27.",
    revisionCount: 1,
    icon: "🤖",
  },
  {
    id: 3,
    title: "효과적인 외국어 학습법",
    createdAt: "2025. 5. 8.",
    lastUsedAt: "2025. 5. 8.",
    revisionCount: 8,
    icon: "🗣️",
  },
  {
    id: 4,
    title: "영어 회화 대본",
    createdAt: "2025. 4. 15.",
    lastUsedAt: "2025. 5. 1.",
    revisionCount: 4,
    icon: "📝",
  },
  {
    id: 5,
    title: "프로그래밍 학습 노트",
    createdAt: "2025. 4. 25.",
    lastUsedAt: "2025. 5. 2.",
    revisionCount: 3,
    icon: "💻",
  },
  {
    id: 6,
    title: "올해 목표 계획서",
    createdAt: "2025. 1. 2.",
    lastUsedAt: "2025. 4. 20.",
    revisionCount: 12,
    icon: "📅",
  },
];

export default function PromptListPage() {
  const [optionOpenId, setOptionOpenId] = useState<number | null>(null);
  const [chats, setChats] = useState<ChatItem[]>(dummyChats);
  const [sort, setSort] = useState<SortType>("latest");
  const [view, setView] = useState<ViewType>("grid");

  // 정렬
  const sortedChats = [...chats].sort((a, b) => {
    if (sort === "latest") {
      return b.lastUsedAt.localeCompare(a.lastUsedAt);
    } else {
      return b.createdAt.localeCompare(a.createdAt);
    }
  });

  // 삭제
  const handleDelete = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setChats((prev) => prev.filter((c) => c.id !== id));
    setOptionOpenId(null);
  };

  // 제목 변경(간단 프롬프트)
  const handleRename = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newTitle = prompt("새 제목을 입력하세요");
    if (newTitle) {
      setChats((prev) =>
        prev.map((c) => (c.id === id ? { ...c, title: newTitle } : c))
      );
    }
    setOptionOpenId(null);
  };

  // 카드 클릭
  const handleCardClick = (id: number) => {
    console.log(`카드 ${id} 클릭됨`);
    // 여기에 카드 클릭 시 실행할 로직 추가
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>채팅 리스트</div>

      {/* 탑 바 컴포넌트 */}
      <TopBar
        view={view}
        setView={setView}
        sort={sort}
        setSort={setSort}
      />

      {/* 뷰 컴포넌트 */}
      {view === "grid" ? (
        <GridView
          chats={sortedChats}
          optionOpenId={optionOpenId}
          setOptionOpenId={setOptionOpenId}
          handleCardClick={handleCardClick}
          handleRename={handleRename}
          handleDelete={handleDelete}
        />
      ) : (
        <ListView
          chats={sortedChats}
          optionOpenId={optionOpenId}
          setOptionOpenId={setOptionOpenId}
          handleCardClick={handleCardClick}
          handleRename={handleRename}
          handleDelete={handleDelete}
        />
      )}
    </div>
  );
}
