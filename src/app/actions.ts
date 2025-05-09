"use server";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function novelData() {
  try {
    const novel = await prisma.novel.findMany({
      include: {
        author: {
          select: {
            userId: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!novel) {
      redirect("/");
    }
    return novel;
  } catch {
    return redirect("/");
  }
}
