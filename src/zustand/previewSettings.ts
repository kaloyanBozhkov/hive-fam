import { create } from "zustand";

interface PreviewSettingsState {
  previewBG: string | null;
  previewBGColor: string | null;
  setPreviewBG: (bg: string | null) => void;
  setPreviewBGColor: (color: string | null) => void;
}

const usePreviewSettingsStore = create<PreviewSettingsState>((set) => ({
  previewBG: null,
  previewBGColor: null,
  setPreviewBG: (bg) => set({ previewBG: bg }),
  setPreviewBGColor: (color) => set({ previewBGColor: color }),
}));

export default usePreviewSettingsStore;
