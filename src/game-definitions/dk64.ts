import type { EntranceRestriction, Game, LocationReference } from '../types';

// Primary area nodes
const dk64Nodes: LocationReference[] = [
  { id: 'training', name: 'Training Ground' },
  { id: 'isles', name: 'DK Isles' },
  { id: 'japes', name: 'Jungle Japes' },
  { id: 'aztec', name: 'Angry Aztec' },
  { id: 'factory', name: 'Frantic Factory' },
  { id: 'galleon', name: 'Gloomy Galleon' },
  { id: 'forest', name: 'Fungi Forest' },
  { id: 'caves', name: 'Crystal Caves' },
  { id: 'castle', name: 'Creepy Castle' },
];

// Base properties for common exit configurations
const bidirectionalBase = { arrowType: '<-->' as const };
const trainingBase = { ...bidirectionalBase, uiGroup: 'Training Ground', parentNodeId: 'training' };
const islesBase = { ...bidirectionalBase, uiGroup: 'DK Isles', parentNodeId: 'isles' };
const levelLobbyBase = { ...bidirectionalBase, uiGroup: 'Level Lobby', parentNodeId: 'isles' };
const jadesBase = { ...bidirectionalBase, uiGroup: 'Jungle Japes', parentNodeId: 'japes' };
const aztecBase = { ...bidirectionalBase, uiGroup: 'Angry Aztec', parentNodeId: 'aztec' };
const factoryBase = { ...bidirectionalBase, uiGroup: 'Frantic Factory', parentNodeId: 'factory' };
const galleonBase = { ...bidirectionalBase, uiGroup: 'Gloomy Galleon', parentNodeId: 'galleon' };
const fungiBase = { ...bidirectionalBase, uiGroup: 'Fungi Forest', parentNodeId: 'forest' };
const cavesBase = { ...bidirectionalBase, uiGroup: 'Crystal Caves', parentNodeId: 'caves' };
const castleBase = { ...bidirectionalBase, uiGroup: 'Creepy Castle', parentNodeId: 'castle' };

// Common tags.
const trainingGroundTags = ['training', 'ground'];
const dkIslesTags = ['isles', 'hub'];
const japesTags = ['jungle', 'japes'];
const aztecTags = ['angry', 'aztec'];
const factoryTags = ['frantic', 'factory'];
const galleonTags = ['gloomy', 'galleon'];
const fungiTags = ['fungi', 'forest'];
const cavesTags = ['crystal', 'caves'];
const castleTags = ['creepy', 'castle'];
const helmTags = ['hideout', 'helm'];

const treehouseTags = ['tree house', 'treehouse'];
const bananaFairyTags = ['banana', 'fairy', 'return', 'bfi', 'rareware room'];
const diddyMountainTags = ['diddy mountain top', 'di mountain top', 'diddy hillside mountain top', 'di hillside mountain top'];
const fiveDoorTempleTags = ['five door temple', 'five-door temple', '5dt', '5dtemple'];
const powerShedTags = ['power shed', 'power hut'];
const fiveDoorShipTags = ['five door ship', 'five-door ship', '5ds', '5dship'];
const twoDoorShipTags = ['two door ship', 'two-door ship', '2ds', '2dship'];
const stompGameTags = ['stomp game', 'slam challenge', 'ice castle', 'frozen castle'];
const fiveDoorCabinTags = ['five door cabin', 'five-door cabin', '5dc', '5dcabin'];
const sprintCabinTags = ['one door cabin', 'one-door cabin', '1dc', '1dcabin', 'sprint cabin'];
const rotatingCabinTags = ['rotating cabin', 'solo cabin'];
const fiveDoorIglooTags = ['five door igloo', 'five-door igloo', '5di', '5digloo'];

// Exits array
const dk64Exits: LocationReference[] = [
  // Training Ground
  { ...trainingBase, id: 'training-treehouse', name: 'Training Ground → DK\'s Treehouse', tags: [...trainingGroundTags, ...treehouseTags], bidirectionalPair: 'treehouse-training' },
  { ...trainingBase, id: 'treehouse-training', name: 'DK\'s Treehouse → Training Ground', tags: [...trainingGroundTags, ...treehouseTags], bidirectionalPair: 'training-treehouse' },
  { ...trainingBase, id: 'training-isles', name: 'Training Ground → DK Isles', tags: [...trainingGroundTags, ...dkIslesTags], bidirectionalPair: 'isles-training' },
  
  // DK Isles
  { ...islesBase, id: 'isles-training', name: 'DK Isles → Training Ground', tags: [...trainingGroundTags, ...dkIslesTags], bidirectionalPair: 'training-isles' },
  { ...islesBase, id: 'isles-japes-lobby', name: 'DK Isles → Japes Lobby', tags: [...dkIslesTags, ...japesTags, 'lobby'], bidirectionalPair: 'japes-lobby-isles' },
  { ...islesBase, id: 'isles-aztec-lobby', name: 'DK Isles → Aztec Lobby', tags: [...dkIslesTags, ...aztecTags, 'lobby'], bidirectionalPair: 'aztec-lobby-isles' },
  { ...islesBase, id: 'isles-factory-lobby', name: 'DK Isles → Factory Lobby', tags: [...dkIslesTags, ...factoryTags, 'lobby'], bidirectionalPair: 'factory-lobby-isles' },
  { ...islesBase, id: 'isles-galleon-lobby', name: 'DK Isles → Galleon Lobby', tags: [...dkIslesTags, ...galleonTags, 'lobby'], bidirectionalPair: 'galleon-lobby-isles' },
  { ...islesBase, id: 'isles-fungi-lobby', name: 'DK Isles → Fungi Lobby', tags: [...dkIslesTags, ...fungiTags, 'lobby'], bidirectionalPair: 'fungi-lobby-isles' },
  { ...islesBase, id: 'isles-caves-lobby', name: 'DK Isles → Caves Lobby', tags: [...dkIslesTags, ...cavesTags, 'lobby'], bidirectionalPair: 'caves-lobby-isles' },
  { ...islesBase, id: 'isles-castle-lobby', name: 'DK Isles → Castle Lobby', tags: [...dkIslesTags, ...castleTags, 'lobby'], bidirectionalPair: 'castle-lobby-isles' },
  { ...islesBase, id: 'isles-helm-lobby', name: 'DK Isles → Helm Lobby', tags: [...dkIslesTags, ...helmTags, 'lobby'], bidirectionalPair: 'helm-lobby-isles' },
  { ...islesBase, id: 'isles-lumsy', name: 'DK Isles → K. Lumsy\'s Room', tags: [...dkIslesTags, 'klumsy'], bidirectionalPair: 'lumsy-isles' },
  { ...islesBase, id: 'lumsy-isles', name: 'K. Lumsy\'s Room → DK Isles', tags: [...dkIslesTags, 'klumsy'], bidirectionalPair: 'isles-lumsy' },
  { ...islesBase, id: 'isles-banana-fairy', name: 'DK Isles → Banana Fairy', tags: [...dkIslesTags, ...bananaFairyTags], bidirectionalPair: 'banana-fairy-isles' },
  { ...islesBase, id: 'banana-fairy-isles', name: 'Banana Fairy → DK Isles', tags: [...dkIslesTags, ...bananaFairyTags], bidirectionalPair: 'isles-banana-fairy' },
  { ...islesBase, id: 'isles-snide', name: 'DK Isles → Snide Hideout', tags: [...dkIslesTags, 'snide', 'hideout'], bidirectionalPair: 'snide-isles' },
  { ...islesBase, id: 'snide-isles', name: 'Snide Hideout → DK Isles', tags: [...dkIslesTags, 'snide', 'hideout'], bidirectionalPair: 'isles-snide' },

  // Level Lobby
  { ...levelLobbyBase, id: 'japes-lobby-entrance', name: 'Japes Lobby → Japes Level Entrance', tags: [...dkIslesTags, ...japesTags, 'lobby'], bidirectionalPair: 'japes-entrance-lobby' },
  { ...levelLobbyBase, id: 'japes-lobby-isles', name: 'Japes Lobby → DK Isles', tags: [...dkIslesTags, ...japesTags, 'lobby'], bidirectionalPair: 'isles-japes-lobby' },
  { ...levelLobbyBase, id: 'aztec-lobby-entrance', name: 'Aztec Lobby → Aztec Level Entrance', tags: [...dkIslesTags, ...aztecTags, 'lobby'], bidirectionalPair: 'aztec-entrance-lobby' },
  { ...levelLobbyBase, id: 'aztec-lobby-isles', name: 'Aztec Lobby → DK Isles', tags: [...dkIslesTags, ...aztecTags, 'lobby'], bidirectionalPair: 'isles-aztec-lobby' },
  { ...levelLobbyBase, id: 'factory-lobby-entrance', name: 'Factory Lobby → Factory Level Entrance', tags: [...dkIslesTags, ...factoryTags, 'lobby'], bidirectionalPair: 'factory-entrance-lobby' },
  { ...levelLobbyBase, id: 'factory-lobby-isles', name: 'Factory Lobby → DK Isles', tags: [...dkIslesTags, ...factoryTags, 'lobby'], bidirectionalPair: 'isles-factory-lobby' },
  { ...levelLobbyBase, id: 'galleon-lobby-entrance', name: 'Galleon Lobby → Galleon Level Entrance', tags: [...dkIslesTags, ...galleonTags, 'lobby'], bidirectionalPair: 'galleon-entrance-lobby' },
  { ...levelLobbyBase, id: 'galleon-lobby-isles', name: 'Galleon Lobby → DK Isles', tags: [...dkIslesTags, ...galleonTags, 'lobby'], bidirectionalPair: 'isles-galleon-lobby' },
  { ...levelLobbyBase, id: 'fungi-lobby-entrance', name: 'Fungi Lobby → Fungi Level Entrance', tags: [...dkIslesTags, ...fungiTags, 'lobby'], bidirectionalPair: 'fungi-entrance-lobby' },
  { ...levelLobbyBase, id: 'fungi-lobby-isles', name: 'Fungi Lobby → DK Isles', tags: [...dkIslesTags, ...fungiTags, 'lobby'], bidirectionalPair: 'isles-fungi-lobby' },
  { ...levelLobbyBase, id: 'caves-lobby-entrance', name: 'Caves Lobby → Caves Level Entrance', tags: [...dkIslesTags, ...cavesTags, 'lobby'], bidirectionalPair: 'caves-entrance-lobby' },
  { ...levelLobbyBase, id: 'caves-lobby-isles', name: 'Caves Lobby → DK Isles', tags: [...dkIslesTags, ...cavesTags, 'lobby'], bidirectionalPair: 'isles-caves-lobby' },
  { ...levelLobbyBase, id: 'castle-lobby-entrance', name: 'Castle Lobby → Castle Level Entrance', tags: [...dkIslesTags, ...castleTags, 'lobby'], bidirectionalPair: 'castle-entrance-lobby' },
  { ...levelLobbyBase, id: 'castle-lobby-isles', name: 'Castle Lobby → DK Isles', tags: [...dkIslesTags, ...castleTags, 'lobby'], bidirectionalPair: 'isles-castle-lobby' },
  { ...levelLobbyBase, id: 'helm-lobby-entrance', name: 'Helm Lobby → Helm Level Entrance', tags: [...dkIslesTags, ...helmTags, 'lobby'], bidirectionalPair: 'helm-entrance-lobby' },
  { ...levelLobbyBase, id: 'helm-entrance-lobby', name: 'Helm Level Entrance → Helm Lobby', tags: [...dkIslesTags, ...helmTags, 'lobby'], bidirectionalPair: 'helm-lobby-entrance' },
  { ...levelLobbyBase, id: 'helm-lobby-isles', name: 'Helm Lobby → DK Isles', tags: [...dkIslesTags, ...helmTags, 'lobby'], bidirectionalPair: 'isles-helm-lobby' },

  // Jungle Japes
  // Jungle Japes
  { ...jadesBase, id: 'japes-entrance-lobby', name: 'Japes Level Entrance → Japes Lobby', tags: [...dkIslesTags, ...japesTags, 'lobby'], bidirectionalPair: 'japes-lobby-entrance' },
  { ...jadesBase, id: 'japes-main-diddy', name: 'Japes Main → Diddy Mountain', tags: [...japesTags, ...diddyMountainTags], bidirectionalPair: 'diddy-japes-main' },
  { ...jadesBase, id: 'diddy-japes-main', name: 'Diddy Mountain → Japes Main', tags: [...japesTags, ...diddyMountainTags], bidirectionalPair: 'japes-main-diddy' },
  { ...jadesBase, id: 'japes-main-lanky', name: 'Japes Main → Lanky Painting Room', tags: [...japesTags, 'lanky', 'painting'], bidirectionalPair: 'lanky-japes-main' },
  { ...jadesBase, id: 'lanky-japes-main', name: 'Lanky Painting Room → Japes Main', tags: [...japesTags, 'lanky', 'painting'], bidirectionalPair: 'japes-main-lanky' },
  { ...jadesBase, id: 'japes-main-chunky', name: 'Japes Main → Chunky Underground', tags: [...japesTags, 'chunky', 'underground'], bidirectionalPair: 'chunky-japes-main' },
  { ...jadesBase, id: 'chunky-japes-main', name: 'Chunky Underground → Japes Main', tags: [...japesTags, 'chunky', 'underground'], bidirectionalPair: 'japes-main-chunky' },
  { ...jadesBase, id: 'japes-main-tiny-beehive', name: 'Japes Main → Tiny Beehive', tags: [...japesTags, 'tiny', 'beehive', 'hive'], bidirectionalPair: 'tiny-beehive-japes-main' },
  { ...jadesBase, id: 'tiny-beehive-japes-main', name: 'Tiny Beehive → Japes Main', tags: [...japesTags, 'tiny', 'beehive', 'hive'], bidirectionalPair: 'japes-main-tiny-beehive' },

  // Angry Aztec
  { ...aztecBase, id: 'aztec-entrance-lobby', name: 'Aztec Level Entrance → Aztec Lobby', tags: [...dkIslesTags, ...aztecTags, 'lobby'], bidirectionalPair: 'aztec-lobby-entrance' },
  { ...aztecBase, id: 'aztec-main-tiny-temple', name: 'Aztec Main → Tiny Temple', tags: [...aztecTags, 'tiny', 'temple'], bidirectionalPair: 'tiny-temple-aztec-main' },
  { ...aztecBase, id: 'tiny-temple-aztec-main', name: 'Tiny Temple → Aztec Main', tags: [...aztecTags, 'tiny', 'temple'], bidirectionalPair: 'aztec-main-tiny-temple' },
  { ...aztecBase, id: 'aztec-main-llama-temple', name: 'Aztec Main → Llama Temple', tags: [...aztecTags, 'llama', 'temple'], bidirectionalPair: 'llama-temple-aztec-main' },
  { ...aztecBase, id: 'llama-temple-aztec-main', name: 'Llama Temple → Aztec Main', tags: [...aztecTags, 'llama', 'temple'], bidirectionalPair: 'aztec-main-llama-temple' },
  { ...aztecBase, id: 'aztec-main-dk-5d-temple', name: 'Aztec Main → DK 5D Temple', tags: [...aztecTags, 'donkey', 'dk', ...fiveDoorTempleTags], bidirectionalPair: 'dk-5d-temple-aztec-main' },
  { ...aztecBase, id: 'dk-5d-temple-aztec-main', name: 'DK 5D Temple → Aztec Main', tags: [...aztecTags, 'donkey', 'dk', ...fiveDoorTempleTags], bidirectionalPair: 'aztec-main-dk-5d-temple' },
  { ...aztecBase, id: 'aztec-main-diddy-5d-temple', name: 'Aztec Main → Diddy 5D Temple', tags: [...aztecTags, 'diddy', ...fiveDoorTempleTags], bidirectionalPair: 'diddy-5d-temple-aztec-main' },
  { ...aztecBase, id: 'diddy-5d-temple-aztec-main', name: 'Diddy 5D Temple → Aztec Main', tags: [...aztecTags, 'diddy', ...fiveDoorTempleTags], bidirectionalPair: 'aztec-main-diddy-5d-temple' },
  { ...aztecBase, id: 'aztec-main-lanky-5d-temple', name: 'Aztec Main → Lanky 5D Temple', tags: [...aztecTags, 'lanky', ...fiveDoorTempleTags], bidirectionalPair: 'lanky-5d-temple-aztec-main' },
  { ...aztecBase, id: 'lanky-5d-temple-aztec-main', name: 'Lanky 5D Temple → Aztec Main', tags: [...aztecTags, 'lanky', ...fiveDoorTempleTags], bidirectionalPair: 'aztec-main-lanky-5d-temple' },
  { ...aztecBase, id: 'aztec-main-tiny-5d-temple', name: 'Aztec Main → Tiny 5D Temple', tags: [...aztecTags, 'tiny', ...fiveDoorTempleTags], bidirectionalPair: 'tiny-5d-temple-aztec-main' },
  { ...aztecBase, id: 'tiny-5d-temple-aztec-main', name: 'Tiny 5D Temple → Aztec Main', tags: [...aztecTags, 'tiny', ...fiveDoorTempleTags], bidirectionalPair: 'aztec-main-tiny-5d-temple' },
  { ...aztecBase, id: 'aztec-main-chunky-5d-temple', name: 'Aztec Main → Chunky 5D Temple', tags: [...aztecTags, 'chunky', ...fiveDoorTempleTags], bidirectionalPair: 'chunky-5d-temple-aztec-main' },
  { ...aztecBase, id: 'chunky-5d-temple-aztec-main', name: 'Chunky 5D Temple → Aztec Main', tags: [...aztecTags, 'chunky', ...fiveDoorTempleTags], bidirectionalPair: 'aztec-main-chunky-5d-temple' },
  { ...aztecBase, id: 'aztec-main-tiny-beetle-race', name: 'Aztec Main → Tiny Beetle Race', tags: [...aztecTags, 'tiny', 'beetle', 'race'], bidirectionalPair: 'tiny-beetle-race-aztec-main' },
  { ...aztecBase, id: 'tiny-beetle-race-aztec-main', name: 'Tiny Beetle Race → Aztec Main', tags: [...aztecTags, 'tiny', 'beetle', 'race'], bidirectionalPair: 'aztec-main-tiny-beetle-race' },

  // Frantic Factory
  { ...factoryBase, id: 'factory-entrance-lobby', name: 'Factory Level Entrance → Factory Lobby', tags: [...dkIslesTags, ...factoryTags, 'lobby'], bidirectionalPair: 'factory-lobby-entrance' },
  { ...factoryBase, id: 'factory-main-arcade', name: 'Factory Main → Arcade', tags: [...factoryTags, 'main', 'arcade', 'storage'], bidirectionalPair: 'arcade-factory-main' },
  { ...factoryBase, id: 'arcade-factory-main', name: 'Arcade → Factory Main', tags: [...factoryTags, 'main', 'arcade', 'storage'], bidirectionalPair: 'factory-main-arcade' },
  { ...factoryBase, id: 'factory-main-dk-crusher', name: 'Factory Main → DK Crusher Room', tags: [...factoryTags, 'crusher', 'dk', 'donkey'], bidirectionalPair: 'dk-crusher-factory-main' },
  { ...factoryBase, id: 'dk-crusher-factory-main', name: 'DK Crusher Room → Factory Main', tags: [...factoryTags, 'crusher', 'dk', 'donkey'], bidirectionalPair: 'factory-main-dk-crusher' },
  { ...factoryBase, id: 'factory-main-dk-power-shed', name: 'Factory Main → DK Power Shed', tags: [...factoryTags, ...powerShedTags, 'dk', 'donkey'], bidirectionalPair: 'dk-power-shed-factory-main' },
  { ...factoryBase, id: 'dk-power-shed-factory-main', name: 'DK Power Shed → Factory Main', tags: [...factoryTags, ...powerShedTags, 'dk', 'donkey'], bidirectionalPair: 'factory-main-dk-power-shed' },
  { ...factoryBase, id: 'factory-main-tiny-car-race', name: 'Factory Main → Tiny Car Race', tags: [...factoryTags, 'tiny', 'car', 'race'], bidirectionalPair: 'tiny-car-race-factory-main' },
  { ...factoryBase, id: 'tiny-car-race-factory-main', name: 'Tiny Car Race → Factory Main', tags: [...factoryTags, 'tiny', 'car', 'race'], bidirectionalPair: 'factory-main-tiny-car-race' },

  // Gloomy Galleon
  { ...galleonBase, id: 'galleon-entrance-lobby', name: 'Galleon Level Entrance → Galleon Lobby', tags: [...dkIslesTags, ...galleonTags, 'lobby'], bidirectionalPair: 'galleon-lobby-entrance' },
  { ...galleonBase, id: 'galleon-main-dk-lighthouse', name: 'Galleon Main → DK Lighthouse', tags: [...galleonTags, 'dk', 'donkey', 'lighthouse', 'light house'], bidirectionalPair: 'dk-lighthouse-galleon-main' },
  { ...galleonBase, id: 'dk-lighthouse-galleon-main', name: 'DK Lighthouse → Galleon Main', tags: [...galleonTags, 'dk', 'donkey', 'lighthouse', 'light house'], bidirectionalPair: 'galleon-main-dk-lighthouse' },
  { ...galleonBase, id: 'galleon-main-chunky-seasick', name: 'Galleon Main → Chunky Seasick Ship', tags: [...galleonTags, 'chunky', 'drunky', 'seasick', 'sea sick', 'sick bay'], bidirectionalPair: 'chunky-seasick-galleon-main' },
  { ...galleonBase, id: 'chunky-seasick-galleon-main', name: 'Chunky Seasick Ship → Galleon Main', tags: [...galleonTags, 'chunky', 'drunky', 'seasick', 'sea sick', 'sick bay'], bidirectionalPair: 'galleon-main-chunky-seasick' },
  { ...galleonBase, id: 'galleon-main-tiny-mermaid', name: 'Galleon Main → Tiny Mermaid', tags: [...galleonTags, 'tiny', 'mermaid'], bidirectionalPair: 'tiny-mermaid-galleon-main' },
  { ...galleonBase, id: 'tiny-mermaid-galleon-main', name: 'Tiny Mermaid → Galleon Main', tags: [...galleonTags, 'tiny', 'mermaid'], bidirectionalPair: 'galleon-main-tiny-mermaid' },
  { ...galleonBase, id: 'galleon-main-tiny-treasure', name: 'Galleon Main → Tiny Treasure Chest', tags: [...galleonTags, 'tiny', 'treasure', 'chest', 'hype'], bidirectionalPair: 'tiny-treasure-galleon-main' },
  { ...galleonBase, id: 'tiny-treasure-galleon-main', name: 'Tiny Treasure Chest → Galleon Main', tags: [...galleonTags, 'tiny', 'treasure', 'chest', 'hype'], bidirectionalPair: 'galleon-main-tiny-treasure' },
  { ...galleonBase, id: 'galleon-main-dk-5d-ship', name: 'Galleon Main → DK 5D Ship (#3)', tags: [...galleonTags, 'dk', 'donkey', ...fiveDoorShipTags], bidirectionalPair: 'dk-5d-ship-galleon-main' },
  { ...galleonBase, id: 'dk-5d-ship-galleon-main', name: 'DK 5D Ship (#3) → Galleon Main', tags: [...galleonTags, 'dk', 'donkey', ...fiveDoorShipTags], bidirectionalPair: 'galleon-main-dk-5d-ship' },
  { ...galleonBase, id: 'galleon-main-diddy-5d-ship', name: 'Galleon Main → Diddy 5D Ship (#2)', tags: [...galleonTags, 'diddy', ...fiveDoorShipTags], bidirectionalPair: 'diddy-5d-ship-galleon-main' },
  { ...galleonBase, id: 'diddy-5d-ship-galleon-main', name: 'Diddy 5D Ship (#2) → Galleon Main', tags: [...galleonTags, 'diddy', ...fiveDoorShipTags], bidirectionalPair: 'galleon-main-diddy-5d-ship' },
  { ...galleonBase, id: 'galleon-main-lanky-5d-ship', name: 'Galleon Main → Lanky 5D Ship (#4)', tags: [...galleonTags, 'lanky', ...fiveDoorShipTags], bidirectionalPair: 'lanky-5d-ship-galleon-main' },
  { ...galleonBase, id: 'lanky-5d-ship-galleon-main', name: 'Lanky 5D Ship (#4) → Galleon Main', tags: [...galleonTags, 'lanky', ...fiveDoorShipTags], bidirectionalPair: 'galleon-main-lanky-5d-ship' },
  { ...galleonBase, id: 'galleon-main-tiny-5d-ship', name: 'Galleon Main → Tiny 5D Ship (#5)', tags: [...galleonTags, 'tiny', ...fiveDoorShipTags], bidirectionalPair: 'tiny-5d-ship-galleon-main' },
  { ...galleonBase, id: 'tiny-5d-ship-galleon-main', name: 'Tiny 5D Ship (#5) → Galleon Main', tags: [...galleonTags, 'tiny', ...fiveDoorShipTags], bidirectionalPair: 'galleon-main-tiny-5d-ship' },
  { ...galleonBase, id: 'galleon-main-chunky-5d-ship', name: 'Galleon Main → Chunky 5D Ship (Top)', tags: [...galleonTags, 'chunky', ...fiveDoorShipTags], bidirectionalPair: 'chunky-5d-ship-galleon-main' },
  { ...galleonBase, id: 'chunky-5d-ship-galleon-main', name: 'Chunky 5D Ship (Top) → Galleon Main', tags: [...galleonTags, 'chunky', ...fiveDoorShipTags], bidirectionalPair: 'galleon-main-chunky-5d-ship' },
  { ...galleonBase, id: 'galleon-main-lanky-2d-ship', name: 'Galleon Main → Lanky 2D Ship', tags: [...galleonTags, 'lanky', ...twoDoorShipTags], bidirectionalPair: 'lanky-2d-ship-galleon-main' },
  { ...galleonBase, id: 'lanky-2d-ship-galleon-main', name: 'Lanky 2D Ship → Galleon Main', tags: [...galleonTags, 'lanky', ...twoDoorShipTags], bidirectionalPair: 'galleon-main-lanky-2d-ship' },
  { ...galleonBase, id: 'galleon-main-tiny-2d-ship', name: 'Galleon Main → Tiny 2D Ship', tags: [...galleonTags, 'tiny', ...twoDoorShipTags], bidirectionalPair: 'tiny-2d-ship-galleon-main' },
  { ...galleonBase, id: 'tiny-2d-ship-galleon-main', name: 'Tiny 2D Ship → Galleon Main', tags: [...galleonTags, 'tiny', ...twoDoorShipTags], bidirectionalPair: 'galleon-main-tiny-2d-ship' },
  { ...galleonBase, id: 'galleon-main-tiny-submarine', name: 'Galleon Main → Tiny Submarine', tags: [...galleonTags, 'tiny', 'submarine'], bidirectionalPair: 'tiny-submarine-galleon-main' },
  { ...galleonBase, id: 'tiny-submarine-galleon-main', name: 'Tiny Submarine → Galleon Main', tags: [...galleonTags, 'tiny', 'submarine'], bidirectionalPair: 'galleon-main-tiny-submarine' },
  { ...galleonBase, id: 'galleon-main-mech-fish', name: 'Galleon Main → Mech Fish', tags: [...galleonTags, 'diddy', 'mechafish', 'mech', 'fish', 'agenda'], bidirectionalPair: 'mech-fish-galleon-main' },
  { ...galleonBase, id: 'mech-fish-galleon-main', name: 'Mech Fish → Galleon Main', tags: [...galleonTags, 'diddy', 'mechafish', 'mech', 'fish', 'agenda'], bidirectionalPair: 'galleon-main-mech-fish' },
  { ...galleonBase, id: 'galleon-main-dk-seal-race', name: 'Galleon Main → DK Seal Race', tags: [...galleonTags, 'dk', 'donkey', 'seal', 'race'], bidirectionalPair: 'dk-seal-race-galleon-main' },
  { ...galleonBase, id: 'dk-seal-race-galleon-main', name: 'DK Seal Race → Galleon Main', tags: [...galleonTags, 'dk', 'donkey', 'seal', 'race'], bidirectionalPair: 'galleon-main-dk-seal-race' },

  // Fungi Forest
  { ...fungiBase, id: 'fungi-entrance-lobby', name: 'Fungi Level Entrance → Fungi Lobby', tags: [...dkIslesTags, ...fungiTags, 'lobby'], bidirectionalPair: 'fungi-lobby-entrance' },
  { ...fungiBase, id: 'fungi-main-mill-front', name: 'Forest Main → Mill Front Door', tags: [...fungiTags, 'mill', 'front'], bidirectionalPair: 'mill-front-fungi-main' },
  { ...fungiBase, id: 'mill-front-fungi-main', name: 'Mill Front Door → Forest Main', tags: [...fungiTags, 'mill', 'front'], bidirectionalPair: 'fungi-main-mill-front' },
  { ...fungiBase, id: 'front-mill-tiny-back-mill-tiny', name: 'Front Mill Tiny Hole → Back Mill Tiny Hole', tags: [...fungiTags, 'mill', 'front', 'back', 'tiny', 'hole'], bidirectionalPair: 'back-mill-tiny-front-mill-tiny' },
  { ...fungiBase, id: 'back-mill-tiny-front-mill-tiny', name: 'Back Mill Tiny Hole → Front Mill Tiny Hole', tags: [...fungiTags, 'mill', 'front', 'back', 'tiny', 'hole'], bidirectionalPair: 'front-mill-tiny-back-mill-tiny' },
  { ...fungiBase, id: 'fungi-main-mill-back', name: 'Forest Main → Mill Back Door', tags: [...fungiTags, 'mill', 'back'], bidirectionalPair: 'mill-back-fungi-main' },
  { ...fungiBase, id: 'mill-back-fungi-main', name: 'Mill Back Door → Forest Main', tags: [...fungiTags, 'mill', 'back'], bidirectionalPair: 'fungi-main-mill-back' },
  { ...fungiBase, id: 'back-mill-spider-room', name: 'Back Mill → Spider Room', tags: [...fungiTags, 'mill', 'back', 'spider', 'tiny', 'chunky'], bidirectionalPair: 'spider-room-back-mill' },
  { ...fungiBase, id: 'spider-room-back-mill', name: 'Spider Room → Back Mill', tags: [...fungiTags, 'mill', 'back', 'spider', 'tiny', 'chunky'], bidirectionalPair: 'back-mill-spider-room' },
  { ...fungiBase, id: 'fungi-main-back-mill-tiny', name: 'Forest Main → Back Mill Tiny Hole', tags: [...fungiTags, 'mill', 'back', 'tiny'], bidirectionalPair: 'back-mill-tiny-fungi-main' },
  { ...fungiBase, id: 'back-mill-tiny-fungi-main', name: 'Back Mill Tiny Hole → Forest Main', tags: [...fungiTags, 'mill', 'back', 'tiny'], bidirectionalPair: 'fungi-main-back-mill-tiny' },
  { ...fungiBase, id: 'fungi-main-lanky-mill-attic', name: 'Forest Main → Lanky Mill Attic', tags: [...fungiTags, 'mill', 'attic', 'lanky'], bidirectionalPair: 'lanky-mill-attic-fungi-main' },
  { ...fungiBase, id: 'lanky-mill-attic-fungi-main', name: 'Lanky Mill Attic → Forest Main', tags: [...fungiTags, 'mill', 'attic', 'lanky'], bidirectionalPair: 'fungi-main-lanky-mill-attic' },
  { ...fungiBase, id: 'fungi-main-diddy-winch', name: 'Forest Main → Diddy Winch Room', tags: [...fungiTags, 'mill', 'diddy', 'winch'], bidirectionalPair: 'diddy-winch-fungi-main' },
  { ...fungiBase, id: 'diddy-winch-fungi-main', name: 'Diddy Winch Room → Forest Main', tags: [...fungiTags, 'mill', 'diddy', 'winch'], bidirectionalPair: 'fungi-main-diddy-winch' },
  { ...fungiBase, id: 'fungi-main-diddy-dark-rafters', name: 'Forest Main → Diddy Dark Rafters', tags: [...fungiTags, 'diddy', 'dark', 'rafters'], bidirectionalPair: 'diddy-dark-rafters-fungi-main' },
  { ...fungiBase, id: 'diddy-dark-rafters-fungi-main', name: 'Diddy Dark Rafters → Forest Main', tags: [...fungiTags, 'diddy', 'dark', 'rafters'], bidirectionalPair: 'fungi-main-diddy-dark-rafters' },
  { ...fungiBase, id: 'fungi-main-dk-thornvine', name: 'Forest Main → DK Thornvine Barn', tags: [...fungiTags, 'dk', 'donkey', 'thornvine', 'barn'], bidirectionalPair: 'dk-thornvine-fungi-main' },
  { ...fungiBase, id: 'dk-thornvine-fungi-main', name: 'DK Thornvine Barn → Forest Main', tags: [...fungiTags, 'dk', 'donkey', 'thornvine', 'barn'], bidirectionalPair: 'fungi-main-dk-thornvine' },
  { ...fungiBase, id: 'fungi-main-giant-mushroom-base', name: 'Forest Main → Giant Mushroom Base', tags: [...fungiTags, 'giant', 'mushroom'], bidirectionalPair: 'giant-mushroom-base-fungi-main' },
  { ...fungiBase, id: 'giant-mushroom-base-fungi-main', name: 'Giant Mushroom Base → Forest Main', tags: [...fungiTags, 'giant', 'mushroom'], bidirectionalPair: 'fungi-main-giant-mushroom-base' },
  { ...fungiBase, id: 'fungi-main-giant-mushroom-middle-low', name: 'Forest Main → Giant Mushroom Middle Low', tags: [...fungiTags, 'giant', 'mushroom'], bidirectionalPair: 'giant-mushroom-middle-low-fungi-main' },
  { ...fungiBase, id: 'giant-mushroom-middle-low-fungi-main', name: 'Giant Mushroom Middle Low → Forest Main', tags: [...fungiTags, 'giant', 'mushroom'], bidirectionalPair: 'fungi-main-giant-mushroom-middle-low' },
  { ...fungiBase, id: 'fungi-main-giant-mushroom-middle-high', name: 'Forest Main → Giant Mushroom Middle High', tags: [...fungiTags, 'giant', 'mushroom'], bidirectionalPair: 'giant-mushroom-middle-high-fungi-main' },
  { ...fungiBase, id: 'giant-mushroom-middle-high-fungi-main', name: 'Giant Mushroom Middle High → Forest Main', tags: [...fungiTags, 'giant', 'mushroom'], bidirectionalPair: 'fungi-main-giant-mushroom-middle-high' },
  { ...fungiBase, id: 'fungi-main-giant-mushroom-night', name: 'Forest Main → Giant Mushroom Night Door', tags: [...fungiTags, 'giant', 'mushroom', 'night'], bidirectionalPair: 'giant-mushroom-night-fungi-main' },
  { ...fungiBase, id: 'giant-mushroom-night-fungi-main', name: 'Giant Mushroom Night Door → Forest Main', tags: [...fungiTags, 'giant', 'mushroom', 'night'], bidirectionalPair: 'fungi-main-giant-mushroom-night' },
  { ...fungiBase, id: 'fungi-main-giant-mushroom-top', name: 'Forest Main → Giant Mushroom Top', tags: [...fungiTags, 'giant', 'mushroom'], bidirectionalPair: 'giant-mushroom-top-fungi-main' },
  { ...fungiBase, id: 'giant-mushroom-top-fungi-main', name: 'Giant Mushroom Top → Forest Main', tags: [...fungiTags, 'giant', 'mushroom'], bidirectionalPair: 'fungi-main-giant-mushroom-top' },
  { ...fungiBase, id: 'fungi-main-chunky-face', name: 'Forest Main → Chunky Face Puzzle', tags: [...fungiTags, 'giant', 'mushroom', 'chunky', 'face', 'puzzle'], bidirectionalPair: 'chunky-face-fungi-main' },
  { ...fungiBase, id: 'chunky-face-fungi-main', name: 'Chunky Face Puzzle → Forest Main', tags: [...fungiTags, 'giant', 'mushroom', 'chunky', 'face', 'puzzle'], bidirectionalPair: 'fungi-main-chunky-face' },
  { ...fungiBase, id: 'fungi-main-lanky-bouncy-mushroom', name: 'Forest Main → Lanky Bouncy Mushroom', tags: [...fungiTags, 'giant', 'mushroom', 'lanky', 'bounce', 'bouncy', 'zinger'], bidirectionalPair: 'lanky-bouncy-mushroom-fungi-main' },
  { ...fungiBase, id: 'lanky-bouncy-mushroom-fungi-main', name: 'Lanky Bouncy Mushroom → Forest Main', tags: [...fungiTags, 'giant', 'mushroom', 'lanky', 'bounce', 'bouncy', 'zinger'], bidirectionalPair: 'fungi-main-lanky-bouncy-mushroom' },
  { ...fungiBase, id: 'fungi-main-lanky-mushroom-puzzle', name: 'Forest Main → Lanky Mushroom Puzzle', tags: [...fungiTags, 'giant', 'mushroom', 'lanky', 'puzzle'], bidirectionalPair: 'lanky-mushroom-puzzle-fungi-main' },
  { ...fungiBase, id: 'lanky-mushroom-puzzle-fungi-main', name: 'Lanky Mushroom Puzzle → Forest Main', tags: [...fungiTags, 'giant', 'mushroom', 'lanky', 'puzzle'], bidirectionalPair: 'fungi-main-lanky-mushroom-puzzle' },
  { ...fungiBase, id: 'fungi-main-tiny-anthill', name: 'Forest Main → Tiny Anthill', tags: [...fungiTags, 'tiny', 'anthill', 'ant', 'hill', 'owl', 'bean'], bidirectionalPair: 'tiny-anthill-fungi-main' },
  { ...fungiBase, id: 'tiny-anthill-fungi-main', name: 'Tiny Anthill → Forest Main', tags: [...fungiTags, 'tiny', 'anthill', 'ant', 'hill', 'owl', 'bean'], bidirectionalPair: 'fungi-main-tiny-anthill' },

  // Crystal Caves
  { ...cavesBase, id: 'caves-entrance-lobby', name: 'Caves Level Entrance → Caves Lobby', tags: [...dkIslesTags, ...cavesTags, 'lobby'], bidirectionalPair: 'caves-lobby-entrance' },
  { ...cavesBase, id: 'caves-lanky-ice-castle', name: 'Caves Main → Lanky Ice Castle', tags: [...cavesTags, 'lanky', ...stompGameTags], bidirectionalPair: 'lanky-ice-castle-caves' },
  { ...cavesBase, id: 'lanky-ice-castle-caves', name: 'Lanky Ice Castle → Caves Main', tags: [...cavesTags, 'lanky', ...stompGameTags], bidirectionalPair: 'caves-lanky-ice-castle' },
  { ...cavesBase, id: 'caves-lanky-beetle-race', name: 'Caves Main → Lanky Beetle Race', tags: [...cavesTags, 'lanky', 'beetle', 'race'], bidirectionalPair: 'lanky-beetle-race-caves' },
  { ...cavesBase, id: 'lanky-beetle-race-caves', name: 'Lanky Beetle Race → Caves Main', tags: [...cavesTags, 'lanky', 'beetle', 'race'], bidirectionalPair: 'caves-lanky-beetle-race' },
  { ...cavesBase, id: 'caves-dk-5d-cabin', name: 'Caves Main → DK 5D Cabin', tags: [...cavesTags, 'dk', 'donkey', ...fiveDoorCabinTags], bidirectionalPair: 'dk-5d-cabin-caves' },
  { ...cavesBase, id: 'dk-5d-cabin-caves', name: 'DK 5D Cabin → Caves Main', tags: [...cavesTags, 'dk', 'donkey', ...fiveDoorCabinTags], bidirectionalPair: 'caves-dk-5d-cabin' },
  { ...cavesBase, id: 'caves-diddy-lower-5d-cabin', name: 'Caves Main → Diddy Lower 5D Cabin', tags: [...cavesTags, 'diddy', 'lower', ...fiveDoorCabinTags], bidirectionalPair: 'diddy-lower-5d-cabin-caves' },
  { ...cavesBase, id: 'diddy-lower-5d-cabin-caves', name: 'Diddy Lower 5D Cabin → Caves Main', tags: [...cavesTags, 'diddy', 'lower', ...fiveDoorCabinTags], bidirectionalPair: 'caves-diddy-lower-5d-cabin' },
  { ...cavesBase, id: 'caves-diddy-upper-5d-cabin', name: 'Caves Main → Diddy Upper 5D Cabin', tags: [...cavesTags, 'diddy', 'upper', ...fiveDoorCabinTags], bidirectionalPair: 'diddy-upper-5d-cabin-caves' },
  { ...cavesBase, id: 'diddy-upper-5d-cabin-caves', name: 'Diddy Upper 5D Cabin → Caves Main', tags: [...cavesTags, 'diddy', 'upper', ...fiveDoorCabinTags], bidirectionalPair: 'caves-diddy-upper-5d-cabin' },
  { ...cavesBase, id: 'caves-tiny-5d-cabin', name: 'Caves Main → Tiny 5D Cabin', tags: [...cavesTags, 'tiny', ...fiveDoorCabinTags], bidirectionalPair: 'tiny-5d-cabin-caves' },
  { ...cavesBase, id: 'tiny-5d-cabin-caves', name: 'Tiny 5D Cabin → Caves Main', tags: [...cavesTags, 'tiny', ...fiveDoorCabinTags], bidirectionalPair: 'caves-tiny-5d-cabin' },
  { ...cavesBase, id: 'caves-chunky-5d-cabin', name: 'Caves Main → Chunky 5D Cabin', tags: [...cavesTags, 'chunky', ...fiveDoorCabinTags], bidirectionalPair: 'chunky-5d-cabin-caves' },
  { ...cavesBase, id: 'chunky-5d-cabin-caves', name: 'Chunky 5D Cabin → Caves Main', tags: [...cavesTags, 'chunky', ...fiveDoorCabinTags], bidirectionalPair: 'caves-chunky-5d-cabin' },
  { ...cavesBase, id: 'caves-lanky-1d-cabin', name: 'Caves Main → Lanky 1D Cabin', tags: [...cavesTags, 'lanky', ...sprintCabinTags], bidirectionalPair: 'lanky-1d-cabin-caves' },
  { ...cavesBase, id: 'lanky-1d-cabin-caves', name: 'Lanky 1D Cabin → Caves Main', tags: [...cavesTags, 'lanky', ...sprintCabinTags], bidirectionalPair: 'caves-lanky-1d-cabin' },
  { ...cavesBase, id: 'caves-dk-rotating-room', name: 'Caves Main → DK Rotating Room', tags: [...cavesTags, 'dk', 'donkey', ...rotatingCabinTags], bidirectionalPair: 'dk-rotating-room-caves' },
  { ...cavesBase, id: 'dk-rotating-room-caves', name: 'DK Rotating Room → Caves Main', tags: [...cavesTags, 'dk', 'donkey', ...rotatingCabinTags], bidirectionalPair: 'caves-dk-rotating-room' },
  { ...cavesBase, id: 'caves-dk-5d-igloo', name: 'Caves Main → DK 5D Igloo', tags: [...cavesTags, 'dk', 'donkey', ...fiveDoorIglooTags], bidirectionalPair: 'dk-5d-igloo-caves' },
  { ...cavesBase, id: 'dk-5d-igloo-caves', name: 'DK 5D Igloo → Caves Main', tags: [...cavesTags, 'dk', 'donkey', ...fiveDoorIglooTags], bidirectionalPair: 'caves-dk-5d-igloo' },
  { ...cavesBase, id: 'caves-diddy-5d-igloo', name: 'Caves Main → Diddy 5D Igloo', tags: [...cavesTags, 'diddy', ...fiveDoorIglooTags], bidirectionalPair: 'diddy-5d-igloo-caves' },
  { ...cavesBase, id: 'diddy-5d-igloo-caves', name: 'Diddy 5D Igloo → Caves Main', tags: [...cavesTags, 'diddy', ...fiveDoorIglooTags], bidirectionalPair: 'caves-diddy-5d-igloo' },
  { ...cavesBase, id: 'caves-lanky-5d-igloo', name: 'Caves Main → Lanky 5D Igloo', tags: [...cavesTags, 'lanky', ...fiveDoorIglooTags], bidirectionalPair: 'lanky-5d-igloo-caves' },
  { ...cavesBase, id: 'lanky-5d-igloo-caves', name: 'Lanky 5D Igloo → Caves Main', tags: [...cavesTags, 'lanky', ...fiveDoorIglooTags], bidirectionalPair: 'caves-lanky-5d-igloo' },
  { ...cavesBase, id: 'caves-tiny-5d-igloo', name: 'Caves Main → Tiny 5D Igloo', tags: [...cavesTags, 'tiny', ...fiveDoorIglooTags], bidirectionalPair: 'tiny-5d-igloo-caves' },
  { ...cavesBase, id: 'tiny-5d-igloo-caves', name: 'Tiny 5D Igloo → Caves Main', tags: [...cavesTags, 'tiny', ...fiveDoorIglooTags], bidirectionalPair: 'caves-tiny-5d-igloo' },
  { ...cavesBase, id: 'caves-chunky-5d-igloo', name: 'Caves Main → Chunky 5D Igloo', tags: [...cavesTags, 'chunky', ...fiveDoorIglooTags], bidirectionalPair: 'chunky-5d-igloo-caves' },
  { ...cavesBase, id: 'chunky-5d-igloo-caves', name: 'Chunky 5D Igloo → Caves Main', tags: [...cavesTags, 'chunky', ...fiveDoorIglooTags], bidirectionalPair: 'caves-chunky-5d-igloo' },

  // Creepy Castle
  { ...castleBase, id: 'castle-entrance-lobby', name: 'Castle Level Entrance → Castle Lobby', tags: [...dkIslesTags, ...castleTags, 'lobby'], bidirectionalPair: 'castle-lobby-entrance' },
  { ...castleBase, id: 'castle-main-dk-chunky-tree', name: 'Castle Main → DK/Chunky Tree', tags: [...castleTags, 'dk', 'donkey', 'chunky', 'tree'], bidirectionalPair: 'dk-chunky-tree-castle-main' },
  { ...castleBase, id: 'dk-chunky-tree-castle-main', name: 'DK/Chunky Tree → Castle Main', tags: [...castleTags, 'dk', 'donkey', 'chunky', 'tree'], bidirectionalPair: 'castle-main-dk-chunky-tree' },
  { ...castleBase, id: 'castle-main-lower-cave', name: 'Castle Main → Lower Cave', tags: [...castleTags, 'lower', 'cave'], bidirectionalPair: 'lower-cave-castle-main' },
  { ...castleBase, id: 'lower-cave-castle-main', name: 'Lower Cave → Castle Main', tags: [...castleTags, 'lower', 'cave'], bidirectionalPair: 'castle-main-lower-cave' },
  { ...castleBase, id: 'lower-cave-mausoleum', name: 'Lower Cave → Mausoleum', tags: [...castleTags, 'lower', 'cave', 'mausoleum', 'tiny', 'lanky'], bidirectionalPair: 'mausoleum-lower-cave' },
  { ...castleBase, id: 'mausoleum-lower-cave', name: 'Mausoleum → Lower Cave', tags: [...castleTags, 'lower', 'cave', 'mausoleum', 'tiny', 'lanky'], bidirectionalPair: 'lower-cave-mausoleum' },
  { ...castleBase, id: 'lower-cave-crypt', name: 'Lower Cave → Crypt', tags: [...castleTags, 'lower', 'cave', 'crypt', 'dk', 'donkey', 'diddy', 'chunky'], bidirectionalPair: 'crypt-lower-cave' },
  { ...castleBase, id: 'crypt-lower-cave', name: 'Crypt → Lower Cave', tags: [...castleTags, 'lower', 'cave', 'crypt', 'dk', 'donkey', 'diddy', 'chunky'], bidirectionalPair: 'lower-cave-crypt' },
  { ...castleBase, id: 'crypt-dk-minecart', name: 'Crypt → DK Minecart', tags: [...castleTags, 'crypt', 'dk', 'diddy', 'minecart'], bidirectionalPair: 'dk-minecart-crypt' },
  { ...castleBase, id: 'dk-minecart-crypt', name: 'DK Minecart → Crypt', tags: [...castleTags, 'crypt', 'dk', 'diddy', 'minecart'], bidirectionalPair: 'crypt-dk-minecart' },
  { ...castleBase, id: 'castle-main-upper-cave-moat', name: 'Castle Main → Upper Cave (Moat Door)', tags: [...castleTags, 'upper', 'cave', 'moat'], bidirectionalPair: 'upper-cave-moat-castle-main' },
  { ...castleBase, id: 'upper-cave-moat-castle-main', name: 'Upper Cave (Moat Door) → Castle Main', tags: [...castleTags, 'upper', 'cave', 'moat'], bidirectionalPair: 'castle-main-upper-cave-moat' },
  { ...castleBase, id: 'upper-cave-dungeon', name: 'Upper Cave → Dungeon', tags: [...castleTags, 'upper', 'cave', 'dungeon', 'dk', 'donkey', 'diddy', 'lanky'], bidirectionalPair: 'dungeon-upper-cave' },
  { ...castleBase, id: 'dungeon-upper-cave', name: 'Dungeon → Upper Cave', tags: [...castleTags, 'upper', 'cave', 'dungeon', 'dk', 'donkey', 'diddy', 'lanky'], bidirectionalPair: 'upper-cave-dungeon' },
  { ...castleBase, id: 'castle-main-upper-cave-back', name: 'Castle Main → Upper Cave (Back Door)', tags: [...castleTags, 'upper', 'cave', 'back'], bidirectionalPair: 'upper-cave-back-castle-main' },
  { ...castleBase, id: 'upper-cave-back-castle-main', name: 'Upper Cave (Back Door) → Castle Main', tags: [...castleTags, 'upper', 'cave', 'back'], bidirectionalPair: 'castle-main-upper-cave-back' },
  { ...castleBase, id: 'castle-main-chunky-museum', name: 'Castle Main → Chunky Museum', tags: [...castleTags, 'chunky', 'museum'], bidirectionalPair: 'chunky-museum-castle-main' },
  { ...castleBase, id: 'chunky-museum-castle-main', name: 'Chunky Museum → Castle Main', tags: [...castleTags, 'chunky', 'museum'], bidirectionalPair: 'castle-main-chunky-museum' },
  { ...castleBase, id: 'castle-main-tiny-trash-can', name: 'Castle Main → Tiny Trash Can', tags: [...castleTags, 'tiny', 'trash', 'can'], bidirectionalPair: 'tiny-trash-can-castle-main' },
  { ...castleBase, id: 'tiny-trash-can-castle-main', name: 'Tiny Trash Can → Castle Main', tags: [...castleTags, 'tiny', 'trash', 'can'], bidirectionalPair: 'castle-main-tiny-trash-can' },
  { ...castleBase, id: 'castle-main-lanky-greenhouse', name: 'Castle Main → Lanky Greenhouse', tags: [...castleTags, 'lanky', 'green', 'house', 'greenhouse'], bidirectionalPair: 'lanky-greenhouse-entrance-castle-main' },
  { ...castleBase, id: 'lanky-greenhouse-entrance-castle-main', name: 'Lanky Greenhouse Entrance → Castle Main', tags: [...castleTags, 'lanky', 'green', 'house', 'greenhouse'], bidirectionalPair: 'castle-main-lanky-greenhouse' },
  { ...castleBase, id: 'castle-main-chunky-shed', name: 'Castle Main → Chunky Shed', tags: [...castleTags, 'chunky', 'shed'], bidirectionalPair: 'chunky-shed-castle-main' },
  { ...castleBase, id: 'chunky-shed-castle-main', name: 'Chunky Shed → Castle Main', tags: [...castleTags, 'chunky', 'shed'], bidirectionalPair: 'castle-main-chunky-shed' },
  { ...castleBase, id: 'castle-main-diddy-ballroom', name: 'Castle Main → Diddy Ballroom', tags: [...castleTags, 'diddy', 'ballroom'], bidirectionalPair: 'diddy-ballroom-castle-main' },
  { ...castleBase, id: 'diddy-ballroom-castle-main', name: 'Diddy Ballroom → Castle Main', tags: [...castleTags, 'diddy', 'ballroom'], bidirectionalPair: 'castle-main-diddy-ballroom' },
  { ...castleBase, id: 'tiny-ballroom-tiny-museum', name: 'Tiny Ballroom → Tiny Museum', tags: [...castleTags, 'tiny', 'ballroom', 'museum'], bidirectionalPair: 'tiny-museum-tiny-ballroom' },
  { ...castleBase, id: 'tiny-museum-tiny-ballroom', name: 'Tiny Museum → Tiny Ballroom', tags: [...castleTags, 'tiny', 'ballroom', 'museum'], bidirectionalPair: 'tiny-ballroom-tiny-museum' },
  { ...castleBase, id: 'tiny-museum-tiny-car-race', name: 'Tiny Museum → Tiny Car Race', tags: [...castleTags, 'tiny', 'museum', 'car', 'race'], bidirectionalPair: 'tiny-car-race-tiny-museum' },
  { ...castleBase, id: 'tiny-car-race-tiny-museum', name: 'Tiny Car Race → Tiny Museum', tags: [...castleTags, 'tiny', 'museum', 'car', 'race'], bidirectionalPair: 'tiny-museum-tiny-car-race' },
  { ...castleBase, id: 'castle-main-dk-library', name: 'Castle Main → DK Library', tags: [...castleTags, 'dk', 'donkey', 'library'], bidirectionalPair: 'dk-library-castle-main' },
  { ...castleBase, id: 'dk-library-castle-main', name: 'DK Library → Castle Main', tags: [...castleTags, 'dk', 'donkey', 'library'], bidirectionalPair: 'castle-main-dk-library' },
  { ...castleBase, id: 'castle-main-lanky-tower', name: 'Castle Main → Lanky Tower', tags: [...castleTags, 'lanky', 'tower', 'sniper'], bidirectionalPair: 'lanky-tower-castle-main' },
  { ...castleBase, id: 'lanky-tower-castle-main', name: 'Lanky Tower → Castle Main', tags: [...castleTags, 'lanky', 'tower', 'sniper'], bidirectionalPair: 'castle-main-lanky-tower' },
];

// Entrances array - all exits can be entrance destinations
const dk64Entrances: LocationReference[] = dk64Exits;

// Generate restrictions: every exit can connect to every other exit except itself
const dk64Restrictions: EntranceRestriction[] = dk64Exits.map(exit => ({
  gameId: 'dk64',
  exitId: exit.id,
  allowedEntranceIds: dk64Exits.map(e => e.id),
}));

export const dk64: Game = {
  id: 'dk64',
  name: 'Donkey Kong 64',
  description: 'Loading zone randomizer',
  startNodeId: '__START__',
  nodes: dk64Nodes,
  exits: dk64Exits,
  entrances: dk64Entrances,
  staticConnections: `
  graph TD;
  %% __START__["Start"];
  training["Training Ground"];
  isles["DK Isles"];
  %% __START__-->isles;
  japes["Jungle Japes"];
  aztec["Angry Aztec"];
  factory["Frantic Factory"];
  galleon["Gloomy Galleon"];
  forest["Fungi Forest"];
  caves["Crystal Caves"];
  castle["Creepy Castle"];
  `,
  restrictions: dk64Restrictions,
  options: [
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
  hideDisabledOptions: true,
};
