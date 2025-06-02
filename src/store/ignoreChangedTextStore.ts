import { create } from "zustand";

interface IgnoreChangedTextState {
  ignoreChangedTexts: Set<string>;
}

interface IgnoreChangedTextActions {
  actions: {
    addIgnoreChangedText: (textWithOrder: string) => void;
    removeIgnoreChangedText: (textWithOrder: string) => void;
    resetStore: () => void;
  };
}

const initialState: IgnoreChangedTextState = {
  ignoreChangedTexts: new Set<string>(),
};

const useIgnoreChangedTextStore = create<
  IgnoreChangedTextState & IgnoreChangedTextActions
>((set) => ({
  ...initialState,

  actions: {
    addIgnoreChangedText: (textWithOrder: string) =>
      set((state) => ({
        ignoreChangedTexts: new Set([
          ...state.ignoreChangedTexts,
          textWithOrder,
        ]),
      })),
    removeIgnoreChangedText: (textWithOrder: string) =>
      set((state) => {
        const newSet = new Set(state.ignoreChangedTexts);
        newSet.delete(textWithOrder);
        return { ignoreChangedTexts: newSet };
      }),
    resetStore: () => set(initialState),
  },
}));

export default useIgnoreChangedTextStore;
