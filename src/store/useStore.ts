import { create } from 'zustand';

interface AppState {
  isLoaded: boolean;
  setIsLoaded: (loaded: boolean) => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
  scrollProgress: number;
  setScrollProgress: (progress: number) => void;
}

export const useStore = create<AppState>((set) => ({
  isLoaded: false,
  setIsLoaded: (loaded) => set({ isLoaded: loaded }),
  activeSection: 'home',
  setActiveSection: (section) => set({ activeSection: section }),
  scrollProgress: 0,
  setScrollProgress: (progress) => set({ scrollProgress: progress }),
}));
