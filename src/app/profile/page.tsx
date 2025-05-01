"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import { novelLibraryAction, profileInfoAction } from "./actions";

type ProfileInfo = Awaited<ReturnType<typeof profileInfoAction>>;
type NovelLibrary = Awaited<ReturnType<typeof novelLibraryAction>>;

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"works" | "liked">("works");

  const [profileInfo, setProfileInfo] = useState<ProfileInfo | null>(null);
  const [novelLibrary, setNovelLibrary] = useState<NovelLibrary | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const [profile, library] = await Promise.all([
        profileInfoAction(),
        novelLibraryAction(),
      ]);
      setProfileInfo(profile);
      setNovelLibrary(library);
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 헤더 배경 이미지 */}
      <div className={styles.header}>
        <div className="absolute -bottom-16 left-8">
          <Image
            src="/images/profile-temp/profile.jpg"
            alt={profileInfo?.userId ?? "----"}
            width={120}
            height={120}
            className={styles.profileImage}
            priority={true}
          />
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className={styles.container}>
        <div className={styles.content}>
          {/* 왼쪽 컬럼 - 사용자 정보 */}
          <div className="space-y-6">
            <div className={styles.profileCard}>
              <div>
                <h1 className={styles.profileName}>
                  {profileInfo?.userId ?? "----"}
                </h1>
                <div className={styles.profileLocation}>
                  <MapIcon className={styles.icon} />
                  <span>{profileInfo?.location ?? "------"}</span>
                </div>
                <div className={styles.badgeContainer}>
                  <span className={`${styles.badge} ${styles.badgePrimary}`}>
                    픽션
                  </span>
                  <span className={`${styles.badge} ${styles.badgeSecondary}`}>
                    미스터리
                  </span>
                </div>
                <div className={styles.followerInfo}>
                  <button className={styles.followerItem}>
                    <span className={styles.followerCount}>
                      {profileInfo?.followCount.follower ?? "--"}
                    </span>
                    <span className={styles.followerLabel}>팔로워</span>
                  </button>
                  <button className={styles.followerItem}>
                    <span className={styles.followerCount}>
                      {profileInfo?.followCount.following ?? "--"}
                    </span>
                    <span className={styles.followerLabel}>팔로잉</span>
                  </button>
                </div>
              </div>

              <div className={styles.divider} />

              <div>
                <h2 className={styles.cardTitle}>소개</h2>
                <p className={styles.aboutText}>
                  {profileInfo?.about ?? "-".repeat(150)}
                </p>
              </div>

              <div className={styles.divider} />

              <div>
                <h2 className={styles.cardTitle}>통계</h2>
                <div className={styles.statsGrid}>
                  <div className={styles.statItem}>
                    <div className={styles.statLabel}>작품</div>
                    <div className={styles.statValue}>
                      {profileInfo?.stats.novelCount ?? "--"}
                    </div>
                  </div>
                  <div className={styles.statItem}>
                    <div className={styles.statLabel}>독자</div>
                    <div className={styles.statValue}>
                      {profileInfo?.stats.readerCount ?? "--"}
                    </div>
                  </div>
                  <div className={styles.statItem}>
                    <div className={styles.statLabel}>리뷰</div>
                    <div className={styles.statValue}>
                      {profileInfo?.stats.reviewCount ?? "--"}
                    </div>
                  </div>
                  <div className={styles.statItem}>
                    <div className={styles.statLabel}>평점</div>
                    <div className={styles.statValue}>
                      {profileInfo?.stats.averageRating ?? "--"}
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.divider} />

              <div>
                <h2 className={styles.cardTitle}>연결하기</h2>
                <div className={styles.socialLinks}>
                  <button className={styles.socialButton}>
                    <TwitterIcon className={styles.icon} />
                  </button>
                  <button className={styles.socialButton}>
                    <LinkedinIcon className={styles.icon} />
                  </button>
                  <button className={styles.socialButton}>
                    <GithubIcon className={styles.icon} />
                  </button>
                  <button className={styles.socialButton}>
                    <InstagramIcon className={styles.icon} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 오른쪽 컬럼 - 작품 */}
          <div className={styles.publicationsCard}>
            <div className={styles.publicationsHeader}>
              <h2 className={styles.publicationsTitle}>작품</h2>
              <p className={styles.publicationsSubtitle}>
                작가의 작품과 추천 도서
              </p>
            </div>

            <div className={styles.tabsContainer}>
              <div className={styles.tabsList}>
                <div
                  className={`${styles.tabItem} ${activeTab === "works" ? styles.tabItemActive : ""}`}
                  onClick={() => setActiveTab("works")}
                >
                  내 작품
                </div>
                <div
                  className={`${styles.tabItem} ${activeTab === "liked" ? styles.tabItemActive : ""}`}
                  onClick={() => setActiveTab("liked")}
                >
                  좋아요 표시한 작품
                </div>
              </div>
            </div>

            {activeTab === "works" ? (
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
                        <p className={styles.workDescription}>
                          {n.description}
                        </p>
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
                          <span>
                            출판 {n.createdAt.toISOString().slice(0, 7)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
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
                    <p className={styles.likedAuthor}>
                      저자: {n.novel.author.userId}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// 아이콘 컴포넌트
function MapIcon({ className }: { className?: string }) {
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
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle
        cx="12"
        cy="10"
        r="3"
      />
    </svg>
  );
}

function TwitterIcon({ className }: { className?: string }) {
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
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
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
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect
        width="4"
        height="12"
        x="2"
        y="9"
      />
      <circle
        cx="4"
        cy="4"
        r="2"
      />
    </svg>
  );
}

function GithubIcon({ className }: { className?: string }) {
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
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
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
        width="20"
        height="20"
        x="2"
        y="2"
        rx="5"
        ry="5"
      />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line
        x1="17.5"
        x2="17.51"
        y1="6.5"
        y2="6.5"
      />
    </svg>
  );
}

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
