/**
 * Core data types for the entrance tracker
 */

export type LocationReference = {
  id: string;
  name: string;
  type?: string; // Optional: can be used by games that need to categorize locations
  parentNodeId?: string; // Optional: if this is an edge-label exit, the source node it connects from
  isDrawable?: boolean; // Optional: defaults to true. Set to false to exclude from Mermaid graph
  arrowType?: '-->' | '<--' | '<-->'; // Optional: arrow direction for connections. Defaults to '-->'
  bidirectionalPair?: string; // Optional: ID of the paired entrance/exit for bidirectional connections
  uiGroup?: string; // Optional: UI group name for grouping exits/entrances in the display
  tags?: string[]; // Optional: tags for searching/filtering (e.g., ["creepy-castle", "boss-door"])
};

export type GameOptionValue<T extends string | number = string> = {
  id: T;
  description: string;
};

export type GameOption<T extends string | number = string> = {
  id: string;
  name: string;
  description?: string;
  values: GameOptionValue<T>[];
  defaultValue?: T; // Optional: defaults to first value if not specified
};

export type Game = {
  id: string;
  name: string;
  description?: string;
  nodes: LocationReference[]; // Always-existing map nodes
  exits: LocationReference[];
  entrances: LocationReference[];
  staticConnections: string; // Static Mermaid.js graph connections
  restrictions: EntranceRestriction[]; // Defines which entrances can go to which exits
  displayOrder?: string[]; // Optional: controls the display order of exits by ID. Falls back to natural order if not provided.
  vanillaExitToEntranceMap?: Record<string, string>; // Default vanilla mappings for entrances
  edgeLabelExits?: string[]; // Optional: exit IDs that should be rendered as edge labels instead of nodes (for cleaner graphs)
  transitionPaths?: Array<{ from: string; to: string }>; // Fixed paths used when transitions are not shuffled
  optionActions?: OptionAction[]; // Actions to take when options change
  options: GameOption[];
  showMap?: boolean; // Optional: whether to display the map by default (defaults to true)
  startUnselected?: boolean; // Optional: if true, all dropdowns start with empty selection (defaults to false)
  allowSwapOnDuplicate?: boolean; // Optional: if true, selecting a taken value swaps the mappings (defaults to false for HoD-style, true for SMW-style)
  hideDisabledOptions?: boolean; // Optional: if true, completely hide disabled options from dropdowns instead of showing them disabled (defaults to false)
};

/**
 * Represents a specific game session's configuration
 */
export type GameSession = {
  id: string;
  gameId: string;
  name: string;
  selectedOptions: Record<string, string | number>; // optionId -> selected value (id from GameOptionValue)
  exitToEntranceMap: Record<string, string>; // exitId -> destinationExitId (the specific exit this exit leads to)
  defaultExitToEntranceMap: Record<string, string>; // Original default mapping for reset functionality
  createdAt: number;
  updatedAt: number;
};

/**
 * Condition for when an option has a specific value
 */
export type OptionCondition = {
  optionId: string;
  value: string | number;
};

/**
 * Defines which entrances are valid for an exit under certain conditions
 */
export type EntranceRestriction = {
  gameId: string;
  exitId: string;
  condition?: OptionCondition; // if undefined, applies to all option combinations
  allowedEntranceIds: string[]; // empty array means no restrictions (all entrances allowed)
};

/**
 * Action to apply when an option condition is met
 */
export type OptionAction = {
  condition: OptionCondition;
  action: {
    hideExits?: string[]; // Exit IDs to hide from UI
    addPaths?: Array<{ from: string; to: string }>; // Mermaid paths to add
    showMap?: boolean; // Optional: override default map visibility
  };
};

/**
 * Application state
 */
export type AppState = {
  currentGameId: string;
  currentSessionId: string | null;
  sessions: GameSession[];
};
