import { create } from "zustand";

interface ChangedText {
  text: string;
  textOrder: number;
}

interface ChangedTextState {
  changedText: ChangedText[];
}

interface ChangedTextActions {
  actions: {
    setMultipleChangedTexts: (changedTexts: ChangedText[]) => void;
    resetStore: () => void;
  };
}

const initialState: ChangedTextState = {
  changedText: [],
};

const useChangedTextStore = create<ChangedTextState & ChangedTextActions>(
  (set) => ({
    ...initialState,

    actions: {
      setMultipleChangedTexts: (changedTexts: ChangedText[]) =>
        set(() => ({
          changedText: [...changedTexts],
        })),
      resetStore: () => set(initialState),
    },
  })
);

export default useChangedTextStore;
