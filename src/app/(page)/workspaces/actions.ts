"use server";

import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function getWorkspaceList() {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    redirect("/auth/login");
  }

  const workspaceList = await prisma.workspace.findMany({
    where: {
      userId: currentUser.id,
      isDeleted: false,
    },
    select: {
      id: true,
      title: true,
      createdAt: true,
      lastUsedAt: true,
      _count: {
        select: {
          history: true,
        },
      },
    },
  });
  return workspaceList;
}

export async function createWorkspace(title: string) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    redirect("/");
  }

  const newWorkspace = await prisma.workspace.create({
    data: {
      title,
      userId: currentUser.id,
    },
    select: {
      id: true,
      title: true,
      createdAt: true,
      lastUsedAt: true,
      _count: {
        select: {
          history: true,
        },
      },
    },
  });
  return newWorkspace;
}

export async function updateWorkspaceTitle(id: string, title: string) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return {
        success: false,
        error: "로그인이 필요합니다.",
      };
    }

    // 먼저 해당 워크스페이스가 현재 사용자의 것인지 확인
    const workspace = await prisma.workspace.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!workspace) {
      return {
        success: false,
        error: "존재하지 않는 작업입니다.",
      };
    }

    if (workspace.userId !== currentUser.id) {
      return {
        success: false,
        error: "이 작업을 수정할 권한이 없습니다.",
      };
    }

    // 사용자 검증이 완료되면 업데이트 진행
    const updatedWorkspace = await prisma.workspace.update({
      where: { id },
      data: {
        title,
        // lastUsedAt: new Date(), // 수정 시 마지막 사용 시간도 업데이트
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        lastUsedAt: true,
        _count: {
          select: {
            history: true,
          },
        },
      },
    });
    return { success: true, workspace: updatedWorkspace };
  } catch {
    return { success: false, error: "작업 이름 업데이트에 실패했습니다." };
  }
}

export async function deleteWorkspace(id: string) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return {
        success: false,
        error: "로그인이 필요합니다.",
      };
    }

    // 해당 워크스페이스가 현재 사용자의 것인지 확인
    const workspace = await prisma.workspace.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!workspace) {
      return {
        success: false,
        error: "존재하지 않는 작업입니다.",
      };
    }

    if (workspace.userId !== currentUser.id) {
      return {
        success: false,
        error: "이 작업을 삭제할 권한이 없습니다.",
      };
    }

    // 사용자 검증이 완료되면 삭제 진행
    await prisma.workspace.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });

    return { success: true };
  } catch {
    return { success: false, error: "작업 삭제에 실패했습니다." };
  }
}

export async function updateUserTutorialStatus() {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    redirect("/");
  }

  await prisma.user.update({
    where: {
      id: currentUser.id,
    },
    data: {
      isTutorial: true,
    },
  });
}

export async function resetUserTutorialStatus() {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    redirect("/");
  }

  await prisma.user.update({
    where: {
      id: currentUser.id,
    },
    data: {
      isTutorial: false,
    },
  });
}
