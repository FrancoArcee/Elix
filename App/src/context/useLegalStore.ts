import { create } from "zustand";

export type LegalTab = "terminos" | "privacidad";

interface LegalState {
  isOpen: boolean;
  activeTab: LegalTab;
  openModal: (tab?: LegalTab) => void;
  closeModal: () => void;
  setActiveTab: (tab: LegalTab) => void;
}

export const useLegalStore = create<LegalState>((set) => ({
  isOpen: false,
  activeTab: "terminos",
  openModal: (tab = "terminos") => set({ isOpen: true, activeTab: tab }),
  closeModal: () => set({ isOpen: false }),
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
