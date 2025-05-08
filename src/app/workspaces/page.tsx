"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import { ChatItem, SortType, ViewType } from "./types";
import GridView from "./components/GridView";
import ListView from "./components/ListView";
import TopBar from "./components/TopBar";
import WorkspaceModal from "./components/WorkspaceModal";
import {
  getWorkspaceList,
  createWorkspace,
  updateWorkspaceTitle,
  deleteWorkspace,
} from "./actions";

export default function PromptListPage() {
  const [optionOpenId, setOptionOpenId] = useState<string | null>(null);
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [sort, setSort] = useState<SortType>("latest");
  const [view, setView] = useState<ViewType>("grid");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingChat, setEditingChat] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const fetchWorkspaces = async () => {
    try {
      const workspaces = await getWorkspaceList();
      setChats(workspaces);
    } catch (error) {
      console.error("작업 목록을 불러오는 중 오류 발생:", error);
    }
  };

  // 정렬
  const sortedChats = [...chats].sort((a, b) => {
    if (sort === "latest") {
      return (
        new Date(b.lastUsedAt).getTime() - new Date(a.lastUsedAt).getTime()
      );
    } else {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  // 삭제
  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (
      window.confirm(
        "이 작업을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
      )
    ) {
      setIsLoading(true);
      try {
        const result = await deleteWorkspace(id);

        if (result.success) {
          // 성공적으로 삭제된 경우 로컬 상태 업데이트
          setChats((prev) => prev.filter((c) => c.id !== id));
        } else {
          // 삭제 실패 시 에러 메시지 표시
          alert(result.error || "작업 삭제에 실패했습니다.");
        }
      } catch (error) {
        console.error("작업 삭제 중 오류 발생:", error);
        alert("작업 삭제 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    }

    setOptionOpenId(null);
  };

  // 제목 변경(모달 열기)
  const handleRenameClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const chat = chats.find((c) => c.id === id);
    if (chat) {
      setEditingChat({ id, title: chat.title });
      setModalMode("edit");
      setIsModalOpen(true);
    }
    setOptionOpenId(null);
  };

  // 제목 변경 저장
  const handleRenameConfirm = async (newTitle: string) => {
    if (editingChat) {
      setIsLoading(true);
      try {
        const result = await updateWorkspaceTitle(editingChat.id, newTitle);

        if (result.success && result.workspace) {
          // 성공적으로 업데이트된 경우 로컬 상태 업데이트
          setChats((prev) =>
            prev.map((c) => (c.id === editingChat.id ? result.workspace : c))
          );
        } else {
          // 실패한 경우 에러 메시지 표시
          alert(result.error || "작업 이름 변경에 실패했습니다.");
        }
      } catch (error) {
        console.error("작업 이름 변경 중 오류 발생:", error);
        alert("작업 이름 변경 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
        setEditingChat(null);
        setIsModalOpen(false);
      }
    }
  };

  // 새 작업 생성 클릭
  const handleCreateClick = () => {
    setModalMode("create");
    setEditingChat(null);
    setIsModalOpen(true);
  };

  // 새 작업 생성 저장
  const handleCreateConfirm = async (title: string) => {
    setIsLoading(true);
    try {
      const newWorkspace = await createWorkspace(title);
      setChats((prev) => [newWorkspace, ...prev]);
    } catch (error) {
      console.error("작업 생성 중 오류 발생:", error);
      alert("작업을 생성하는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
    }
  };

  // 모달 확인 버튼 클릭
  const handleModalConfirm = (title: string) => {
    if (modalMode === "create") {
      handleCreateConfirm(title);
    } else {
      handleRenameConfirm(title);
    }
  };

  // 카드 클릭
  const handleCardClick = (id: string) => {
    console.log(`카드 ${id} 클릭됨`);
    // 여기에 카드 클릭 시 실행할 로직 추가
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>나의 작업 공간</div>

      {/* 탑 바 컴포넌트 */}
      <TopBar
        view={view}
        setView={setView}
        sort={sort}
        setSort={setSort}
        onCreateClick={handleCreateClick}
      />

      {/* 뷰 컴포넌트 */}
      {view === "grid" ? (
        <GridView
          chats={sortedChats}
          optionOpenId={optionOpenId}
          setOptionOpenId={setOptionOpenId}
          handleCardClick={handleCardClick}
          handleRename={handleRenameClick}
          handleDelete={handleDelete}
        />
      ) : (
        <ListView
          chats={sortedChats}
          optionOpenId={optionOpenId}
          setOptionOpenId={setOptionOpenId}
          handleCardClick={handleCardClick}
          handleRename={handleRenameClick}
          handleDelete={handleDelete}
        />
      )}

      {/* 작업 모달 (생성/편집) */}
      <WorkspaceModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingChat(null);
        }}
        onConfirm={handleModalConfirm}
        initialValue={editingChat?.title || ""}
        mode={modalMode}
        isLoading={isLoading}
      />
    </div>
  );
}
