import type { Game } from '../types';
import { smw } from './smw';

export const GAMES: Record<string, Game> = {
  smw,
};

export const DEFAULT_GAME_ID = 'smw';
