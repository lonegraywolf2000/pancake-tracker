import type { Game } from '../types';
import { smw } from './smw';
import { hod } from './harmony-of-dissonance';

export const GAMES: Record<string, Game> = {
  smw,
  hod,
};

export const DEFAULT_GAME_ID = 'smw';
