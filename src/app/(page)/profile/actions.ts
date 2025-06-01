"use server";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export const profileInfoAction = async () => {
  const userInfo = await getCurrentUser();
  if (!userInfo) {
    redirect("/");
  }

  const user = await prisma.user.findUnique({
    where: { id: userInfo.id },
    select: {
      _count: {
        select: {
          followers: true,
          following: true,
          novels: true,
        },
      },
    },
  });
  if (!user) {
    redirect("/");
  }

  const profileInfo = {
    userId: userInfo.userId,
    location: "-------",
    about: "-".repeat(150),
    followCount: {
      following: user._count.following,
      follower: user._count.followers,
    },
    stats: {
      novelCount: user._count.novels,
      readerCount: "--",
      reviewCount: "--",
      averageRating: "--",
    },
  };

  return profileInfo;
};

export const novelLibraryAction = async () => {
  const userInfo = await getCurrentUser();
  if (!userInfo) {
    redirect("/");
  }

  const novelLibrary = await prisma.user.findUnique({
    where: { id: userInfo.id },
    select: {
      novels: {
        select: {
          id: true,
          title: true,
          description: true,
          createdAt: true,
          imageUrl: true,
          _count: {
            select: {
              episodes: true,
              novelLike: true,
            },
          },
        },
      },
      novelLikes: {
        select: {
          novelId: true,
          novel: {
            select: {
              title: true,
              imageUrl: true,
              author: {
                select: {
                  userId: true,
                },
              },
            },
          },
        },
      },
    },
  });
  if (!novelLibrary) {
    redirect("/");
  }

  return novelLibrary;
};

export const getTokenStats = async () => {
  const userInfo = await getCurrentUser();
  if (!userInfo) {
    redirect("/");
  }

  // 사용자의 워크스페이스와 히스토리 데이터 조회
  const userData = await prisma.user.findUnique({
    where: { id: userInfo.id },
    select: {
      createdAt: true,
      workspaces: {
        select: {
          id: true,
          title: true,
          createdAt: true,
          lastUsedAt: true,
          history: {
            select: {
              id: true,
              createdAt: true,
              status: true,
              withPro: true,
              userRequest: true,
              aiResponse: {
                select: {
                  text: true,
                  details: {
                    select: {
                      type: true,
                      text: true,
                    },
                  },
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
            take: 100, // 최근 100개 항목만
          },
        },
      },
    },
  });

  if (!userData) {
    redirect("/");
  }

  // 통계 계산
  const allHistory = userData.workspaces.flatMap((w) => w.history);
  const completedHistory = allHistory.filter((h) => h.status === "COMPLETED");

  // 워크스페이스 매핑 생성 (효율성을 위해)
  const workspaceMap = new Map();
  userData.workspaces.forEach((workspace) => {
    workspace.history.forEach((history) => {
      workspaceMap.set(history.id, workspace.title);
    });
  });

  // 토큰 사용량 계산 함수
  const calculateTokenUsage = (history: typeof completedHistory) =>
    history.reduce((total, h) => {
      const inputTokens = h.userRequest.length;
      const outputTokens = h.aiResponse ? h.aiResponse.text.length * 2 : 0;
      return total + inputTokens + outputTokens;
    }, 0);

  // 1. 전체 통계
  const totalCorrections = completedHistory.length;
  const totalTokenUsage = calculateTokenUsage(completedHistory);

  // 2. 현재 월 토큰 한도 계산
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const currentMonthHistory = completedHistory.filter((h) => {
    const historyDate = new Date(h.createdAt);
    return (
      historyDate.getMonth() === currentMonth &&
      historyDate.getFullYear() === currentYear
    );
  });

  const currentMonthTokens = calculateTokenUsage(currentMonthHistory);
  const tokenLimit = 1000000; // 월 한도

  // 3. 최근 토큰 사용 내역 (표 형태)
  const recentUsage = completedHistory.slice(0, 50).map((h) => {
    const inputTokens = h.userRequest.length * 2;
    const outputTokens = h.aiResponse ? h.aiResponse.text.length * 2 : 0;
    const totalTokens = inputTokens + outputTokens;

    return {
      id: h.id,
      date: h.createdAt,
      workspace: workspaceMap.get(h.id) || "알 수 없음",
      kind: h.withPro ? "Pro" : "Basic",
      userRequest:
        h.userRequest.substring(0, 100) +
        (h.userRequest.length > 100 ? "..." : ""),
      inputTokens,
      outputTokens,
      totalTokens,
      status: h.status,
    };
  });

  // 4. 일별 사용량 (최근 30일)
  const dailyUsage = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];

    const dayHistory = completedHistory.filter((h) => {
      const historyDate = new Date(h.createdAt).toISOString().split("T")[0];
      return historyDate === dateStr;
    });

    const inputTokens = dayHistory.reduce(
      (total, h) => total + h.userRequest.length,
      0
    );
    const outputTokens = dayHistory.reduce(
      (total, h) => total + (h.aiResponse ? h.aiResponse.text.length * 2 : 0),
      0
    );
    const totalTokens = inputTokens + outputTokens;

    dailyUsage.push({
      date: `${date.getMonth() + 1}/${date.getDate()}`,
      inputTokens,
      outputTokens,
      tokens: totalTokens,
      corrections: dayHistory.length,
    });
  }

  console.log(
    "Daily usage data (real only):",
    dailyUsage.filter((d) => d.tokens > 0)
  );

  // 5. 주요 통계 (Your Analytics)
  const analytics = {
    linesOfAgentEdits: totalCorrections,
    tabsAccepted: completedHistory.filter((h) => h.withPro).length,
    requests: totalCorrections,
  };

  // 서비스 이용일
  const serviceUsageDays = Math.floor(
    (Date.now() - userData.createdAt.getTime()) / (1000 * 60 * 60 * 24)
  );

  return {
    // 전체 통계
    totalCorrections,
    totalTokenUsage,
    currentMonthTokens,
    tokenLimit,
    usagePercentage: Math.min((currentMonthTokens / tokenLimit) * 100, 100),
    serviceUsageDays,

    // 시각화 데이터
    analytics,

    // 표 데이터
    recentUsage,

    // 차트 데이터
    dailyUsage,
  };
};
