import { create } from "zustand";

// 출력 데이터의 구조를 정의하는 인터페이스입니다.
interface OutputData {
  id: number;
  text: string;
  createdAt: string;
  options: {
    id: number;
    optionId: string;
    optionName: string;
    isSelected: boolean;
  }[];
}

// 프롬프트 상태 관리 인터페이스
interface PromptState {
  outputData: OutputData | null;
  isLoading: boolean;
  error: string | null;
}

//여기 린트에러 도무지 모르겠네..
interface Actions {
  actions: {
    setOutputData: (data: OutputData) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
  };
}

const initialState: PromptState = {
  outputData: null,
  isLoading: false,
  error: null,
};

// Zustand 스토어 생성
export const usePromptStore = create<PromptState & Actions>((set) => ({
  // 출력 데이터 초기값
  ...initialState,

  actions: {
    setOutputData: (data) => set({ outputData: data }),
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),
  },
}));
