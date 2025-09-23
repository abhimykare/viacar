import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface UserStore {
  token: string | null;
  setToken: (token: string | null) => void;
}

export const useUserStore = create<UserStore>()(
  persist<UserStore>(
    (set) => ({
      token: null,
      setToken: (token) => set({ token }),
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
