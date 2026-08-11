/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  type Dispatch,
  useContext,
  useEffect,
  useReducer,
  type ReactNode,
} from 'react';
import { appReducer, initialAppState } from './appReducer';
import { StorageService } from '../services/storageService';
import type { AppAction, AppState } from '../types';

export interface AppContextValue {
  state: AppState;
  dispatch: Dispatch<AppAction>;
}

export const AppContext = createContext<AppContextValue | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(
    appReducer,
    initialAppState,
    () => StorageService.loadState() ?? initialAppState,
  );

  useEffect(() => {
    StorageService.saveState(state);
  }, [state]);

  const value: AppContextValue = {
    state,
    dispatch,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext(): AppContextValue {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }

  return context;
}
