import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface UserData {
  id?: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  email?: string;
  phone_number?: string;
  mobile_number?: string;
  age?: number;
  gender?: string;
  date_of_birth?: string;
  about?: string;
  profile_image?: string;
  profile_image_url?: string;
  [key: string]: any; // For any additional user properties
}

interface UserStore {
  token: string | null;
  userData: UserData | null;
  setToken: (token: string | null) => void;
  setUserData: (userData: UserData | null) => void;
  updateUserData: (partialData: Partial<UserData>) => void;
  clearUserData: () => void;
}

export const useUserStore = create<UserStore>()(
  persist<UserStore>(
    (set, get) => ({
      token: null,
      userData: null,
      setToken: (token) => set({ token }),
      setUserData: (userData) => set({ userData }),
      updateUserData: (partialData) => {
        const currentUserData = get().userData;
        set({
          userData: {
            ...(currentUserData || {}),
            ...partialData,
          },
        });
      },
      clearUserData: () => set({ userData: null, token: null }),
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
