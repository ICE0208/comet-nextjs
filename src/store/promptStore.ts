import { AIResponse } from "@prisma/client";
import { create } from "zustand";

// 출력 데이터의 구조를 정의하는 인터페이스입니다.
type OutputData = AIResponse;

// 프롬프트 상태 관리 인터페이스
interface PromptState {
  outputData: OutputData | null;
  isLoading: boolean;
  error: string | null;
}

interface Actions {
  actions: {
    setOutputData: (data: OutputData | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
  };
}

// 초기값
const initialState: PromptState = {
  outputData: null,
  isLoading: false,
  error: null,
};

// 스토어 생성
export const usePromptStore = create<PromptState & Actions>((set) => ({
  ...initialState,

  actions: {
    setOutputData: (data) => set({ outputData: data }),
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),
  },
}));
