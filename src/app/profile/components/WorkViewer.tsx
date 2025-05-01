import Link from "next/link";
import styles from "./WorkViewer.module.css";
import Image from "next/image";
import { novelLibraryAction } from "../actions";

type NovelLibrary = Awaited<ReturnType<typeof novelLibraryAction>>;
interface WorkViewerProps {
  activeTab: "works" | "liked";
  novelLibrary: NovelLibrary | null;
}

export const WorkViewer = ({ activeTab, novelLibrary }: WorkViewerProps) => {
  if (novelLibrary === null) {
    return <div className={styles.message}>로딩중...</div>;
  }

  if (activeTab === "works") {
    if (novelLibrary.novels.length === 0) {
      return <div className={styles.message}>내 작품이 없습니다.</div>;
    }

    return (
      <div className={styles.worksList}>
        {novelLibrary?.novels.map((n) => (
          <Link
            href={`/novel/${n.id}`}
            key={n.id}
            className={styles.workItem}
            style={{ textDecoration: "none" }} // 인라인 스타일로 밑줄 제거 추가
          >
            <div className={styles.workCover}>
              <Image
                src={n.imageUrl}
                alt={n.title}
                width={80}
                height={120}
                className="h-full w-full object-cover"
              />
            </div>
            <div className={styles.workInfo}>
              <div>
                <h3 className={styles.workTitle}>{n.title}</h3>
                <p className={styles.workDescription}>{n.description}</p>
              </div>
              <div className={styles.workMeta}>
                <div className={styles.workMetaItem}>
                  <MessageIcon className={styles.icon} />
                  <span>-- 리뷰</span>
                </div>
                <div className={styles.workMetaItem}>
                  <UsersIcon className={styles.icon} />
                  <span>-- 독자</span>
                </div>
                <div className={styles.workMetaItem}>
                  <CalendarIcon className={styles.icon} />
                  <span>출판 {n.createdAt.toISOString().slice(0, 7)}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  } else if (activeTab === "liked") {
    if (novelLibrary.novelLikes.length === 0) {
      return <div className={styles.message}>좋아요 한 작품이 없습니다.</div>;
    }

    return (
      <div className={styles.likedGrid}>
        {novelLibrary?.novelLikes.map((n) => (
          <Link
            href={`/novel/${n.novelId}`}
            key={n.novelId}
            className={styles.likedItem}
            style={{ textDecoration: "none" }} // 인라인 스타일로 밑줄 제거 추가
          >
            <div className={styles.likedCover}>
              <Image
                src={n.novel.imageUrl}
                alt={n.novel.title}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 30vw, 20vw"
                className="object-cover"
              />
            </div>
            <h3 className={styles.likedTitle}>{n.novel.title}</h3>
            <p className={styles.likedAuthor}>저자: {n.novel.author.userId}</p>
          </Link>
        ))}
      </div>
    );
  } else {
    return <div className={styles.message}>잘못된 activeTab 입니다.</div>;
  }
};

function MessageIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle
        cx="9"
        cy="7"
        r="4"
      />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect
        width="18"
        height="18"
        x="3"
        y="4"
        rx="2"
        ry="2"
      />
      <line
        x1="16"
        x2="16"
        y1="2"
        y2="6"
      />
      <line
        x1="8"
        x2="8"
        y1="2"
        y2="6"
      />
      <line
        x1="3"
        x2="21"
        y1="10"
        y2="10"
      />
    </svg>
  );
}
