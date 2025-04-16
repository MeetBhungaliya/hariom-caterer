import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

function authStore(set, get) {
  return {
    user: null,
    isAuthenticated: false,
    adduser: user => set({ user, isAuthenticated: true }),
    removeuser: () => set({ ...get(), user: null, isAuthenticated: false }),
  }
}

export const useAuthStore = create()(
  persist(authStore, {
    name: 'auth',
    storage: createJSONStorage(() => localStorage),
  }),
)
