"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import styles from "./page.module.css";
import { profileInfoAction, getTokenStats, getQueueStatusAll } from "./actions";
import Badge from "@/components/ui/Badge";

// 큐 상태 타입 정의
type QueueStatus = {
  totalUserJobs: number;
  runningJobs: number;
  availableSlots: number;
};

type QueueStatusAll = {
  basic: QueueStatus;
  pro: QueueStatus;
};

type ProfileInfo = Awaited<ReturnType<typeof profileInfoAction>>;
type TokenStats = Awaited<ReturnType<typeof getTokenStats>>;
type ViewType = "overview" | "usage";

export default function ProfilePage() {
  const [profileInfo, setProfileInfo] = useState<ProfileInfo | null>(null);
  const [tokenStats, setTokenStats] = useState<TokenStats | null>(null);
  const [queueStatus, setQueueStatus] = useState<QueueStatusAll | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>("overview");
  const [selectedPeriod, setSelectedPeriod] = useState<"7d" | "30d">("7d");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [profile, stats, queue] = await Promise.all([
          profileInfoAction(),
          getTokenStats(),
          getQueueStatusAll(),
        ]);
        setProfileInfo(profile);
        setTokenStats(stats);
        setQueueStatus(queue);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 뷰 전환 시 스크롤을 맨 위로 이동
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [currentView]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const queue = await getQueueStatusAll();
      setQueueStatus(queue);
    } catch (error) {
      console.error("Failed to refresh queue status:", error);
    } finally {
      setTimeout(() => {
        setIsRefreshing(false);
      }, 800);
    }
  };

  if (!profileInfo || loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>데이터를 불러오는 중...</div>
      </div>
    );
  }

  const formatNumber = (num: number) => num.toLocaleString();
  const formatDate = (date: Date) => {
    const d = new Date(date);
    return `${d.getMonth() + 1}월 ${d.getDate()}일, ${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
  };

  // 기간별 데이터 필터링
  const getFilteredData = () => {
    if (!tokenStats) return [];

    const days = selectedPeriod === "7d" ? 7 : 30;
    return tokenStats.dailyUsage.slice(-days);
  };

  // 선택된 기간의 통계 계산
  const getPeriodStats = () => {
    if (!tokenStats) return { corrections: 0, tokens: 0, proUsage: 0 };

    const days = selectedPeriod === "7d" ? 7 : 30;
    const periodData = tokenStats.dailyUsage.slice(-days);

    const corrections = periodData.reduce(
      (total, day) => total + day.corrections,
      0
    );
    const tokens = periodData.reduce((total, day) => total + day.tokens, 0);

    // Pro 사용량은 recentUsage에서 계산 (dailyUsage에는 Pro/Basic 구분이 없음)
    const currentDate = new Date();
    const periodHistory = tokenStats.recentUsage.filter((usage) => {
      const usageDate = new Date(usage.date);
      const diffTime = currentDate.getTime() - usageDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= days;
    });
    const proUsage = periodHistory.filter(
      (usage) => usage.kind === "Pro"
    ).length;

    return { corrections, tokens, proUsage };
  };

  // 현재 월 토큰 사용량 계산 (dailyUsage 기반)
  const getCurrentMonthTokens = () => {
    if (!tokenStats) return 0;

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;

    return tokenStats.dailyUsage
      .filter((day) => {
        const [month] = day.date.split("/").map(Number);
        return month === currentMonth;
      })
      .reduce((total, day) => total + day.tokens, 0);
  };

  // 동적 날짜 범위 생성
  const getDateRange = () => {
    const today = new Date();
    const days = selectedPeriod === "7d" ? 7 : 30;
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - days + 1);

    const formatDateRange = (date: Date) =>
      `${date.getMonth() + 1}월 ${date.getDate().toString().padStart(2, "0")}일`;

    return `${formatDateRange(startDate)} - ${formatDateRange(today)}`;
  };

  // 큐 상태 바 컴포넌트
  const QueueStatusBar = ({
    queueStatus,
    label,
    isRefreshing,
  }: {
    queueStatus: QueueStatus;
    label: string;
    isRefreshing: boolean;
  }) => {
    const currentJobs = queueStatus.totalUserJobs;
    const totalSlots = queueStatus.totalUserJobs + queueStatus.availableSlots;
    const percentage = totalSlots > 0 ? (currentJobs / totalSlots) * 100 : 0;

    if (isRefreshing) {
      return (
        <div className={styles.queueStatusBar}>
          <div className={styles.queueBarHeader}>
            <span className={styles.queueLabel}>{label} 작업 현황</span>
            <span className={styles.queuePercentage}>새로고침 중...</span>
          </div>
          <div className={styles.queueProgressBar}>
            <div className={styles.queueProgressSkeleton} />
          </div>
          <div className={styles.queueStats}>
            <span>현재 작업: --개</span>
            <span>사용 가능: --개</span>
          </div>
        </div>
      );
    }

    return (
      <div className={styles.queueStatusBar}>
        <div className={styles.queueBarHeader}>
          <span className={styles.queueLabel}>{label} 작업 현황</span>
          <span className={styles.queuePercentage}>
            {percentage.toFixed(0)}% 사용 중
          </span>
        </div>
        <div className={styles.queueProgressBar}>
          <div
            className={styles.queueProgressFill}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className={styles.queueStats}>
          <span>현재 작업: {currentJobs}개</span>
          <span>사용 가능: {queueStatus.availableSlots}개</span>
        </div>
      </div>
    );
  };

  // Overview 뷰 렌더링
  const renderOverview = () => (
    <>
      {/* 큐 상태 정보 */}
      {queueStatus && (
        <div className={styles.queueSection}>
          <div className={styles.queueSectionHeader}>
            <h3 className={styles.queueSectionTitle}>작업 현황</h3>
            <button
              className={styles.refreshBtn}
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={isRefreshing ? styles.refreshSpinner : ""}
              >
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                <path d="M3 21v-5h5" />
              </svg>
              새로고침
            </button>
          </div>
          <div className={styles.queueBarsContainer}>
            <QueueStatusBar
              queueStatus={queueStatus.basic}
              label="Basic"
              isRefreshing={isRefreshing}
            />
            <QueueStatusBar
              queueStatus={queueStatus.pro}
              label="Pro"
              isRefreshing={isRefreshing}
            />
          </div>
        </div>
      )}

      {/* 사용량 정보 */}
      <div className={styles.usageOverview}>
        <div className={styles.usageStats}>
          <div className={styles.primaryStat}>
            <span className={styles.usageNumber}>
              {formatNumber(getCurrentMonthTokens())}
            </span>
            <span className={styles.usageLimit}>
              / {formatNumber(tokenStats?.tokenLimit || 100000)}
            </span>
          </div>
          <div className={styles.usageLabel}>
            {new Date().getMonth() + 1}월 토큰 사용량
          </div>

          {/* 진행바 추가 */}
          <div className={styles.progressSection}>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{
                  width: `${Math.min((getCurrentMonthTokens() / (tokenStats?.tokenLimit || 100000)) * 100, 100)}%`,
                }}
              />
            </div>
            <div className={styles.progressLabels}>
              <span>
                {Math.round(
                  (getCurrentMonthTokens() /
                    (tokenStats?.tokenLimit || 100000)) *
                    100
                )}
                % 사용
              </span>
              <span>
                {formatNumber(
                  (tokenStats?.tokenLimit || 100000) - getCurrentMonthTokens()
                )}{" "}
                남음
              </span>
            </div>

            {/* 토큰 한도 증가 문의 */}
            <div className={styles.contactSection}>
              <p className={styles.contactText}>
                토큰 한도 증가가 필요하신가요?{" "}
                <a
                  href={`mailto:seojunlee27@naver.com?subject=토큰 한도 증가 문의&body=안녕하세요,%0A%0A토큰 한도 증가를 요청드립니다.%0A%0A현재 사용량: ${getCurrentMonthTokens()}토큰%0A현재 한도: ${tokenStats?.tokenLimit || 100000}토큰%0A%0A감사합니다.`}
                  className={styles.contactBtn}
                >
                  관리자에게 문의하기
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 기간 선택 */}
      <div className={styles.usageSection}>
        <h3 className={styles.usageSectionTitle}>최근 사용량</h3>
        <div className={styles.periodSelector}>
          <div className={styles.periodTabs}>
            <button
              className={`${styles.periodTab} ${selectedPeriod === "7d" ? styles.active : ""}`}
              onClick={() => setSelectedPeriod("7d")}
            >
              7일
            </button>
            <button
              className={`${styles.periodTab} ${selectedPeriod === "30d" ? styles.active : ""}`}
              onClick={() => setSelectedPeriod("30d")}
            >
              30일
            </button>
            <span className={styles.dateRangeDisplay}>{getDateRange()}</span>
          </div>
          <button
            className={styles.viewUsageBtn}
            onClick={() => setCurrentView("usage")}
          >
            사용량 보기
          </button>
        </div>
      </div>

      {/* Your Analytics */}
      <div className={styles.analyticsSection}>
        <h2>사용 통계</h2>
        <div className={styles.analyticsGrid}>
          <div className={styles.analyticCard}>
            <div className={styles.analyticNumber}>
              {formatNumber(getPeriodStats().corrections)}
            </div>
            <div className={styles.analyticLabel}>총 교정 횟수</div>
          </div>
          <div className={styles.analyticCard}>
            <div className={styles.analyticNumber}>
              {formatNumber(getPeriodStats().tokens)}
            </div>
            <div className={styles.analyticLabel}>토큰 사용량</div>
          </div>
          <div className={styles.analyticCard}>
            <div className={styles.analyticNumber}>
              {formatNumber(getPeriodStats().proUsage)}
            </div>
            <div className={styles.analyticLabel}>Pro 모드 사용 횟수</div>
          </div>
        </div>

        {/* 차트 */}
        <div className={styles.chartContainer}>
          {(() => {
            const filteredData = getFilteredData();
            console.log("Filtered data:", filteredData);
            console.log("Selected period:", selectedPeriod);

            if (
              !tokenStats ||
              filteredData.length === 0 ||
              !filteredData.some((d) => d.tokens > 0)
            ) {
              return (
                <div className={styles.noChartData}>
                  <p>선택한 기간에 데이터가 없습니다.</p>
                </div>
              );
            }

            // Recharts에 맞는 데이터 형태로 변환
            const chartData = filteredData.map((item, index) => ({
              name: item.date,
              tokens: item.tokens,
              inputTokens: item.inputTokens,
              outputTokens: item.outputTokens,
              index,
            }));

            console.log("Chart data with tokens:", chartData);
            console.log("Sample item:", filteredData[0]);

            return (
              <div className={styles.rechartsContainer}>
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <LineChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#9ca3af" }}
                      interval={0}
                      angle={0}
                      textAnchor="middle"
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#9ca3af" }}
                      tickFormatter={(value) =>
                        value === 0 ? "0" : `${Math.round(value / 1000)}k`
                      }
                    />
                    <Tooltip
                      labelFormatter={(label) => `${label}`}
                      formatter={(value: number, name: string) => {
                        if (name === "tokens") return null; // 총 토큰은 별도로 표시
                        return null;
                      }}
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          console.log("Tooltip data:", data);

                          return (
                            <div
                              style={{
                                backgroundColor: "#ffffff",
                                border: "1px solid #e5e7eb",
                                borderRadius: "8px",
                                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                fontSize: "14px",
                                padding: "12px",
                              }}
                            >
                              <p
                                style={{
                                  color: "#374151",
                                  fontWeight: "600",
                                  margin: "0 0 8px 0",
                                }}
                              >
                                {label}
                              </p>
                              <p
                                style={{
                                  margin: "0 0 4px 0",
                                  color: "#6b7280",
                                }}
                              >
                                입력 토큰:{" "}
                                {(data.inputTokens || 0).toLocaleString()}개
                              </p>
                              <p
                                style={{
                                  margin: "0 0 4px 0",
                                  color: "#6b7280",
                                }}
                              >
                                출력 토큰:{" "}
                                {(data.outputTokens || 0).toLocaleString()}개
                              </p>
                              <p
                                style={{
                                  margin: "0",
                                  color: "#374151",

                                  fontWeight: "600",
                                }}
                              >
                                총 토큰: {(data.tokens || 0).toLocaleString()}개
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Line
                      type="linear"
                      dataKey="tokens"
                      stroke="#10b981"
                      strokeWidth={1.5}
                      dot={{
                        fill: "#10b981",
                        strokeWidth: 2,
                        stroke: "#ffffff",
                        r: 3,
                      }}
                      activeDot={{
                        r: 4,
                        fill: "#10b981",
                        stroke: "#ffffff",
                        strokeWidth: 2,
                      }}
                      animationDuration={300}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            );
          })()}
        </div>
      </div>
    </>
  );

  // Usage 뷰 렌더링 (기존 표 형식)
  const renderUsage = () => (
    <div className={styles.tableSection}>
      <div className={styles.tableHeader}>
        <h2>최근 토큰 사용 내역</h2>
        <div className={styles.tableControls}>
          <button
            className={styles.backBtn}
            onClick={() => setCurrentView("overview")}
          >
            ← 개요로 돌아가기
          </button>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.usageTable}>
          <thead>
            <tr>
              <th>날짜</th>
              <th>워크스페이스</th>
              <th>모드</th>
              <th>요청 내용</th>
              <th>입력 토큰</th>
              <th>출력 토큰</th>
              <th>총 토큰</th>
            </tr>
          </thead>
          <tbody>
            {tokenStats?.recentUsage.map((usage) => (
              <tr key={usage.id}>
                <td className={styles.dateCell}>{formatDate(usage.date)}</td>
                <td className={styles.workspaceCell}>{usage.workspace}</td>
                <td>
                  <span
                    className={`${styles.planBadge} ${usage.kind === "Pro" ? styles.proBadge : styles.basicBadge}`}
                  >
                    {usage.kind}
                  </span>
                </td>
                <td className={styles.requestCell}>{usage.userRequest}</td>
                <td className={styles.numberCell}>
                  {formatNumber(usage.inputTokens)}
                </td>
                <td className={styles.numberCell}>
                  {formatNumber(usage.outputTokens)}
                </td>
                <td className={styles.numberCell}>
                  {formatNumber(usage.totalTokens)}
                </td>
              </tr>
            )) || []}
          </tbody>
        </table>

        {(!tokenStats?.recentUsage || tokenStats.recentUsage.length === 0) && (
          <div className={styles.noData}>
            <p>선택한 기간에 데이터가 없습니다.</p>
          </div>
        )}
      </div>

      {tokenStats?.recentUsage && tokenStats.recentUsage.length > 0 && (
        <div className={styles.tableFooter}>
          <span>1 - {tokenStats.recentUsage.length}개 항목 표시 중</span>
          <div className={styles.pagination}>
            <button
              className={styles.pageBtn}
              disabled
            >
              이전
            </button>
            <span className={styles.pageInfo}>페이지 1 / 1</span>
            <button
              className={styles.pageBtn}
              disabled
            >
              다음
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className={styles.container}>
      {/* 헤더 섹션 */}
      <div className={styles.header}>
        <div className={styles.profileSection}>
          <Image
            src="/images/profile-temp/profile.jpg"
            alt={profileInfo.userId}
            width={60}
            height={60}
            className={styles.profileImage}
            priority={true}
          />
          <div className={styles.profileInfo}>
            <div className={styles.nameSection}>
              <h1 className={styles.profileName}>{profileInfo.userId}</h1>
              <Badge
                variant="pro"
                size="sm"
              >
                Pro
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* 현재 뷰에 따라 렌더링 */}
      {currentView === "overview" ? renderOverview() : renderUsage()}
    </div>
  );
}
