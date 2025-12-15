import type { Game } from '../types';
import { smw } from './smw';
import { hod } from './harmony-of-dissonance';
import { dk64 } from './dk64';

export const GAMES: Record<string, Game> = {
  smw,
  hod,
  dk64,
};

export const DEFAULT_GAME_ID = 'smw';
