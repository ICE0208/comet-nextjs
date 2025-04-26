import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, selectedOptions } = body;

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    // Create a new prompt entry
    const newPrompt = await prisma.prompt.create({
      data: {
        text,
        options: {
          create: selectedOptions.map((option: string) => {
            // 여기서는 옵션의 id만 받아오므로 이름 매핑이 필요합니다
            const optionNames: Record<string, string> = {
              checkbox1: "문법 교정",
              checkbox2: "맞춤법 교정",
              checkbox3: "가독성 향상",
              checkbox4: "문체 개선",
              checkbox5: "일관성 유지",
            };

            return {
              optionId: option,
              optionName: optionNames[option] || option,
              isSelected: true,
            };
          }),
        },
      },
      include: {
        options: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        prompt: newPrompt,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
