import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const authStore = (set, get) => ({
  user: null,
  isAuthenticated: false,
  adduser: (user) => set({ user, isAuthenticated: true }),
  removeuser: () => set({ ...get(), user: null, isAuthenticated: false }),
});

export const useAuthStore = create()(
  persist(authStore, {
    name: "auth",
    storage: createJSONStorage(() => localStorage),
  })
);
