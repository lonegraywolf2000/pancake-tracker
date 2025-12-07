import type { Game, GameSession } from './types';
import { GAMES } from './game-definitions';
import { storage } from './storage';

export const gameManager = {
  /**
   * Get a game definition by ID
   */
  getGame(gameId: string): Game | undefined {
    return GAMES[gameId];
  },

  /**
   * Get all available games
   */
  getAllGames(): Game[] {
    return Object.values(GAMES);
  },

  /**
   * Get exits in display order for a game
   * Uses displayOrder if provided, otherwise returns exits in natural order
   */
  getOrderedExits(gameId: string): Game['exits'] {
    const game = this.getGame(gameId);
    if (!game) return [];

    // If no display order is specified, return exits in natural order
    if (!game.displayOrder) {
      return game.exits;
    }

    // Create a map for quick lookup
    const exitMap = new Map(game.exits.map(e => [e.id, e]));

    // Sort exits according to displayOrder, preserving any exits not in displayOrder at the end
    const ordered = game.displayOrder
      .map(id => exitMap.get(id))
      .filter((e): e is Game['exits'][number] => e !== undefined);

    // Add any exits not in displayOrder at the end (shouldn't happen normally)
    const orderedIds = new Set(ordered.map(e => e.id));
    const remaining = game.exits.filter(e => !orderedIds.has(e.id));

    return [...ordered, ...remaining];
  },

  /**
   * Get visible exits for a session based on option-based actions
   */
  getVisibleExits(session: GameSession): string[] {
    const game = this.getGame(session.gameId);
    if (!game) return [];

    const orderedExits = this.getOrderedExits(session.gameId);
    let visibleExitIds = new Set(orderedExits.map(e => e.id));

    // Apply option actions to determine hidden exits
    if (game.optionActions) {
      for (const action of game.optionActions) {
        const optionValue = session.selectedOptions[action.condition.optionId];
        if (optionValue === action.condition.value && action.action.hideExits) {
          action.action.hideExits.forEach(exitId => visibleExitIds.delete(exitId));
        }
      }
    }

    return orderedExits
      .filter(exit => visibleExitIds.has(exit.id))
      .map(e => e.id);
  },

  /**
   * Get additional Mermaid paths based on option actions
   */
  getOptionPaths(session: GameSession): Array<{ from: string; to: string }> {
    const game = this.getGame(session.gameId);
    if (!game || !game.optionActions) return [];

    const paths: Array<{ from: string; to: string }> = [];

    for (const action of game.optionActions) {
      const optionValue = session.selectedOptions[action.condition.optionId];
      if (optionValue === action.condition.value && action.action.addPaths) {
        paths.push(...action.action.addPaths);
      }
    }

    return paths;
  },

  /**
   * Create a new session for a game
   */
  createSession(gameId: string, sessionName: string): GameSession {
    const game = this.getGame(gameId);
    if (!game) throw new Error(`Game ${gameId} not found`);

    const session = storage.createSession(gameId, sessionName);

    // Initialize option selections with default values if specified, otherwise first value
    session.selectedOptions = Object.fromEntries(
      game.options.map(opt => [opt.id, opt.defaultValue ?? opt.values[0].id])
    );

    // Initialize exit-to-entrance map with vanilla mapping if available, otherwise positional pairing
    const defaultMapping = game.vanillaExitToEntranceMap
      ? { ...game.vanillaExitToEntranceMap }
      : Object.fromEntries(
          game.exits.map((exit, idx) => [exit.id, game.entrances[idx]?.id || ''])
        );
    
    session.exitToEntranceMap = defaultMapping;
    session.defaultExitToEntranceMap = defaultMapping;

    storage.updateSession(session);
    return session;
  },

  /**
   * Get valid entrance options for an exit
   * Takes into account restrictions based on game configuration and current options
   */
  getValidEntrancesForExit(
    gameId: string,
    exitId: string,
    currentOptions: Record<string, string | number> = {}
  ): string[] {
    const game = this.getGame(gameId);
    if (!game) return [];

    // First, check for option-conditional restrictions
    for (const restriction of game.restrictions) {
      if (restriction.exitId === exitId && restriction.condition) {
        const optionValue = currentOptions[restriction.condition.optionId];
        if (optionValue === restriction.condition.value) {
          return restriction.allowedEntranceIds;
        }
      }
    }

    // Then check for unconditional restrictions
    const restriction = game.restrictions.find(
      r => r.exitId === exitId && !r.condition
    );

    // If there's a restriction, return allowed entrances; otherwise all entrances
    if (restriction) {
      return restriction.allowedEntranceIds;
    }

    return game.entrances.map(e => e.id);
  },

  /**
   * Update exit-to-entrance mapping in a session
   * Handles swapping if needed to maintain uniqueness
   */
  setExitMapping(
    session: GameSession,
    exitId: string,
    entranceId: string
  ): void {
    const currentMapping = { ...session.exitToEntranceMap };
    const currentEntranceForExit = currentMapping[exitId];

    if (currentEntranceForExit === entranceId) return;

    // Find if another exit already maps to this entrance
    const swapExitId = Object.entries(currentMapping).find(
      ([_, entId]) => entId === entranceId
    )?.[0];

    if (swapExitId && swapExitId !== exitId) {
      // Swap them
      currentMapping[exitId] = entranceId;
      currentMapping[swapExitId] = currentEntranceForExit;
    } else {
      // Just set the new mapping
      currentMapping[exitId] = entranceId;
    }

    session.exitToEntranceMap = currentMapping;
    storage.updateSession(session);
  },

  /**
   * Update option selection for a session
   */
  /**
   * Generate Mermaid code for exit-to-entrance connections
   * Supports both node-based and edge-labeled rendering
   * For edge-labeled exits, uses the parentNodeId to determine source node
   * Filters out non-drawable exits and entrances
   */
  generateDynamicLinks(
    session: GameSession,
    exits: Game['exits'],
    entrances?: Game['entrances']
  ): string {
    return exits
      .map(exit => {
        // Skip exits marked as non-drawable
        if (exit.isDrawable === false) return '';

        const entranceId = session.exitToEntranceMap[exit.id];
        if (!entranceId) return '';

        // Skip if entrance is marked as non-drawable
        if (entrances) {
          const entrance = entrances.find(e => e.id === entranceId);
          if (entrance && entrance.isDrawable === false) return '';
        }

        // If this exit has a parentNodeId, it's an edge-label exit
        if (exit.parentNodeId) {
          return `${exit.parentNodeId}-->|${exit.name}|${entranceId};`;
        }

        // Otherwise use node-based format (exit as intermediate node)
        return `${exit.id}-->${entranceId};`;
      })
      .filter(line => line.length > 0)
      .join('\n');
  },

  setOption(
    session: GameSession,
    optionId: string,
    value: string
  ): void {
    session.selectedOptions[optionId] = value;
    storage.updateSession(session);
  },

  /**
   * Reset a session's mappings to defaults respecting current options
   * For option-based paths, generate a valid default mapping
   */
  resetSession(session: GameSession): void {
    const game = this.getGame(session.gameId);
    if (!game) return;

    // Start with the original default mapping
    let resetMapping = { ...session.defaultExitToEntranceMap };

    // If there are fixed paths from options, apply them
    const optionPaths = this.getOptionPaths(session);
    for (const path of optionPaths) {
      resetMapping[path.from] = path.to;
    }

    session.exitToEntranceMap = resetMapping;
    storage.updateSession(session);
  },
};
