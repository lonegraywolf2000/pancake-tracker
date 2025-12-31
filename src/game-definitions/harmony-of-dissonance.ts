import type { Game, EntranceRestriction, OptionAction, LocationReference } from '../types';

// Direction type for HoD's directional exit restrictions
type Direction = 'north' | 'south' | 'east' | 'west';

// Exit type specific to HoD's exit definitions
type Exit = {
  id: string;
  name: string;
  direction?: Direction;
  parentNodeId?: string;
  arrowType?: '-->' | '<--' | '<-->';
  bidirectionalPair?: string;
  uiGroup?: string;
  tags?: string[] | undefined;
};

type HodExit = Exit & { direction: Direction };

// Primary area nodes
const hodNodes = [
  // Castle A
  { id: 'entrance-a', name: 'Entrance A' },
  { id: 'marble-a', name: 'Marble Corridor A' },
  { id: 'shrine-a', name: 'Shrine of the Apostates A' },
  { id: 'skeleton-a', name: 'Skeleton Cave A' },
  { id: 'wailing-a', name: 'The Wailing Way A' },
  { id: 'illusion-a-w', name: 'Room of Illusion A West' },
  { id: 'illusion-a-e', name: 'Room of Illusion A East' },
  { id: 'treasury-a', name: 'Castle Treasury A' },
  { id: 'luminous-a', name: 'Luminous Cavern A' },
  { id: 'sky-a', name: 'Sky Walkway A' },
  { id: 'chapel-a', name: 'Chapel of Dissonance A' },
  { id: 'clock-a', name: 'Clock Tower A' },
  { id: 'aqueduct-a', name: 'Aqueduct of Dragons A' },
  { id: 'top-a', name: 'Castle Top Floor A' },
  // Castle B (mirrored layout)
  { id: 'entrance-b', name: 'Entrance B' },
  { id: 'marble-b', name: 'Marble Corridor B' },
  { id: 'shrine-b', name: 'Shrine of the Apostates B' },
  { id: 'skeleton-b', name: 'Skeleton Cave B' },
  { id: 'wailing-b', name: 'The Wailing Way B' },
  { id: 'illusion-b-w', name: 'Room of Illusion B West' },
  { id: 'illusion-b-e', name: 'Room of Illusion B East' },
  { id: 'treasury-b', name: 'Castle Treasury B' },
  { id: 'luminous-b', name: 'Luminous Cavern B' },
  { id: 'sky-b', name: 'Sky Walkway B' },
  { id: 'chapel-b', name: 'Chapel of Dissonance B' },
  { id: 'clock-b', name: 'Clock Tower B' },
  { id: 'aqueduct-b', name: 'Aqueduct of Dragons B' },
  { id: 'top-b', name: 'Castle Top Floor B' },
];

const entranceTags = ['entrance'];
const marbleTags = ['marble'];
const wailingTags = ['wailing', 'approach'];
const shrineTags = ['shrine', 'apostate', 'grave'];
const illusionTags = ['illusion'];
const treasuryTags = ['treasury'];
const skeletonTags = ['skeleton'];
const luminousTags = ['luminous', 'cave', 'moss'];
const skyTags = ['sky', 'cooridor'];
const chapelTags = ['chapel', 'dissonance'];
const clockTags = ['clock'];
const aqueductTags = ['aqua', 'aqueduct', 'dragon', 'waterway'];
const topTags = ['top', 'tower'];

const hodAExits: HodExit[] = [
  // Entrance A exits
  { id: 'entrance-a-n', name: 'Entrance A → Marble A', direction: 'east' as const, uiGroup: 'Entrance A', tags: [...entranceTags, ...marbleTags], parentNodeId: 'entrance-a', arrowType: '<-->' as const, bidirectionalPair: 'marble-a-w' },
  { id: 'entrance-a-e', name: 'Entrance A → Shrine A', direction: 'east' as const, uiGroup: 'Entrance A', tags: [...entranceTags, ...shrineTags], parentNodeId: 'entrance-a', arrowType: '<-->' as const, bidirectionalPair: 'shrine-a-w' },
  { id: 'entrance-a-s', name: 'Entrance A → Skeleton A', direction: 'south' as const, uiGroup: 'Entrance A', tags: [...entranceTags, ...skeletonTags], parentNodeId: 'entrance-a', arrowType: '<-->' as const, bidirectionalPair: 'skeleton-a-w' },
  
  // Marble Corridor A entrances
  { id: 'marble-a-w', name: 'Marble A → Entrance A', direction: 'west' as const, uiGroup: 'Marble A', tags: [...marbleTags, ...entranceTags], parentNodeId: 'marble-a', arrowType: '<-->' as const, bidirectionalPair: 'entrance-a-n' },
  { id: 'marble-a-ssw', name: 'Marble A → Illusion A West', direction: 'west' as const, uiGroup: 'Marble A', tags: [...marbleTags, ...illusionTags], parentNodeId: 'marble-a', arrowType: '<-->' as const, bidirectionalPair: 'illusion-a-w' },
  { id: 'marble-a-sse', name: 'Marble A → Illusion A East', direction: 'east' as const, uiGroup: 'Marble A', tags: [...marbleTags, ...illusionTags], parentNodeId: 'marble-a', arrowType: '<-->' as const, bidirectionalPair: 'illusion-a-e' },
  { id: 'marble-a-se', name: 'Marble A → Wailing A', direction: 'east' as const, uiGroup: 'Marble A', tags: [...marbleTags, ...wailingTags], parentNodeId: 'marble-a', arrowType: '<-->' as const, bidirectionalPair: 'wailing-a-w' },
  { id: 'marble-a-e', name: 'Marble A → Top A', direction: 'east' as const, uiGroup: 'Marble A', tags: [...marbleTags, ...topTags], parentNodeId: 'marble-a', arrowType: '<-->' as const, bidirectionalPair: 'top-a-w' },

  // Wailing Way A
  { id: 'wailing-a-w', name: 'Wailing A → Marble A', direction: 'west' as const, uiGroup: 'Wailing A', tags: [...wailingTags, ...marbleTags], parentNodeId: 'wailing-a', arrowType: '<-->' as const, bidirectionalPair: 'marble-a-se'},
  { id: 'wailing-a-e', name: 'Wailing A → Treasury A', direction: 'east' as const, uiGroup: 'Wailing A', tags: [...wailingTags, ...treasuryTags], parentNodeId: 'wailing-a', arrowType: '<-->' as const, bidirectionalPair: 'treasury-a-w'},
  { id: 'wailing-a-s', name: 'Wailing A → Shrine A', direction: 'east' as const, uiGroup: 'Wailing A', tags: [...wailingTags, ...shrineTags], parentNodeId: 'wailing-a', arrowType: '<-->' as const, bidirectionalPair: 'shrine-a-n' },
  
  // Shrine of the Apostates A
  { id: 'shrine-a-w', name: 'Shrine A → Entrance A', direction: 'west' as const, uiGroup: 'Shrine A', tags: [...shrineTags, ...entranceTags], parentNodeId: 'shrine-a', arrowType: '<-->' as const, bidirectionalPair: 'entrance-a-e' },
  { id: 'shrine-a-n', name: 'Shrine A → Wailing A', direction: 'west' as const, uiGroup: 'Shrine A', tags: [...shrineTags, ...wailingTags], parentNodeId: 'shrine-a', arrowType: '<-->' as const, bidirectionalPair: 'wailing-a-s'},
  
  // Illusion A (splits into west and east)
  { id: 'illusion-a-w', name: 'Illusion A West → Marble A', direction: 'east' as const, uiGroup: 'Illusion A', tags: [...illusionTags, ...marbleTags], arrowType: '<-->' as const, bidirectionalPair: 'marble-a-ssw' },
  { id: 'illusion-a-e', name: 'Illusion A East → Marble A', direction: 'west' as const, uiGroup: 'Illusion A', tags: [...illusionTags, ...marbleTags], arrowType: '<-->' as const, bidirectionalPair: 'marble-a-sse' },

  // Treasury A
  { id: 'treasury-a-w', name: 'Treasury A → Wailing A', direction: 'west' as const, uiGroup: 'Treasury A', tags: [...treasuryTags, ...wailingTags], parentNodeId: 'treasury-a', arrowType: '<-->' as const, bidirectionalPair: 'wailing-a-e' },
  { id: 'treasury-a-n', name: 'Treasury A → Skeleton A', direction: 'west' as const, uiGroup: 'Treasury A', tags: [...treasuryTags, ...skeletonTags], parentNodeId: 'treasury-a', arrowType: '<-->' as const, bidirectionalPair: 'skeleton-a-e' },
  { id: 'treasury-a-e', name: 'Treasury A → Luminous A', direction: 'east' as const, uiGroup: 'Treasury A', tags: [...treasuryTags, ...luminousTags], parentNodeId: 'treasury-a', arrowType: '<-->' as const, bidirectionalPair: 'luminous-a-w' },
  { id: 'treasury-a-s', name: 'Treasury A → Top A', direction: 'north' as const, uiGroup: 'Treasury A', tags: [...treasuryTags, ...topTags], parentNodeId: 'treasury-a', arrowType: '<-->' as const, bidirectionalPair: 'top-a-n' },

  // Skeleton Cave A
  { id: 'skeleton-a-w', name: 'Skeleton A → Entrance A', direction: 'north' as const, uiGroup: 'Skeleton A', tags: [...skeletonTags, ...entranceTags], parentNodeId: 'skeleton-a', arrowType: '<-->' as const, bidirectionalPair: 'entrance-a-s' },
  { id: 'skeleton-a-e', name: 'Skeleton A → Treasury A', direction: 'east' as const, uiGroup: 'Skeleton A', tags: [...skeletonTags, ...treasuryTags], parentNodeId: 'skeleton-a', arrowType: '<-->' as const, bidirectionalPair: 'treasury-a-n' },

  // Luminous Cavern A
  { id: 'luminous-a-w', name: 'Luminous A → Treasury A', direction: 'west' as const, uiGroup: 'Luminous A', tags: [...luminousTags, ...treasuryTags], parentNodeId: 'luminous-a', arrowType: '<-->' as const, bidirectionalPair: 'treasury-a-e' },
  { id: 'luminous-a-n', name: 'Luminous A → Aqueduct A', direction: 'east' as const, uiGroup: 'Luminous A', tags: [...luminousTags, ...aqueductTags], parentNodeId: 'luminous-a', arrowType: '<-->' as const, bidirectionalPair: 'aqueduct-a-s' },

  // Sky Walkway A
  { id: 'sky-a-n', name: 'Sky A → Chapel A', direction: 'west' as const, uiGroup: 'Sky A', tags: [...skyTags, ...chapelTags], parentNodeId: 'sky-a', arrowType: '<-->' as const, bidirectionalPair: 'chapel-a-s' },
  { id: 'sky-a-e', name: 'Sky A → Clock Tower A', direction: 'east' as const, uiGroup: 'Sky A', tags: [...skyTags, ...clockTags], parentNodeId: 'sky-a', arrowType: '<-->' as const, bidirectionalPair: 'clock-a-w' },
  { id: 'sky-a-s', name: 'Sky A → Aqueduct A', direction: 'west' as const, uiGroup: 'Sky A', tags: [...skyTags, ...aqueductTags], parentNodeId: 'sky-a', arrowType: '<-->' as const, bidirectionalPair: 'aqueduct-a-n' },

  // Chapel of Dissonance A
  { id: 'chapel-a-s', name: 'Chapel A → Sky A', direction: 'east' as const, uiGroup: 'Chapel A', tags: [...chapelTags, ...skyTags], parentNodeId: 'chapel-a', arrowType: '<-->' as const, bidirectionalPair: 'sky-a-n' },
  { id: 'chapel-a-e', name: 'Chapel A → Top A', direction: 'west' as const, uiGroup: 'Chapel A', tags: [...chapelTags, ...topTags], parentNodeId: 'chapel-a', arrowType: '<-->' as const, bidirectionalPair: 'top-a-e' },

  // Clock Tower A
  { id: 'clock-a-w', name: 'Clock Tower A → Sky A', direction: 'west' as const, uiGroup: 'Clock A', tags: [...clockTags, ...skyTags], parentNodeId: 'clock-a', arrowType: '<-->' as const, bidirectionalPair: 'sky-a-e' },
  { id: 'clock-a-s', name: 'Clock Tower A → Aqueduct A', direction: 'west' as const, uiGroup: 'Clock A', tags: [...clockTags, ...aqueductTags], parentNodeId: 'clock-a', arrowType: '<-->' as const, bidirectionalPair: 'aqueduct-a-e' },

  // Aqueduct of Dragons A
  { id: 'aqueduct-a-s', name: 'Aqueduct A → Luminous A', direction: 'west' as const, uiGroup: 'Aqueduct A', tags: [...aqueductTags, ...luminousTags], parentNodeId: 'aqueduct-a', arrowType: '<-->' as const, bidirectionalPair: 'luminous-a-n' },
  { id: 'aqueduct-a-n', name: 'Aqueduct A → Sky A', direction: 'east' as const, uiGroup: 'Aqueduct A', tags: [...aqueductTags, ...skyTags], parentNodeId: 'aqueduct-a', arrowType: '<-->' as const, bidirectionalPair: 'sky-a-s' },
  { id: 'aqueduct-a-e', name: 'Aqueduct A → Clock Tower A', direction: 'east' as const, uiGroup: 'Aqueduct A', tags: [...aqueductTags, ...clockTags], parentNodeId: 'aqueduct-a', arrowType: '<-->' as const, bidirectionalPair: 'clock-a-s' },

  // Top Floor A
  { id: 'top-a-w', name: 'Top A → Marble A', direction: 'west' as const, uiGroup: 'Top A', tags: [...topTags, ...marbleTags], parentNodeId: 'top-a', arrowType: '<-->' as const, bidirectionalPair: 'marble-a-e' },
  { id: 'top-a-e', name: 'Top A → Chapel A', direction: 'east' as const, uiGroup: 'Top A', tags: [...topTags, ...chapelTags], parentNodeId: 'top-a', arrowType: '<-->' as const, bidirectionalPair: 'chapel-a-e' },
  { id: 'top-a-n', name: 'Top A → Treasury A', direction: 'south' as const, uiGroup: 'Top A', tags: [...topTags, ...treasuryTags], parentNodeId: 'top-a', arrowType: '<-->' as const, bidirectionalPair: 'treasury-a-s' },
];

// Helper function to generate Castle B exits from Castle A
function generateCastleBExits(castleAExits: HodExit[]): HodExit[] {
  const toBRegex = / A\b/g; // Word boundary ensures we only match " A" at word end
  return castleAExits.map(exit => {
    const transformed = {
      ...exit,
      id: exit.id.replace('-a-', '-b-'),
      name: exit.name.replace(toBRegex, ' B'),
    };
    if (exit.bidirectionalPair) {
      transformed.bidirectionalPair = exit.bidirectionalPair.replace('-a-', '-b-');
    }
    if (exit.parentNodeId) {
      transformed.parentNodeId = exit.parentNodeId.replace('-a', '-b');
    }
    if (exit.uiGroup) {
      transformed.uiGroup = exit.uiGroup.replace(toBRegex, ' B');
    }
    return transformed;
  });
}

const hodBExits = generateCastleBExits(hodAExits);

// Exits and entrances with parentNodeId for edge labels
const hodExits = [
  ...hodAExits,
  ...hodBExits,
];

function convertExitsToLocationReferences(exits: HodExit[]): LocationReference[] {
  return exits.map(exit => {
    const { direction, ...rest } = exit;
    return {
      ...rest,
      type: direction,
    };
  });
}

const allExitsOnly = convertExitsToLocationReferences(hodExits);

// Helper to determine if a location is from Castle A or B
function getCastle(locationId: string): 'a' | 'b' {
  return locationId.includes('-b') ? 'b' : 'a';
}

// Generate entrance restrictions: directional opposition (west↔east, north↔south)
function generateDirectionalRestrictions(connections: typeof hodExits): EntranceRestriction[] {
  const restrictions: EntranceRestriction[] = [];
  
  // Map of opposite directions
  const oppositeDirections: Record<string, string> = {
    'west': 'east',
    'east': 'west',
    'north': 'south',
    'south': 'north',
  };
  
  for (const connection of connections) {
    if (!connection.direction) continue;
    
    const opposite = oppositeDirections[connection.direction];
    if (!opposite) continue;
    
    // Find all connections that don't have the opposite direction
    const allowedConnectionIds = connections
      .filter(conn => conn.direction !== opposite)
      .map(conn => conn.id);
    
    // Only create a restriction if there are disallowed connections of opposite direction
    if (allowedConnectionIds.length < connections.length) {
      restrictions.push({
        gameId: 'hod',
        exitId: connection.id,
        allowedEntranceIds: allowedConnectionIds,
      });
    }
  }
  
  return restrictions;
}

// Generate vanilla-forcing restrictions: when area-shuffle is 'none', force vanilla connections
function generateVanillaForcingRestrictions(
  connections: typeof hodExits,
  vanillaMap: Record<string, string>
): EntranceRestriction[] {
  const restrictions: EntranceRestriction[] = [];
  
  for (const exitId in vanillaMap) {
    const vanillaDestinationExitId = vanillaMap[exitId];
    
    // Find the destination exit to get its parent node (the area it comes from)
    const destinationExit = connections.find(conn => conn.id === vanillaDestinationExitId);
    if (!destinationExit) continue;
    
    const destinationNodeId = destinationExit.parentNodeId;
    
    // Find all exits that have this node as their parent (i.e., all exits FROM this area)
    const vanillaEntranceIds = connections
      .filter(conn => conn.parentNodeId === destinationNodeId)
      .map(conn => conn.id);
    
    if (vanillaEntranceIds.length > 0) {
      // When area-shuffle is 'none', restrict this exit to only its vanilla exit options
      restrictions.push({
        gameId: 'hod',
        exitId,
        condition: { optionId: 'area-shuffle', value: 'none' },
        allowedEntranceIds: vanillaEntranceIds,
      });
    }
  }
  
  return restrictions;
}

// Generate separate-castle restrictions: when area-shuffle is 'separate', castles don't mix
function generateSeparateCastleRestrictions(connections: typeof hodExits): EntranceRestriction[] {
  const restrictions: EntranceRestriction[] = [];
  
  for (const connection of connections) {
    const exitCastle = getCastle(connection.parentNodeId || connection.id);
    
    // Find all entrances from the same castle
    const allowedEntranceIds = connections
      .filter(conn => getCastle(conn.parentNodeId || conn.id) === exitCastle)
      .map(conn => conn.id);
    
    if (allowedEntranceIds.length < connections.length) {
      restrictions.push({
        gameId: 'hod',
        exitId: connection.id,
        condition: { optionId: 'area-shuffle', value: 'separate' },
        allowedEntranceIds,
      });
    }
  }
  
  return restrictions;
}

const hodVanillaMap: Record<string, string> = {
  // Castle A - now mapping exit to exit ID (the specific destination exit)
  'entrance-a-n': 'marble-a-w',
  'entrance-a-e': 'shrine-a-w',
  'entrance-a-s': 'skeleton-a-w',
  'marble-a-w': 'entrance-a-n',
  'marble-a-ssw': 'illusion-a-w',
  'marble-a-sse': 'illusion-a-e',
  'marble-a-se': 'wailing-a-w',
  'marble-a-e': 'top-a-w',
  'wailing-a-w': 'marble-a-se',
  'wailing-a-e': 'treasury-a-w',
  'wailing-a-s': 'shrine-a-n',
  'shrine-a-w': 'entrance-a-e',
  'shrine-a-n': 'wailing-a-s',
  'skeleton-a-w': 'entrance-a-s',
  'skeleton-a-e': 'treasury-a-n',
  'treasury-a-w': 'wailing-a-e',
  'treasury-a-n': 'skeleton-a-e',
  'treasury-a-e': 'luminous-a-w',
  'treasury-a-s': 'top-a-n',
  'illusion-a-w': 'marble-a-ssw',
  'illusion-a-e': 'marble-a-sse',
  'luminous-a-w': 'treasury-a-e',
  'luminous-a-n': 'aqueduct-a-s',
  'sky-a-n': 'chapel-a-s',
  'sky-a-e': 'clock-a-w',
  'sky-a-s': 'aqueduct-a-n',
  'chapel-a-s': 'sky-a-n',
  'chapel-a-e': 'top-a-e',
  'clock-a-w': 'sky-a-e',
  'clock-a-s': 'aqueduct-a-e',
  'aqueduct-a-s': 'luminous-a-n',
  'aqueduct-a-n': 'sky-a-s',
  'aqueduct-a-e': 'clock-a-s',
  'top-a-w': 'marble-a-e',
  'top-a-e': 'chapel-a-e',
  'top-a-n': 'treasury-a-s',
  // Castle B (same as A)
  'entrance-b-n': 'marble-b-w',
  'entrance-b-e': 'shrine-b-w',
  'entrance-b-s': 'skeleton-b-w',
  'marble-b-w': 'entrance-b-n',
  'marble-b-ssw': 'illusion-b-w',
  'marble-b-sse': 'illusion-b-e',
  'marble-b-se': 'wailing-b-w',
  'marble-b-e': 'top-b-w',
  'wailing-b-w': 'marble-b-se',
  'wailing-b-e': 'treasury-b-w',
  'wailing-b-s': 'shrine-b-n',
  'shrine-b-w': 'entrance-b-e',
  'shrine-b-n': 'wailing-b-s',
  'skeleton-b-w': 'entrance-b-s',
  'skeleton-b-e': 'treasury-b-n',
  'treasury-b-w': 'wailing-b-e',
  'treasury-b-n': 'skeleton-b-e',
  'treasury-b-e': 'luminous-b-w',
  'treasury-b-s': 'top-b-n',
  'illusion-b-w': 'marble-b-ssw',
  'illusion-b-e': 'marble-b-sse',
  'luminous-b-w': 'treasury-b-e',
  'luminous-b-n': 'aqueduct-b-s',
  'sky-b-n': 'chapel-b-s',
  'sky-b-e': 'clock-b-w',
  'sky-b-s': 'aqueduct-b-n',
  'chapel-b-s': 'sky-b-n',
  'chapel-b-e': 'top-b-w',
  'clock-b-w': 'sky-b-e',
  'clock-b-s': 'aqueduct-b-e',
  'aqueduct-b-s': 'luminous-b-n',
  'aqueduct-b-n': 'sky-b-s',
  'aqueduct-b-e': 'clock-b-s',
  'top-b-w': 'marble-b-e',
  'top-b-n': 'treasury-b-s',
};

const hodRestrictions = [
  ...generateDirectionalRestrictions(hodExits),
  ...generateVanillaForcingRestrictions(hodExits, hodVanillaMap),
  ...generateSeparateCastleRestrictions(hodExits),
];

// Build vanilla paths for option actions
const vanillaPaths: Array<{ from: string; to: string }> = [
  // Castle A
  { from: 'entrance-a', to: 'marble-a' },
  { from: 'entrance-a', to: 'shrine-a' },
  { from: 'entrance-a', to: 'skeleton-a' },
  { from: 'marble-a', to: 'illusion-a-w' },
  { from: 'marble-a', to: 'illusion-a-e' },
  { from: 'marble-a', to: 'wailing-a' },
  { from: 'marble-a', to: 'top-a' },
  { from: 'wailing-a', to: 'treasury-a' },
  { from: 'wailing-a', to: 'shrine-a' },
  { from: 'shrine-a', to: 'wailing-a' },
  { from: 'skeleton-a', to: 'treasury-a' },
  { from: 'treasury-a', to: 'luminous-a' },
  { from: 'treasury-a', to: 'top-a' },
  { from: 'luminous-a', to: 'aqueduct-a' },
  { from: 'sky-a', to: 'chapel-a' },
  { from: 'sky-a', to: 'clock-a' },
  { from: 'sky-a', to: 'aqueduct-a' },
  { from: 'chapel-a', to: 'top-a' },
  { from: 'clock-a', to: 'aqueduct-a' },
  { from: 'top-a', to: 'marble-a' },
  { from: 'top-a', to: 'treasury-a' },
  // Castle B
  { from: 'entrance-b', to: 'marble-b' },
  { from: 'entrance-b', to: 'shrine-b' },
  { from: 'entrance-b', to: 'skeleton-b' },
  { from: 'marble-b', to: 'illusion-b-w' },
  { from: 'marble-b', to: 'illusion-b-e' },
  { from: 'marble-b', to: 'wailing-b' },
  { from: 'marble-b', to: 'top-b' },
  { from: 'wailing-b', to: 'treasury-b' },
  { from: 'wailing-b', to: 'shrine-b' },
  { from: 'shrine-b', to: 'wailing-b' },
  { from: 'skeleton-b', to: 'treasury-b' },
  { from: 'treasury-b', to: 'luminous-b' },
  { from: 'treasury-b', to: 'top-b' },
  { from: 'luminous-b', to: 'aqueduct-b' },
  { from: 'sky-b', to: 'chapel-b' },
  { from: 'sky-b', to: 'clock-b' },
  { from: 'sky-b', to: 'aqueduct-b' },
  { from: 'chapel-b', to: 'top-b' },
  { from: 'clock-b', to: 'aqueduct-b' },
  { from: 'top-b', to: 'marble-b' },
  { from: 'top-b', to: 'treasury-b' },
];

const hodOptionActions: OptionAction[] = [
  {
    condition: { optionId: 'area-shuffle', value: 'none' },
    action: {
      hideExits: allExitsOnly.map(e => e.id),
      addPaths: vanillaPaths,
      showMap: true,
    },
  },
  {
    condition: { optionId: 'area-shuffle', value: 'separate' },
    action: {
      showMap: false,
    },
  },
  {
    condition: { optionId: 'area-shuffle', value: 'combined' },
    action: {
      showMap: false,
    },
  },
];

export const hod: Game = {
  id: 'hod',
  name: 'Castlevania: Harmony of Dissonance',
  description: 'Metroidvania entrance randomizer',
  startNodeId: '__START__',
  nodes: hodNodes,
  exits: allExitsOnly,
  entrances: allExitsOnly,
  restrictions: hodRestrictions,
  displayOrder: allExitsOnly.map(e => e.id),
  vanillaExitToEntranceMap: hodVanillaMap,
  optionActions: hodOptionActions,
  edgeLabelExits: ['entrance-a-n', 'entrance-a-e', 'entrance-a-s', 'marble-a-w', 'marble-a-ssw', 'marble-a-sse', 'marble-a-se', 'marble-a-e', 'wailing-a-w', 'wailing-a-e', 'wailing-a-s', 'shrine-a-w', 'shrine-a-n', 'skeleton-a-w', 'skeleton-a-e', 'treasury-a-w', 'treasury-a-n', 'treasury-a-e', 'treasury-a-s', 'illusion-a-w', 'illusion-a-e', 'luminous-a-w', 'luminous-a-n', 'sky-a-n', 'sky-a-e', 'sky-a-s', 'chapel-a-s', 'chapel-a-e', 'clock-a-w', 'clock-a-s', 'aqueduct-a-s', 'aqueduct-a-n', 'aqueduct-a-e', 'top-a-w', 'top-a-n', 'entrance-b-n', 'entrance-b-e', 'entrance-b-s', 'marble-b-w', 'marble-b-ssw', 'marble-b-sse', 'marble-b-se', 'marble-b-e', 'wailing-b-w', 'wailing-b-e', 'wailing-b-s', 'shrine-b-w', 'shrine-b-n', 'skeleton-b-w', 'skeleton-b-e', 'treasury-b-w', 'treasury-b-n', 'treasury-b-e', 'treasury-b-s', 'illusion-b-w', 'illusion-b-e', 'luminous-b-w', 'luminous-b-n', 'sky-b-n', 'sky-b-e', 'sky-b-s', 'chapel-b-s', 'chapel-b-e', 'clock-b-w', 'clock-b-s', 'aqueduct-b-s', 'aqueduct-b-n', 'aqueduct-b-e', 'top-b-w', 'top-b-n'],
  staticConnections: `
  graph TD;
  %% __START__["Start"]
  entrance-a["Entrance A"];
  %% __START__-->entrance-a;
  marble-a["Marble Corridor A"];
  wailing-a["Wailing Way A"];
  shrine-a["Shrine of the Apostates A"];
  treasury-a["Castle Treasury A"];
  skeleton-a["Skeleton Cave A"];
  illusion-a-w["Room of Illusion A West"];
  illusion-a-e["Room of Illusion A East"];
  luminous-a["Luminous Cavern A"];
  sky-a["Sky Walkway A"];
  chapel-a["Chapel of Dissonance A"];
  clock-a["Clock Tower A"];
  aqueduct-a["Aqueduct of Dragons A"];
  top-a["Castle Top Floor A"];
  entrance-b["Entrance B"];
  marble-b["Marble Corridor B"];
  wailing-b["Wailing Way B"];
  shrine-b["Shrine of the Apostates B"];
  treasury-b["Castle Treasury B"];
  skeleton-b["Skeleton Cave B"];
  illusion-b-w["Room of Illusion B West"];
  illusion-b-e["Room of Illusion B East"];
  luminous-b["Luminous Cavern B"];
  sky-b["Sky Walkway B"];
  chapel-b["Chapel of Dissonance B"];
  clock-b["Clock Tower B"];
  aqueduct-b["Aqueduct of Dragons B"];
  top-b["Castle Top Floor B"];
  illusion-a-e <-->|cross| treasury-b;
  luminous-b <-->|cross| sky-a;
  clock-a <-->|warp room| clock-b;
  entrance-a <-->|warp room| entrance-b;
  treasury-a <-->|lure key warp room| treasury-b;
  top-a <-->|chapel warp room| top-b;
  luminous-a <-->|crushing warp room| luminous-b;
`,
  options: [
    {
      id: 'area-shuffle',
      name: 'Area Shuffle',
      description: 'Randomize which areas connect to which?',
      defaultValue: 'combined',
      values: [
        { id: 'none', description: 'Vanilla layout' },
        { id: 'separate', description: 'Shuffled, separate castle pools' },
        { id: 'combined', description: 'Shuffled, both castle pools mixed' }
      ],
    },
    {
      id: 'decouple-transitions',
      name: 'Decouple Transitions',
      description: 'Have the transitions work in different directions?',
      defaultValue: 'false',
      values: [
        { id: 'false', description: 'No (Two-Way)' },
        { id: 'true', description: 'Yes (One-Way)' },
      ]
    },
  ],
  showMap: false,
  startUnselected: true,
  allowSwapOnDuplicate: false,
};
