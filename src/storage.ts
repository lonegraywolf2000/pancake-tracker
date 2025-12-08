import type { AppState, GameSession } from './types';
import { DEFAULT_GAME_ID } from './game-definitions';

const STORAGE_KEY = 'waffle-tracker-state';

const defaultState: AppState = {
  currentGameId: DEFAULT_GAME_ID,
  currentSessionId: null,
  sessions: [],
};

export const storage = {
  getState(): AppState {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : defaultState;
    } catch {
      console.warn('Failed to load state from localStorage');
      return defaultState;
    }
  },

  setState(state: AppState): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save state to localStorage', error);
    }
  },

  getSession(sessionId: string): GameSession | undefined {
    const state = this.getState();
    const session = state.sessions.find(s => s.id === sessionId);
    
    if (session && !session.defaultExitToEntranceMap) {
      // Migrate old sessions that don't have defaultExitToEntranceMap
      session.defaultExitToEntranceMap = session.exitToEntranceMap;
      this.updateSession(session);
    }
    
    return session;
  },

  createSession(gameId: string, name: string): GameSession {
    const session: GameSession = {
      id: `session-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      gameId,
      name,
      selectedOptions: {},
      exitToEntranceMap: {},
      defaultExitToEntranceMap: {},
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const state = this.getState();
    state.sessions.push(session);
    this.setState(state);

    return session;
  },

  updateSession(session: GameSession): void {
    const state = this.getState();
    const idx = state.sessions.findIndex(s => s.id === session.id);
    if (idx !== -1) {
      session.updatedAt = Date.now();
      state.sessions[idx] = session;
      this.setState(state);
    }
  },

  deleteSession(sessionId: string): void {
    const state = this.getState();
    state.sessions = state.sessions.filter(s => s.id !== sessionId);
    if (state.currentSessionId === sessionId) {
      state.currentSessionId = null;
    }
    this.setState(state);
  },

  setCurrentGame(gameId: string): void {
    const state = this.getState();
    state.currentGameId = gameId;
    state.currentSessionId = null;
    this.setState(state);
  },

  setCurrentSession(sessionId: string | null): void {
    const state = this.getState();
    state.currentSessionId = sessionId;
    this.setState(state);
  },

  getSessionsByGame(gameId: string): GameSession[] {
    const state = this.getState();
    return state.sessions.filter(s => s.gameId === gameId);
  },
};
