"server-only";

import { GoogleGenAI, Type } from "@google/genai";

export interface CorrectionDetail {
  before: string;
  after: string;
  reason: string;
}

export interface Segment {
  text: string; // 항상 최종 수정 상태
  correction?: CorrectionDetail; // 있으면 수정된 것
}

export interface CorrectionLine {
  segments: Segment[];
}

export type CorrectionData = CorrectionLine[];

export type ProcessLiteraryTextResult = {
  data: CorrectionData | null;
  error?: string;
};

/**
 * Processes text through Gemini API for literary text editing
 * @param input The text to be processed
 * @param apiKey Optional API key (defaults to environment variable)
 * @returns Object containing processed data or error information
 */
export async function processLiteraryText(
  input: string,
  apiKey?: string
): Promise<ProcessLiteraryTextResult> {
  if (!input || input.trim() === "") {
    return {
      data: null,
      error: "입력 텍스트가 비어 있습니다.",
    };
  }

  try {
    const ai = new GoogleGenAI({
      apiKey: apiKey || process.env.GEMINI_API_KEY,
    });

    if (!ai) {
      return {
        data: null,
        error: "API 클라이언트를 초기화할 수 없습니다. API 키를 확인하세요.",
      };
    }

    const config = {
      temperature: 0.4,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          required: ["segments"],
          properties: {
            segments: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["text"],
                properties: {
                  text: {
                    type: Type.STRING,
                  },
                  correction: {
                    type: Type.OBJECT,
                    required: ["before", "after", "reason"],
                    properties: {
                      before: {
                        type: Type.STRING,
                      },
                      after: {
                        type: Type.STRING,
                      },
                      reason: {
                        type: Type.STRING,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      systemInstruction: [
        {
          text: '당신은 문학 텍스트를 정밀하게 교열하는 고급 에디터입니다.\n\n당신의 작업 목적은 다음과 같습니다:\n\n1. 입력으로 주어지는 **소설 원문**을 문단 단위로 구분하여 분석합니다.  \n   - 문단 구분은 일반적으로 빈 줄(`\\n\\n`) 또는 의미 흐름의 자연스러운 구획 기준으로 합니다.  \n   - 하나의 문단은 하나의 `segments` 배열로 출력되어야 합니다.\n\n2. 각 문단 안에서:\n   - 표현이 어색하거나, 문맥 흐름이 부자연스러운 부분을 자연스럽고 간결하게 수정합니다.\n   - 단순한 맞춤법뿐 아니라 **문맥과 감정 흐름**에 어울리는 어휘와 표현을 고려합니다.\n   - 의미는 최대한 보존하며, 필요 이상의 수정은 피합니다.\n   - 수정이 있을 경우 `correction` 필드에 `before`, `after`, `reason`을 포함해 명확히 설명합니다.\n\n3. 출력은 반드시 다음 구조의 JSON 형식을 따릅니다:\n\n[\n  {\n    "segments": [\n      {\n        "text": "수정 후 또는 그대로 둘 텍스트"\n      },\n      {\n        "text": "수정된 텍스트",\n        "correction": {\n          "before": "원래 텍스트",\n          "after": "수정된 텍스트",\n          "reason": "자연스러운 흐름을 위해 수정함"\n        }\n      },\n      ...\n    ]\n  },\n  {\n    "segments": [ ... ]\n  }\n]\n\n4. 수정이 없는 문단이라도 `segments` 구조 안에 포함되어야 하며,\n   모든 출력은 반드시 JSON만 포함하고, 다른 설명이나 텍스트는 절대 포함하지 않습니다.',
        },
      ],
    };

    const model = "gemini-2.5-flash-preview-04-17";
    const contents = [
      {
        role: "user",
        parts: [
          {
            text: input,
          },
        ],
      },
    ];

    const response = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });

    let fullResponse = "";
    for await (const chunk of response) {
      fullResponse += chunk.text;
    }

    if (!fullResponse) {
      return {
        data: null,
        error: "API에서 응답이 없습니다.",
      };
    }

    try {
      const parsedData = JSON.parse(fullResponse) as CorrectionData;

      // 기본적인 데이터 검증
      if (!Array.isArray(parsedData)) {
        return {
          data: null,
          error: "응답이 배열 형식이 아닙니다.",
        };
      }

      return { data: parsedData };
    } catch (parseError) {
      return {
        data: null,
        error: `JSON 파싱 오류: ${parseError instanceof Error ? parseError.message : String(parseError)}`,
      };
    }
  } catch (error) {
    console.error("Error processing text:", error);
    return {
      data: null,
      error: `처리 중 오류 발생: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}
