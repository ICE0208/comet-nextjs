"use server";

import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getWorkspaceById(id: string) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    redirect("/");
  }

  const workspace = await prisma.workspace.findUnique({
    where: {
      id,
      userId: currentUser.id,
    },
    include: {
      history: {
        include: {
          aiResponse: true,
          historyFavorite: true,
        },

        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!workspace) {
    redirect("/workspaces");
  }

  return workspace;
}

export async function submitWork(
  workspaceId: string,
  text: string
  // selectedOptions: string[]
) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    redirect("/");
  }

  // 히스토리를 추가할 workspace에 대한 접근 권한 확인
  const workspace = await prisma.workspace.findUnique({
    where: {
      id: workspaceId,
      userId: currentUser.id,
    },
  });

  if (!workspace) {
    redirect("/workspaces");
  }

  // 워크스페이스 히스토리 생성
  const newWorkspaceHistory = await prisma.workspaceHistory.create({
    data: {
      workspaceId,
      userRequest: text,
      status: "PENDING",
    },
  });

  fetch("http://icehome.hopto.org:5005/correction", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text, historyId: newWorkspaceHistory.id }),
  });
  // if (!aiResult.ok) {
  //   throw new Error("AI 요청 실패");
  // }

  // History 업데이트를 위한 revalidatePath
  revalidatePath(`/workspaces/${workspaceId}`);

  return newWorkspaceHistory.id;
}

export async function toggleFavorite(historyId: string) {
  // 로그인 여부 확인
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    redirect("/");
  }

  const history = await prisma.workspaceHistory.findUnique({
    where: {
      id: historyId,
    },
    select: {
      workspace: {
        select: {
          userId: true,
          id: true,
        },
      },
      historyFavorite: true,
    },
  });

  // 히스토리 존재 여부 확인
  if (!history) {
    redirect("/workspaces");
  }

  // 히스토리 소유자 확인
  const owner = history.workspace.userId;
  if (owner !== currentUser.id) {
    redirect("/workspaces");
  }

  // 즐겨찾기 상태 토글
  if (history.historyFavorite) {
    await prisma.historyFavorite.delete({
      where: {
        id: history.historyFavorite.id,
      },
    });
  } else {
    await prisma.historyFavorite.create({
      data: {
        workspaceHistoryId: historyId,
      },
    });
  }

  revalidatePath(`/workspaces/${history.workspace.id}`);

  return {
    success: true,
  };
}
