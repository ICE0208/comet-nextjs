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
          aiResponse: {
            include: {
              details: true,
            },
          },
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

  // ! AI Server에 요청하는 부분
  // ! 실제로는 요청 후, 대기 상태로 나타내고
  // !요청 처리 후, 결과를 표시하는 것으로 변경함
  // const responseFromAIServer = await processLiteraryText(text);

  // if (responseFromAIServer.error) {
  //   throw new Error(responseFromAIServer.error);
  // }

  // const newHistory = await prisma.workspaceHistory.create({
  //   data: {
  //     workspaceId,
  //     userRequest: text,
  //     status: "COMPLETED",
  //     aiResponse: {
  //       create: {
  //         text: JSON.stringify(responseFromAIServer),
  //       },
  //     },
  //   },
  //   include: {
  //     aiResponse: true,
  //   },
  // });

  // // workspaces의 최근 사용 시간을 업데이트
  // await prisma.workspace.update({
  //   where: {
  //     id: workspaceId,
  //   },
  //   data: {
  //     lastUsedAt: new Date(),
  //   },
  // });

  const aiResult = await fetch("http://localhost:5005/correction", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text, workspaceId }),
  });
  if (!aiResult.ok) {
    throw new Error("AI 요청 실패");
  }

  const aiResultJson = await aiResult.json();

  // History 업데이트를 위한 revalidatePath
  revalidatePath(`/workspaces/${workspaceId}`);

  return aiResultJson;
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
