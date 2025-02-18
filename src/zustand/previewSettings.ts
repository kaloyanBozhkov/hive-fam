import type { organization } from "@prisma/client";
import { create } from "zustand";

interface PreviewSettingsState {
  previewBG: string | null;
  previewBGColor: string | null;
  largeBannersDesktop: boolean;
  initialized: boolean;
  setPreviewBG: (bg: string | null) => void;
  setPreviewBGColor: (color: string | null) => void;
  setInitialSettings: (org: organization) => void;
}

const usePreviewSettingsStore = create<PreviewSettingsState>((set) => ({
  previewBG: null,
  previewBGColor: null,
  largeBannersDesktop: false,
  initialized: false,
  setPreviewBG: (bg) => set({ previewBG: bg }),
  setPreviewBGColor: (color) => set({ previewBGColor: color }),
  setInitialSettings: (org) => {
    set({
      largeBannersDesktop: !!org.large_banners_desktop,
      initialized: true,
    });
  },
}));

export default usePreviewSettingsStore;
