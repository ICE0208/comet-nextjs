import { AIResponse } from "@prisma/client";
import { create } from "zustand";

// 출력 데이터의 구조를 정의하는 인터페이스입니다.
type OutputData = AIResponse;

// 로딩 상태 타입 정의
export type LoadingState =
  | "idle"
  | "initialLoading"
  | "correctionLoading"
  | "processing"
  | "networkError";

// 프롬프트 상태 관리 인터페이스
interface PromptState {
  outputData: OutputData | null;
  loadingState: LoadingState;
  error: string | null;
}

interface Actions {
  actions: {
    setOutputData: (data: OutputData | null) => void;
    setLoadingState: (state: LoadingState) => void;
    setError: (error: string | null) => void;
    resetStore: () => void; // 스토어 초기화
  };
}

// 초기값
const initialState: PromptState = {
  outputData: null,
  loadingState: "initialLoading",
  error: null,
};

// 스토어 생성
export const usePromptStore = create<PromptState & Actions>((set) => ({
  ...initialState,

  actions: {
    setOutputData: (data) => set({ outputData: data }),
    setLoadingState: (loadingState) => set({ loadingState }),
    setError: (error) => set({ error }),
    resetStore: () => set(initialState),
  },
}));
