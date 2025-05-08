"use server";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function novelInfoData(id: string) {
  try {
    const novel = await prisma.novel.findUnique({
      where: {
        id,
      },
      include: {
        episodes: {
          select: {
            id: true,
            title: true,
            content: true,
            imageUrl: true,
            uploadDate: true,
          },
        },
        author: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!novel) {
      redirect("/");
    }
    return novel;
  } catch {
    return redirect("/prompt");
  }
}
