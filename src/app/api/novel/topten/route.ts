"use server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function GET() {
  try {
    const novel = await prisma.novel.findMany({
      include: {
        author: {
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            novelLike: true,
          },
        },
      },
      orderBy: {
        novelLike: {
          _count: "desc",
        },
      },
      take: 10,
    });

    if (!novel) {
      redirect("/");
    }
    return NextResponse.json({
      novels: novel,
    });
  } catch {
    return redirect("/");
  }
}
