import { create } from "zustand";

interface CheckTextState {
  targetText: string;
  textOrder: number;
}

interface CheckTextActions {
  actions: {
    setTargetText: (targetText: string) => void;
    setTextOrder: (textOrder: number) => void;
    resetStore: () => void;
  };
}

const initialState: CheckTextState = {
  targetText: "",
  textOrder: 0,
};

const useCheckTextStore = create<CheckTextState & CheckTextActions>((set) => ({
  ...initialState,

  actions: {
    setTargetText: (targetText) => set({ targetText }),
    setTextOrder: (textOrder) => set({ textOrder }),
    resetStore: () => set(initialState),
  },
}));

export default useCheckTextStore;
