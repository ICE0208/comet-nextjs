import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // 모든 프롬프트와 그에 관련된 옵션들을 불러옵니다
    const prompts = await prisma.prompt.findMany({
      include: {
        options: true,
      },
      orderBy: {
        createdAt: "desc", // 최신 항목부터 정렬
      },
    });

    return NextResponse.json({
      success: true,
      prompts,
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
