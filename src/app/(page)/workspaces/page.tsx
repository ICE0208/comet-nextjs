"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { WorkItem, SortType, ViewType } from "./types";
import GridView from "./components/GridView";
import ListView from "./components/ListView";
import TopBar from "./components/TopBar";
import WorkspaceModal from "./components/WorkspaceModal";
import TutorialModal from "../../../components/portals/TutorialModal";
import {
  getWorkspaceList,
  createWorkspace,
  updateWorkspaceTitle,
  deleteWorkspace,
  resetUserTutorialStatus,
} from "./actions";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface UserData {
  isTutorial: boolean;
}

export default function PromptListPage() {
  // ===== 상태 관리 =====
  const [optionOpenId, setOptionOpenId] = useState<string | null>(null);
  const [sort, setSort] = useState<SortType>("latest");
  const [view, setView] = useState<ViewType>("grid");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingChat, setEditingChat] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialKey, setTutorialKey] = useState(0);

  const router = useRouter();
  const queryClient = useQueryClient();

  // 튜토리얼 닫기
  const handleTutorialClose = () => {
    setShowTutorial(false);
  };

  // ===== React Query 데이터 가져오기 =====
  // 워크스페이스 목록 조회 (읽기)
  const {
    data: works = [], // 기본값으로 빈 배열 설정
    isLoading: isLoadingWorkspaces,
  } = useQuery({
    queryKey: ["workspaces"], // 캐싱용 키
    queryFn: async () => {
      // 실제 데이터를 가져오는 함수
      try {
        return await getWorkspaceList();
      } catch {
        return [];
      }
    },
  });

  // 사용자 정보 조회
  const { data: userData } = useQuery<UserData>({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await fetch("/api/user");
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      return response.json();
    },
  });

  // 사용자가 튜토리얼을 보지 않았다면 튜토리얼 표시
  useEffect(() => {
    const checkTutorialStatus = () => {
      if (userData && !userData.isTutorial) {
        setShowTutorial(true);
      }
    };
    checkTutorialStatus();
  }, [userData]);

  useEffect(() => {
    if (showTutorial) {
      window.scrollTo(0, 0);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto"; // 컴포넌트 언마운트 시 스크롤 복원
    };
  }, [showTutorial]);

  // ===== React Query 변경 작업 =====
  // 워크스페이스 삭제 (삭제)
  const deleteWorkspaceMutation = useMutation({
    mutationFn: deleteWorkspace, // 삭제 함수 호출
    onSuccess: (result, id) => {
      // 성공 시 캐시 업데이트
      if (result.success) {
        // 캐시에서 해당 항목 제거
        queryClient.setQueryData(["workspaces"], (oldData: WorkItem[] = []) =>
          oldData.filter((item) => item.id !== id)
        );
      } else {
        alert(result.error || "작업 삭제에 실패했습니다.");
      }
    },
    onError: () => {
      alert("작업 삭제 중 오류가 발생했습니다.");
    },
  });

  // 워크스페이스 제목 업데이트 (수정)
  const updateWorkspaceTitleMutation = useMutation({
    mutationFn: ({ id, title }: { id: string; title: string }) =>
      updateWorkspaceTitle(id, title),
    onSuccess: (result, { id }) => {
      if (result.success && result.workspace) {
        // 캐시 데이터 업데이트
        queryClient.setQueryData(["workspaces"], (oldData: WorkItem[] = []) =>
          oldData.map((item) => (item.id === id ? result.workspace : item))
        );
      } else {
        alert(result.error || "작업 이름 변경에 실패했습니다.");
      }
      // 모달 닫기
      setEditingChat(null);
      setIsModalOpen(false);
    },
    onError: () => {
      alert("작업 이름 변경 중 오류가 발생했습니다.");
      setEditingChat(null);
      setIsModalOpen(false);
    },
  });

  // 새 워크스페이스 생성 (생성)
  const createWorkspaceMutation = useMutation({
    mutationFn: createWorkspace,
    onSuccess: (newWorkspace) => {
      // 캐시에 새 항목 추가
      queryClient.setQueryData(["workspaces"], (oldData: WorkItem[] = []) => [
        newWorkspace,
        ...oldData,
      ]);
      setIsModalOpen(false);
    },
    onError: () => {
      alert("작업을 생성하는 중 오류가 발생했습니다.");
      setIsModalOpen(false);
    },
  });

  // ===== 이벤트 핸들러 =====
  // 목록 정렬하기
  const sortedWorks = [...works].sort((a, b) => {
    if (sort === "latest") {
      // 최근 사용순
      return (
        new Date(b.lastUsedAt).getTime() - new Date(a.lastUsedAt).getTime()
      );
    } else {
      // 생성순
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  // 삭제 버튼 클릭
  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // 부모 요소 클릭 이벤트 방지

    if (
      window.confirm(
        "이 작업을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
      )
    ) {
      deleteWorkspaceMutation.mutate(id);
    }

    setOptionOpenId(null); // 옵션 메뉴 닫기
  };

  // 이름 변경 클릭 - 모달 열기
  const handleRenameClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const chat = works.find((c) => c.id === id);
    if (chat) {
      setEditingChat({ id, title: chat.title });
      setModalMode("edit");
      setIsModalOpen(true);
    }
    setOptionOpenId(null);
  };

  // 이름 변경 확인
  const handleRenameConfirm = (newTitle: string) => {
    if (editingChat) {
      updateWorkspaceTitleMutation.mutate({
        id: editingChat.id,
        title: newTitle,
      });
    }
  };

  // 새 작업 생성 버튼 클릭
  const handleCreateClick = () => {
    setModalMode("create");
    setEditingChat(null);
    setIsModalOpen(true);
  };

  // 새 작업 생성 확인
  const handleCreateConfirm = (title: string) => {
    createWorkspaceMutation.mutate(title);
  };

  // 모달 확인 버튼 클릭 처리
  const handleModalConfirm = (title: string) => {
    if (modalMode === "create") {
      handleCreateConfirm(title);
    } else {
      handleRenameConfirm(title);
    }
  };

  // 항목 클릭 - 상세 페이지로 이동
  const handleCardClick = (id: string) => {
    router.push(`/workspaces/${id}`);
  };

  // 도움말 보기 버튼 클릭
  const handleShowTutorial = async () => {
    if (view === "list") {
      setView("grid");
    }
    await resetUserTutorialStatus();
    queryClient.invalidateQueries({ queryKey: ["user"] });
    setShowTutorial(true);
    setTutorialKey(Date.now());
  };

  // ===== 렌더링 함수 =====
  // 현재 선택된 뷰에 따라 컴포넌트 렌더링
  const renderViewComponent = () => {
    const viewProps = {
      chats: sortedWorks,
      optionOpenId,
      setOptionOpenId,
      handleCardClick,
      handleRename: handleRenameClick,
      handleDelete,
    };

    return view === "grid" ? (
      <GridView {...viewProps} />
    ) : (
      <ListView {...viewProps} />
    );
  };

  // 페이지 내용 렌더링 (로딩/비어있음/목록)
  const renderPageContent = () => {
    // 로딩 중일 때
    if (isLoadingWorkspaces) {
      return (
        <div className={styles.emptyStateContainer}>
          <div className={styles.emptyState}>
            <p className={styles.loadingText}>작업을 불러오는 중입니다...</p>
          </div>
        </div>
      );
    }

    if (showTutorial && works.length === 0) {
      return (
        <GridView
          chats={[
            {
              id: "0",
              title: "나의 작업!",
              _count: { history: 7 },
              createdAt: new Date(),
              lastUsedAt: new Date(),
            },
          ]}
          optionOpenId={null}
          setOptionOpenId={() => {}}
          handleCardClick={() => {}}
          handleRename={() => {}}
          handleDelete={() => {}}
        />
      );
    }

    // 작업이 없을 때
    if (works.length === 0) {
      return (
        <div className={styles.emptyStateContainer}>
          <div className={styles.emptyState}>
            <p>현재 진행중인 작업이 없습니다.</p>
            <p>작업을 만들어보세요!</p>
          </div>
        </div>
      );
    }

    // 작업이 있을 때 목록 표시
    return renderViewComponent();
  };

  // 로딩 상태 통합 (모달에서 사용)
  const isLoading =
    deleteWorkspaceMutation.isPending ||
    updateWorkspaceTitleMutation.isPending ||
    createWorkspaceMutation.isPending;

  return (
    <>
      <div className={styles.container}>
        <div className={styles.titleContainer}>
          <div className={styles.title}>나의 작업 공간</div>
          <button
            className={styles.helpButton}
            onClick={handleShowTutorial}
          >
            도움말 보기
          </button>
        </div>

        {/* 탑 바 컴포넌트 */}
        <TopBar
          view={view}
          setView={setView}
          sort={sort}
          setSort={setSort}
          onCreateClick={handleCreateClick}
        />

        {/* 페이지 내용 */}
        {renderPageContent()}
      </div>

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

      {/* 튜토리얼 모달 */}
      <TutorialModal
        key={tutorialKey}
        isOpen={showTutorial}
        onClose={handleTutorialClose}
      />
    </>
  );
}
