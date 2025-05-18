"use server";

import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { processLiteraryText } from "@/utils/ai";
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
  const responseFromAIServer = await processLiteraryText(text);

  if (responseFromAIServer.error) {
    throw new Error(responseFromAIServer.error);
  }

  const newHistory = await prisma.workspaceHistory.create({
    data: {
      workspaceId,
      userRequest: text,
      status: "COMPLETED",
    },
  });

  const newAIResponse = await prisma.aIResponse.create({
    data: {
      workspaceHistoryId: newHistory.id,
      text: JSON.stringify(responseFromAIServer),
      // details: {
      //   create: responseFromAIServer.details,
      // },
    },
    // include: {
    //   details: true,
    // },
  });

  // workspaces의 최근 사용 시간을 업데이트
  await prisma.workspace.update({
    where: {
      id: workspaceId,
    },
    data: {
      lastUsedAt: new Date(),
    },
  });

  // History 업데이트를 위한 revalidatePath
  revalidatePath(`/workspaces/${workspaceId}`);

  return newAIResponse;
}
