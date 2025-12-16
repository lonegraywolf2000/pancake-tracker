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

    // Initialize exit-to-exit map (mapped to destination exit IDs)
    let defaultMapping: Record<string, string>;
    
    if (game.startUnselected) {
      // Start with empty selections
      defaultMapping = Object.fromEntries(game.exits.map(exit => [exit.id, '']));
    } else if (game.vanillaExitToEntranceMap) {
      // Use vanilla map directly - it now maps exit IDs to destination exit IDs
      defaultMapping = { ...game.vanillaExitToEntranceMap };
    } else {
      // Fall back to empty map if no vanilla map exists
      defaultMapping = Object.fromEntries(
        game.exits.map(exit => [exit.id, ''])
      );
    }
    
    session.exitToEntranceMap = defaultMapping;
    session.defaultExitToEntranceMap = defaultMapping;

    storage.updateSession(session);
    return session;
  },

  /**
   * Get valid entrance exits for an exit (exits that can be selected in the dropdown)
   * Takes into account restrictions based on game configuration and current options
   * Returns exit IDs or entrance IDs that represent valid destination transitions
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
          // Return the allowed entrance IDs
          return restriction.allowedEntranceIds;
        }
      }
    }

    // Then check for unconditional restrictions
    const restriction = game.restrictions.find(
      r => r.exitId === exitId && !r.condition
    );

    // If there's a restriction, return allowed entrances; otherwise all
    if (restriction) {
      return restriction.allowedEntranceIds;
    }

    // Return all entrance/exit IDs (for HoD: exit IDs, for SMW: entrance IDs)
    return game.entrances.map(e => e.id);
  },

  /**
   * Get display info for an entrance/exit by ID
   * Handles both exits with parentNodeId (HoD) and standalone entrances (SMW)
   */
  getEntrancesForNode(gameId: string, entranceId: string): Array<{ id: string; name: string; parentNodeId?: string; tags?: string[] }> {
    const game = this.getGame(gameId);
    if (!game) return [];

    // First try to find by exit ID
    const exitMatch = game.exits.find(e => e.id === entranceId);
    if (exitMatch) {
      return [{ id: exitMatch.id, name: exitMatch.name, parentNodeId: exitMatch.parentNodeId, tags: exitMatch.tags }];
    }

    // Then try to find by entrance ID (for games like SMW without parentNodeId)
    const entranceMatch = game.entrances.find(e => e.id === entranceId);
    if (entranceMatch) {
      return [{ id: entranceMatch.id, name: entranceMatch.name, parentNodeId: entranceMatch.parentNodeId, tags: entranceMatch.tags }];
    }

    return [];
  },

  /**
   * Update exit-to-exit mapping in a session
   * For bidirectionally paired exits, automatically sets the reverse mapping (unless decoupled)
   * Now maps exits to exit IDs (specific destination transitions) instead of areas
   */
  setExitMapping(
    session: GameSession,
    exitId: string,
    destinationExitId: string
  ): void {
    const game = this.getGame(session.gameId);
    if (!game) return;

    const currentMapping = { ...session.exitToEntranceMap };
    const currentExitForMapping = currentMapping[exitId];

    if (currentExitForMapping === destinationExitId) return;

    // Check if bidirectional pairing is enabled for this game
    const decoupleTransitions = session.selectedOptions['decouple-transitions'] === 'true';
    const shouldMaintainPairs = !decoupleTransitions;

    // Handle clearing selection (empty string)
    if (destinationExitId === '') {
      currentMapping[exitId] = '';
      
      // Also clear the bidirectional pair if pairing is enabled
      if (shouldMaintainPairs) {
        const exitRef = game.exits.find(e => e.id === exitId);
        if (exitRef?.bidirectionalPair) {
          currentMapping[exitRef.bidirectionalPair] = '';
        }
      }
      
      session.exitToEntranceMap = currentMapping;
      storage.updateSession(session);
      return;
    }

    // Get exit reference for use below
    const exitRef = game.exits.find(e => e.id === exitId);

    // Find if another exit already maps to this destination exit
    const swapExitId = Object.entries(currentMapping).find(
      ([_, mappedExitId]) => mappedExitId === destinationExitId
    )?.[0];

    if (swapExitId && swapExitId !== exitId) {
      // Check if the swap exit is also a bidirectional pair
      // If so, don't swap - let the pair logic handle it
      const swapExitRef = game.exits.find(e => e.id === swapExitId);
      const isSwapAPair = shouldMaintainPairs && (
        swapExitRef?.bidirectionalPair === exitId || 
        exitRef?.bidirectionalPair === swapExitId
      );
      
      if (!isSwapAPair) {
        // Only swap if the current exit didn't already have a mapping
        // This allows users to change their mind without forcing a swap
        if (currentExitForMapping) {
          currentMapping[exitId] = destinationExitId;
          currentMapping[swapExitId] = currentExitForMapping;
        } else {
          // Current exit had no value, so just set it without swapping
          currentMapping[exitId] = destinationExitId;
        }
      } else {
        // Just set the new mapping, let pair logic handle the other
        currentMapping[exitId] = destinationExitId;
      }
    } else {
      // Just set the new mapping
      currentMapping[exitId] = destinationExitId;
    }

    // Handle bidirectional pairing (only if enabled):
    // If the exit being set has a bidirectional pair, set the pair mapping as well
    if (shouldMaintainPairs && exitRef?.bidirectionalPair) {
      const pairExitId = exitRef.bidirectionalPair;
      const destinationExitRef = game.exits.find(e => e.id === destinationExitId);
      
      if (destinationExitRef?.bidirectionalPair) {
        // The destination's pair should map back to the source pair
        // i.e., if exitId → destinationExitId
        // then destinationExitId's pair → exitId's pair
        const pairDestinationExitId = destinationExitRef.bidirectionalPair;
        currentMapping[pairDestinationExitId] = pairExitId;
      }
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
   * Uses arrowType property to determine arrow direction (-->, <--, or <-->)
   * If transitions are decoupled, uses one-way arrows instead of bidirectional
   */
  generateDynamicLinks(
    session: GameSession,
    exits: Game['exits']
  ): string {
    // Check if transitions are decoupled
    const decoupleTransitions = session.selectedOptions['decouple-transitions'] === 'true';

    // Helper function to escape special Mermaid characters in labels
    const escapeMermaidLabel = (label: string): string => {
      return label.replace(/#/g, '\\#');
    };

    return exits
      .map(exit => {
        // Skip exits marked as non-drawable
        if (exit.isDrawable === false) return '';

        const destinationExitId = session.exitToEntranceMap[exit.id];
        if (!destinationExitId) return '';

        // The mapping stores destination exit/entrance IDs
        // For HoD exits, we find the parent node; for SMW, the destination might be an entrance
        const destinationExit = exits.find(e => e.id === destinationExitId);
        const destinationNodeId = destinationExit?.parentNodeId || destinationExitId;

        // Determine the source node ID
        const sourceNodeId = exit.parentNodeId || exit.id;

        // Skip self-loops (transitions that map back to the same node)
        if (sourceNodeId === destinationNodeId) return '';

        // Determine arrow type
        // If decoupled, always use one-way arrow. Otherwise use the exit's defined arrow type
        let arrow = exit.arrowType || '-->';
        if (decoupleTransitions && arrow === '<-->') {
          arrow = '-->';
        }

        // If this exit has a parentNodeId, it's an edge-label exit
        if (exit.parentNodeId) {
          const escapedName = escapeMermaidLabel(exit.name);
          return `${exit.parentNodeId}${arrow}|${escapedName}|${destinationNodeId};`;
        }

        // Otherwise use node-based format (exit as intermediate node)
        return `${exit.id}${arrow}${destinationNodeId};`;
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
