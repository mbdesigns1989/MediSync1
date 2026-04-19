/**
 * Zustand Store Configuration
 * 
 * This folder contains all Zustand stores for state management.
 * Each store should follow the pattern below:
 * 
 * Example:
 * ```
 * import { create } from 'zustand';
 * 
 * interface AuthState {
 *   user: User | null;
 *   isLoading: boolean;
 *   login: (email: string, password: string) => Promise<void>;
 *   logout: () => void;
 * }
 * 
 * export const useAuthStore = create<AuthState>((set) => ({
 *   user: null,
 *   isLoading: false,
 *   login: async (email, password) => {
 *     set({ isLoading: true });
 *     try {
 *       // API call here
 *       set({ user: response.data, isLoading: false });
 *     } catch (error) {
 *       set({ isLoading: false });
 *     }
 *   },
 *   logout: () => set({ user: null }),
 * }));
 * ```
 * 
 * Import stores from here:
 * export { useAuthStore } from './auth';
 * export { useDashboardStore } from './dashboard';
 */

// Re-export your stores here for easy imports
export { useUIStore } from "./ui";
