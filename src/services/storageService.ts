import { AppState } from '../types';

const STORAGE_KEY = 'agile-pm-state';
const CURRENT_USER_KEY = 'agile-pm-current-user';

export const StorageService = {
  /**
   * Loads the application state from LocalStorage.
   * Returns null if no state exists.
   */
  loadState(): AppState | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.error('Failed to load state from LocalStorage', e);
      return null;
    }
  },

  /**
   * Serializes and saves the application state to LocalStorage.
   */
  saveState(state: AppState): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save state to LocalStorage', e);
    }
  },

  /**
   * Clears the application state from LocalStorage.
   */
  clearState(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear state from LocalStorage', e);
    }
  },

  /**
   * Retrieves the current simulated user's ID from LocalStorage.
   */
  getCurrentUserId(): string | null {
    try {
      return localStorage.getItem(CURRENT_USER_KEY);
    } catch (e) {
      console.error('Failed to get current user ID from LocalStorage', e);
      return null;
    }
  },

  /**
   * Stores the current simulated user's ID in LocalStorage.
   */
  setCurrentUserId(userId: string): void {
    try {
      localStorage.setItem(CURRENT_USER_KEY, userId);
    } catch (e) {
      console.error('Failed to set current user ID in LocalStorage', e);
    }
  },
};
