import type { organization } from "@prisma/client";
import { create } from "zustand";

interface PreviewSettingsState {
  previewBG: string | null;
  previewBGColor: string | null;
  previewBGOpacity: number;
  previewBGSize: string;
  largeBannersDesktop: boolean;
  initialized: boolean;
  setPreviewBG: (bg: string | null) => void;
  setPreviewBGColor: (color: string | null) => void;
  setPreviewBGOpacity: (opacity: number) => void;
  setPreviewBGSize: (size: string) => void;
  setInitialSettings: (org: organization) => void;
}

const usePreviewSettingsStore = create<PreviewSettingsState>((set) => ({
  previewBG: null,
  previewBGColor: null,
  previewBGOpacity: 1,
  previewBGSize: "cover",
  largeBannersDesktop: false,
  initialized: false,
  setPreviewBG: (bg) => set({ previewBG: bg }),
  setPreviewBGColor: (color) => set({ previewBGColor: color }),
  setPreviewBGOpacity: (opacity) => set({ previewBGOpacity: opacity }),
  setPreviewBGSize: (size) => set({ previewBGSize: size }),
  setInitialSettings: (org) => {
    set({
      largeBannersDesktop: !!org.large_banners_desktop,
      initialized: true,
    });
  },
}));

export default usePreviewSettingsStore;
