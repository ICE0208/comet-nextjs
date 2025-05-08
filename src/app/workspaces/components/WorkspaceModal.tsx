import React, { useEffect } from "react";
import styles from "./WorkspaceModal.module.css";

interface WorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (title: string) => void;
  initialValue?: string;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export default function WorkspaceModal({
  isOpen,
  onClose,
  onConfirm,
  initialValue = "",
  mode,
  isLoading = false,
}: WorkspaceModalProps) {
  const [title, setTitle] = React.useState(initialValue);

  // 모달이 열릴 때마다 초기값 설정
  useEffect(() => {
    if (isOpen) {
      setTitle(initialValue);
    }
  }, [isOpen, initialValue]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && !isLoading) {
      onConfirm(title);
      setTitle("");
    }
  };

  const modalTitle = mode === "create" ? "새 작업 만들기" : "작업 이름 편집";
  const confirmText = mode === "create" ? "만들기" : "저장";

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>{modalTitle}</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="workspace-title">작업 이름</label>
            <input
              id="workspace-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="작업 이름을 입력하세요"
              autoFocus
              disabled={isLoading}
            />
          </div>
          <div className={styles.buttons}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={() => {
                setTitle(initialValue);
                onClose();
              }}
              disabled={isLoading}
            >
              취소
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={!title.trim() || isLoading}
            >
              {isLoading ? "처리 중..." : confirmText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
