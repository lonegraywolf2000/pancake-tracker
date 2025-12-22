import type { Game, EntranceRestriction, OptionAction } from '../types';

// Super Mario World exits - categorized by type
const smwExits = [
  // Transition exits (overworld paths) - these will be rendered as edge labels
  { id: 'yi-w', name: `Yoshi's Island West`, type: 'transition' as const, parentNodeId: 'yi-s' },
  { id: 'yi-e', name: `Yoshi's Island East`, type: 'transition' as const, parentNodeId: 'yi-s' },
  { id: 'dp-d', name: 'Donut Plains Door', type: 'transition' as const, parentNodeId: 'dp-n' },
  { id: 'tb-f', name: 'Twin Bridges Forest', type: 'transition' as const, parentNodeId: 'tb-e' },
  { id: 'fi-w', name: 'Forest of Illusion West', type: 'transition' as const, parentNodeId: 'fi-n' },
  { id: 'fi-s', name: 'Forest of Illusion South', type: 'transition' as const, parentNodeId: 'fi-n' },
  { id: 'ch-s', name: 'Chocolate Island Beyond Ship', type: 'transition' as const, parentNodeId: 'ch-w' },
  // Pipe exits
  { id: 'dp-p', name: 'Donut Plains West Pipe', type: 'pipe' as const, parentNodeId: 'dp-g' },
  { id: 'vb-n', name: 'Valley of Bowser North Pipe', type: 'pipe' as const, parentNodeId: 'vb-w' },
  { id: 'vd-w', name: 'Vanilla Dome West Pipe', type: 'pipe' as const, parentNodeId: 'vd-b' },
  { id: 'vd-e', name: 'Vanilla Dome East Pipe', type: 'pipe' as const, parentNodeId: 'vd-b' },
  { id: 'ch-e', name: 'Chocolate Island East Pipe', type: 'pipe' as const, parentNodeId: 'ch-m' },
  { id: 'vb-s', name: 'Valley of Bowser Southwest Pipe', type: 'pipe' as const, parentNodeId: 'vb-e' },
  // Star exits
  { id: 'dp-s', name: 'Donut Plains Star', type: 'star' as const, parentNodeId: 'dp-g' },
  { id: 'vd-s', name: 'Vanilla Dome Star', type: 'star' as const, parentNodeId: 'vd-b' },
  { id: 'tb-s', name: 'Twin Bridges Star', type: 'star' as const, parentNodeId: 'tb-b' },
  { id: 'fi-t', name: 'Forest of Illusion Star', type: 'star' as const, parentNodeId: 'fi-o' },
  { id: 'vb-t', name: 'Valley of Bowser Star', type: 'star' as const },
  { id: 'sr-1', name: 'Star Road 1', type: 'star' as const },
  { id: 'sr-2', name: 'Star Road 2', type: 'star' as const },
  { id: 'sr-3', name: 'Star Road 3', type: 'star' as const },
  { id: 'sr-4', name: 'Star Road 4', type: 'star' as const },
  { id: 'sr-5', name: 'Star Road 5', type: 'star' as const },
  { id: 'sr-x', name: 'Star Road Center', type: 'star' as const, parentNodeId: 'sr-5' },
  { id: 'sz-e', name: 'Special Start End', type: 'star' as const, parentNodeId: 'sz-b' },
];

const smwEntrances = [
  // Transition entrances
  { id: 'yi-y', name: 'Yellow Switch Palace', type: 'transition' as const },
  { id: 'dp-o', name: 'Donut Plains South', type: 'transition' as const },
  { id: 'vd-b', name: 'Vanilla Dome Start', type: 'transition' as const },
  { id: 'fi-n', name: 'Forest of Illusion North', type: 'transition' as const },
  { id: 'fi-o', name: 'Forest of Illusion West', type: 'transition' as const },
  { id: 'ch-m', name: 'Chocolate Island Main Path', type: 'transition' as const },
  { id: 'vb-b', name: 'Valley of Bowser Entrance', type: 'transition' as const },
  // Pipe entrances
  { id: 'dp-e', name: 'Donut Plains East Pipe', type: 'pipe' as const },
  { id: 'vb-w', name: 'Valley of Bowser West Pipe', type: 'pipe' as const },
  { id: 'vb-e', name: 'Valley of Bowser Southeast Pipe', type: 'pipe' as const },
  { id: 'ch-p', name: 'Chocolate Island West Pipe', type: 'pipe' as const },
  { id: 'tb-n', name: 'Twin Bridges North', type: 'pipe' as const },
  { id: 'tb-b', name: 'Twin Bridges South', type: 'pipe' as const },
  // Star entrances
  { id: 'sr-1', name: 'Star Road 1', type: 'star' as const },
  { id: 'sr-2', name: 'Star Road 2', type: 'star' as const },
  { id: 'sr-3', name: 'Star Road 3', type: 'star' as const },
  { id: 'sr-4', name: 'Star Road 4', type: 'star' as const },
  { id: 'sr-5', name: 'Star Road 5', type: 'star' as const },
  { id: 'dp-s', name: 'Donut Plains Star', type: 'star' as const, isDrawable: false },
  { id: 'vd-s', name: 'Vanilla Dome Star', type: 'star' as const, isDrawable: false },
  { id: 'tb-s', name: 'Twin Bridges Star', type: 'star' as const, isDrawable: false },
  { id: 'fi-t', name: 'Forest of Illusion Star', type: 'star' as const, isDrawable: false },
  { id: 'vb-t', name: 'Valley of Bowser Star', type: 'star' as const },
  { id: 'sz-b', name: 'Special Zone Start', type: 'star' as const },
  { id: 'yi-s', name: `Yoshi's Island Start`, type: 'star' as const },
];

// Vanilla path definitions - shared across multiple option actions
const vanillaTransitionPaths = [
  { from: 'yi-s', to: 'yi-y' },
  { from: 'yi-s', to: 'dp-o' },
  { from: 'dp-o', to: 'vd-b' },
  { from: 'tb-e', to: 'fi-n' },
  { from: 'fi-n', to: 'fi-o' },
  { from: 'fi-n', to: 'ch-m' },
  { from: 'ch-m', to: 'vb-b' },
];

const vanillaPipePaths = [
  { from: 'dp-o', to: 'vb-w' },
  { from: 'vb-w', to: 'dp-e' },
  { from: 'vd-b', to: 'tb-n' },
  { from: 'vd-b', to: 'tb-b' },
  { from: 'ch-m', to: 'vb-e' },
  { from: 'vb-e', to: 'ch-p' },
];

const vanillaStarPaths = [
  { from: 'dp-o', to: 'sr-1' },
  { from: 'sr-1', to: 'dp-o' },
  { from: 'vd-b', to: 'sr-2' },
  { from: 'sr-2', to: 'vd-b' },
  { from: 'tb-b', to: 'sr-3' },
  { from: 'sr-3', to: 'tb-b' },
  { from: 'fi-o', to: 'sr-4' },
  { from: 'sr-4', to: 'fi-o' },
  { from: 'vb-t', to: 'sr-5' },
  { from: 'sr-5', to: 'vb-t' },
  { from: 'sr-5', to: 'sz-b' },
  { from: 'sz-b', to: 'yi-s' },
];

// Restrictions: each exit type can only connect to matching entrance types
const smwRestrictions: EntranceRestriction[] = [
  // Star exits can only go to star entrances (default)
  ...smwExits
    .filter(e => e.type === 'star')
    .map(exit => ({
      gameId: 'smw',
      exitId: exit.id,
      allowedEntranceIds: smwEntrances
        .filter(e => e.type === 'star')
        .map(e => e.id),
    })),
  // Pipe exits can only go to pipe entrances (default)
  ...smwExits
    .filter(e => e.type === 'pipe')
    .map(exit => ({
      gameId: 'smw',
      exitId: exit.id,
      allowedEntranceIds: smwEntrances
        .filter(e => e.type === 'pipe')
        .map(e => e.id),
    })),
  // Transition exits can only go to transition entrances
  ...smwExits
    .filter(e => e.type === 'transition')
    .map(exit => ({
      gameId: 'smw',
      exitId: exit.id,
      allowedEntranceIds: smwEntrances
        .filter(e => e.type === 'transition')
        .map(e => e.id),
    })),
  // When on_both_mix is selected: stars can go to stars or pipes
  ...smwExits
    .filter(e => e.type === 'star')
    .map(exit => ({
      gameId: 'smw',
      exitId: exit.id,
      condition: { optionId: 'map-teleport-shuffle', value: 'on_both_mix' as const },
      allowedEntranceIds: smwEntrances
        .filter(e => e.type === 'star' || e.type === 'pipe')
        .map(e => e.id),
    })),
  // When on_both_mix is selected: pipes can go to pipes or stars
  ...smwExits
    .filter(e => e.type === 'pipe')
    .map(exit => ({
      gameId: 'smw',
      exitId: exit.id,
      condition: { optionId: 'map-teleport-shuffle', value: 'on_both_mix' as const },
      allowedEntranceIds: smwEntrances
        .filter(e => e.type === 'pipe' || e.type === 'star')
        .map(e => e.id),
    })),
];

// Option actions: what to do when options change
const smwOptionActions: OptionAction[] = [
  {
    condition: { optionId: 'map-transition-shuffle', value: 'off' as const },
    action: {
      hideExits: ['yi-w', 'yi-e', 'dp-d', 'tb-f', 'fi-w', 'fi-s', 'ch-s'],
      addPaths: vanillaTransitionPaths,
    },
  },
  {
    condition: { optionId: 'map-teleport-shuffle', value: 'off' as const },
    action: {
      hideExits: ['dp-p', 'vb-n', 'vd-w', 'vd-e', 'ch-e', 'vb-s', 'dp-s', 'vd-s', 'tb-s', 'fi-t', 'vb-t', 'sr-1', 'sr-2', 'sr-3', 'sr-4', 'sr-5', 'sr-x', 'sz-e'],
      addPaths: [...vanillaPipePaths, ...vanillaStarPaths],
    },
  },
  {
    condition: { optionId: 'map-teleport-shuffle', value: 'on_only_pipes' as const },
    action: {
      hideExits: ['dp-s', 'vd-s', 'tb-s', 'fi-t', 'vb-t', 'sr-1', 'sr-2', 'sr-3', 'sr-4', 'sr-5', 'sr-x', 'sz-e'],
      addPaths: vanillaPipePaths,
    },
  },
  {
    condition: { optionId: 'map-teleport-shuffle', value: 'on_only_stars' as const },
    action: {
      hideExits: ['dp-p', 'vb-n', 'vd-w', 'vd-e', 'ch-e', 'vb-s'],
      addPaths: vanillaStarPaths,
    },
  },
  {
    condition: { optionId: 'map-teleport-shuffle', value: 'on_both_same_type' as const },
    action: {
      addPaths: [...vanillaPipePaths, ...vanillaStarPaths],
    },
  },
];

// Static connections: what should always exist?
const smwStaticConnections = `
  graph TD;
  linkStyle default stroke:#aaa,stroke-width:3px;
  __START__["Start"]
  yi-s["Yoshi's Island"];
  __START__-->yi-s
  style __START__ display:none,opacity:0;
  yi-y["YI Yellow Switch"];
  dp-o["Donut Plains"];
  dp-o-->dp-n["DP Northeast"];
  dp-e["DP East Pipe"]-->dp-n;
  dp-o-->dp-g["DP Ghost House"];
  %% dp-g-->dp-s["DP Star Warp"];
  %% dp-g-->dp-p["DP West Pipe"];
  vd-b["Vanilla Dome"];
  %% vd-b-->vd-s["VD Star Warp"];
  %% vd-b-->vd-w["VD North Pipe"];
  %% vd-b-->vd-e["VD South Pipe"];
  tb-n["Twin Bridges North"];
  tb-b["Twin Bridges South"];
  tb-e["Twin Bridges Exit"];
  tb-n-->tb-e;
  tb-b-->tb-e;
  %% tb-b-->tb-s["TB Star Warp"];
  fi-n["Forest of Illusion"];
  fi-o["To Forest Star"];
  %% fi-o-->fi-t["FI Star Warp"];
  ch-m["Chocolate Island"];
  %% ch-m-->ch-e["CI East Pipe"];
  ch-m-->ch-w["CI Ship"];
  ch-p["CI West Pipe"]-->ch-w;
  vb-w["VB Donut Cliff"];
  %% vb-w-->vb-n["VB 1st Secret End"];
  vb-e["VB Chocolate Cliff"];
  %% vb-e["VB 2nd Secret Start"]-->vb-s["VB 2nd Secret End"];
  vb-b["Valley of Bowser"];
  vb-b-->vb-z["VB Back Door"];
  vb-b-->vb-y["VB Front Door"];
  vb-z-->vb-end["Victory!"];
  vb-y-->vb-end;
  vb-b-->vb-t["VB Star Warp"];
  vb-t-->vb-y;
  sr-1["Star Road 1"];
  sr-2["Star Road 2"];
  sr-3["Star Road 3"];
  sr-4["Star Road 4"];
  sr-5["Star Road 5"];
  sr-1-->sr-2;
  sr-2-->sr-3;
  sr-3-->sr-4;
  sr-4-->sr-5;
  sr-5-->sr-1;
  %% sr-5-->sr-x["Star Road Center"];
  sz-b["Special Zone Start"];
  %% sz-b-->sz-e["Special Zone End"];
`

// Extract vanilla mappings from all the vanilla paths defined in option actions
const smwVanillaMap = Object.fromEntries([
  ...vanillaTransitionPaths,
  ...vanillaPipePaths,
  ...vanillaStarPaths,
].map(p => [p.from, p.to]));

export const smw: Game = {
  id: 'smw',
  name: 'Super Mario World',
  description: 'Classic Super Mario World entrance randomizer',
  startNodeId: '__START__',
  nodes: [],
  exits: smwExits,
  entrances: smwEntrances,
  restrictions: smwRestrictions,
  startUnselected: true,
  displayOrder: [
    'yi-w', 'yi-e', 'dp-s', 'dp-p', 'dp-d', 'vd-s', 'vd-w', 'vd-e',
    'tb-s', 'tb-f', 'fi-w', 'fi-s', 'fi-t', 'ch-e', 'ch-s', 'vb-t',
    'vb-n', 'vb-s', 'sr-1', 'sr-2', 'sr-3', 'sr-4', 'sr-5', 'sr-x', 'sz-e',
  ],
  vanillaExitToEntranceMap: smwVanillaMap,
  transitionPaths: [
    { from: 'yi-w', to: 'yi-y' },
    { from: 'yi-e', to: 'dp-o' },
    { from: 'dp-d', to: 'vd-b' },
    { from: 'tb-f', to: 'fi-n' },
    { from: 'fi-w', to: 'fi-o' },
    { from: 'fi-s', to: 'ch-m' },
    { from: 'ch-s', to: 'vb-b' },
  ],
  optionActions: smwOptionActions,
  staticConnections: smwStaticConnections,
  options: [
    {
      id: 'map-teleport-shuffle',
      name: 'Map Teleport Shuffle',
      description: 'Do the stars and pipes take you to different places?',
      defaultValue: 'on_both_mix',
      values: [
        { id: 'off', description: 'Vanilla pipes/stars.' },
        { id: 'on_only_stars', description: 'Stars shuffled, pipes not.' },
        { id: 'on_only_pipes', description: 'Pipes shuffled, stars not.' },
        { id: 'on_both_same_type', description: 'Pipes & stars shuffled, no pool mixing.' },
        { id: 'on_both_mix', description: 'Pipes & stars shuffled, mixed pool.' },
      ],
    },
    {
      id: 'map-transition-shuffle',
      name: 'Map Transition Shuffle',
      description: 'Do the overworld path connections take you to different places?',
      defaultValue: 'on',
      values: [
        { id: 'off', description: 'Vanilla Paths' },
        { id: 'on', description: 'Shuffled Paths' },
      ],
    },
  ],
  allowSwapOnDuplicate: true,
};
