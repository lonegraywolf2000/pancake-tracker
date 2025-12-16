import { lazy, Suspense, useCallback, useEffect, useRef, useState, type FC } from 'react'
import Fuse from 'fuse.js'
import './App.css';
import { gameManager } from './gameManager';
import { storage } from './storage';
import type { Game, GameSession } from './types';

const ModalMap = lazy(() => import('./ModalMap'));
const MermaidMap = lazy(() => import('./MermaidMap'));
const ModalNotepad = lazy(() => import('./ModalNotepad'));

type RenderGridRowProps = {
  idx: number;
  value: string;
  onDropdownChange: (index: number, newValue: string) => void;
  validEntrances: Array<{ id: string; name: string; parentNodeId?: string; tags?: string[] }>;
  exitName: string;
  startUnselected?: boolean;
  disabledOptions?: Set<string>;
  hideDisabledOptions?: boolean;
};

const RenderGridRow: FC<RenderGridRowProps> = ({ idx, value, onDropdownChange, validEntrances, exitName, startUnselected, disabledOptions, hideDisabledOptions }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelectChange = useCallback((selectedId: string) => {
    onDropdownChange(idx, selectedId);
    setShowDropdown(false);
    setSearchQuery('');
  }, [idx, onDropdownChange]);

  const handleClear = useCallback(() => {
    onDropdownChange(idx, '');
  }, [idx, onDropdownChange]);

  // Handle click-outside to close dropdown and clear search
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
        setSearchQuery('');
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showDropdown]);

  // Filter out disabled options if hideDisabledOptions is true
  let displayedEntrances = hideDisabledOptions && disabledOptions
    ? validEntrances.filter(entrance => !disabledOptions.has(entrance.id) || entrance.id === value)
    : validEntrances;

  // Apply fuzzy search if query exists
  let filteredEntrances = displayedEntrances;
  if (searchQuery.trim()) {
    const fuse = new Fuse(displayedEntrances, {
      keys: ['name', 'tags'],
      threshold: 0.3,
      isCaseSensitive: false,
      minMatchCharLength: 1,
    });
    filteredEntrances = fuse.search(searchQuery).map(result => result.item);
  }

  const selectedEntrance = validEntrances.find(e => e.id === value);

  return (
    <div className="dropdown-row" ref={dropdownRef}>
      <div className="exit-label">{exitName}</div>
      <div className='transition-selection'>
        <input
          type="text"
          placeholder="Search or click to open..."
          value={value && !searchQuery ? (selectedEntrance?.name || '') : searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          onClick={() => setShowDropdown(true)}
          className="dropdown-search"
          style={{
            width: '100%',
            padding: '0.4rem 0.5rem',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '0.95rem',
            boxSizing: 'border-box',
          }}
        />
        {showDropdown && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: 'white',
              border: '1px solid #ccc',
              borderTop: 'none',
              borderRadius: '0 0 4px 4px',
              maxHeight: '250px',
              overflowY: 'auto',
              zIndex: 1000,
              marginTop: '-1px',
            }}
          >
            {startUnselected && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectChange('');
                }}
                style={{
                  padding: '0.5rem 0.75rem',
                  cursor: 'pointer',
                  backgroundColor: value === '' ? '#e0e0e0' : 'white',
                  borderBottom: '1px solid #f0f0f0',
                  color: '#000',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f5f5f5';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = value === '' ? '#e0e0e0' : 'white';
                }}
              >
                Select
              </div>
            )}
            {filteredEntrances.length === 0 ? (
              <div style={{ padding: '0.5rem', color: '#999', textAlign: 'center' }}>No matches</div>
            ) : (
              filteredEntrances.map(entrance => {
                const optionValue = entrance.id;
                const isDisabled = disabledOptions?.has(optionValue) && value !== optionValue;
                return (
                  <div
                    key={optionValue}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isDisabled) {
                        handleSelectChange(optionValue);
                      }
                    }}
                    style={{
                      padding: '0.5rem 0.75rem',
                      cursor: isDisabled ? 'not-allowed' : 'pointer',
                      backgroundColor: optionValue === value ? '#e0e0e0' : 'white',
                      opacity: isDisabled ? 0.5 : 1,
                      borderBottom: '1px solid #f0f0f0',
                      color: '#000',
                    }}
                    onMouseEnter={(e) => {
                      if (!isDisabled) e.currentTarget.style.backgroundColor = '#f5f5f5';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = optionValue === value ? '#e0e0e0' : 'white';
                    }}
                  >
                    {entrance.name}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
      <button
        onClick={handleClear}
        title="Clear this selection"
        className="clear-button"
      >
        ✕
      </button>
    </div>
  );
};

type GameOptionsProps = {
  game: Game;
  session: GameSession;
  onOptionChange: (optionId: string, value: string | number) => void;
};

const GameOptions: FC<GameOptionsProps> = ({ game, session, onOptionChange }) => {
  return (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
      {game.options.map(option => (
        <div key={option.id}>
          <label htmlFor={`option-${option.id}`}>{option.name}: </label>
          <select
            id={`option-${option.id}`}
            value={session.selectedOptions[option.id] ?? option.values[0].id}
            onChange={(e) => onOptionChange(option.id, e.target.value)}
          >
            {option.values.map(val => (
              <option key={val.id} value={val.id}>
                {val.description}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
};

function App() {
  const appState = storage.getState();
  const [currentGameId, setCurrentGameId] = useState<string>(appState.currentGameId);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(appState.currentSessionId);
  const [, forceUpdate] = useState({});
  const [isNotepadOpen, setIsNotepadOpen] = useState(false);

  const game = gameManager.getGame(currentGameId);
  if (!game) return <div>Game not found</div>;

  let session: GameSession | undefined;

  if (currentSessionId) {
    session = storage.getSession(currentSessionId);
  }

  if (!session) {
    // Create a new session if none exists
    session = gameManager.createSession(currentGameId, `${game.name} Session`);
    setCurrentSessionId(session.id);
    storage.setCurrentSession(session.id);
  }

  const exits = gameManager.getOrderedExits(currentGameId);

  const [selected, setSelected] = useState<Record<string, string>>(session.exitToEntranceMap);
  const [isOpen, setIsOpen] = useState(false);

  const handleGameChange = useCallback((gameId: string) => {
    setCurrentGameId(gameId);
    storage.setCurrentGame(gameId);
    setCurrentSessionId(null);
  }, []);

  const handleSessionChange = useCallback((sessionId: string) => {
    setCurrentSessionId(sessionId);
    storage.setCurrentSession(sessionId);
  }, []);

  const handleCreateNewSession = useCallback(() => {
    const newSession = gameManager.createSession(currentGameId, `${game.name} Session ${Date.now()}`);
    setCurrentSessionId(newSession.id);
    storage.setCurrentSession(newSession.id);
    setSelected(newSession.exitToEntranceMap);
  }, [currentGameId, game.name]);

  const handleOptionChange = useCallback((optionId: string, value: string | number) => {
    gameManager.setOption(session!, optionId, String(value));
    forceUpdate({});
  }, [session]);

  const handleDropdownChange = useCallback((idx: number, newValue: string) => {
    const exitId = exits[idx].id;
    // Use gameManager to handle the mapping, which includes bidirectional pairing logic
    gameManager.setExitMapping(session!, exitId, newValue);
    setSelected({ ...session!.exitToEntranceMap });
  }, [exits, session]);

  const handleReset = () => {
    gameManager.resetSession(session!);
    setSelected({ ...session!.exitToEntranceMap });
  };

  const dynamicLinks = gameManager.generateDynamicLinks(session!, exits);

  // Get visible exits and option-based paths from gameManager
  const visibleExitIds = gameManager.getVisibleExits(session!);
  const optionPaths = gameManager.getOptionPaths(session!);

  const optionPathsStr = optionPaths.length > 0
    ? '\n' + optionPaths.map(path => `${path.from}-->${path.to};`).join('\n')
    : '';

  const mermaidCode = game.staticConnections + dynamicLinks + optionPathsStr;

  const games = gameManager.getAllGames();
  const sessions = storage.getSessionsByGame(currentGameId);

  // Filter exits to show only visible ones
  const displayedExits = exits.filter(exit => visibleExitIds.includes(exit.id));
  
  // Check if map should be displayed based on game setting and user option
  let shouldShowMap = game.showMap !== false; // defaults to true
  
  // Check if any option action overrides map visibility
  if (game.optionActions) {
    for (const optionAction of game.optionActions) {
      const optionValue = session!.selectedOptions[optionAction.condition.optionId];
      if (optionValue === optionAction.condition.value && optionAction.action.showMap !== undefined) {
        shouldShowMap = optionAction.action.showMap;
        break;
      }
    }
  }
  
  // Also check for show-map user option override
  const showMapByOption = session!.selectedOptions['show-map'] !== 'off'; // defaults to on
  shouldShowMap = shouldShowMap && showMapByOption;

  return <>
    <nav>
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="game-select">Game: </label>
        <select
          id="game-select"
          value={currentGameId}
          onChange={(e) => handleGameChange(e.target.value)}
        >
          {games.map(g => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="session-select">Session: </label>
        <select
          id="session-select"
          value={currentSessionId || ''}
          onChange={(e) => {
            if (e.target.value) {
              handleSessionChange(e.target.value);
            }
          }}
        >
          <option value="">-- Create New --</option>
          {sessions.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
        {currentSessionId === null && sessions.length > 0 && (
          <button onClick={handleCreateNewSession} style={{ marginLeft: '0.5rem' }}>New Session</button>
        )}
      </div>

      <div>
        <button onClick={() => handleReset()}>Reset Connections</button>
        <button onClick={() => setIsOpen(true)} style={{ marginLeft: '0.5rem' }}>Full Size Map</button>
        <button onClick={() => setIsNotepadOpen(true)} style={{ marginLeft: '0.5rem' }}>Notes</button>
        <div style={{ marginLeft: '2rem', display: 'inline-block' }}>
          <GameOptions game={game} session={session!} onOptionChange={handleOptionChange} />
        </div>
      </div>

      {isOpen && <ModalMap
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        mermaidCode={mermaidCode}
      />}
      {isNotepadOpen && <Suspense fallback={<div>Loading notepad...</div>}>
        <ModalNotepad
          isOpen={isNotepadOpen}
          onClose={() => setIsNotepadOpen(false)}
          gameId={currentGameId}
          sessionId={currentSessionId}
        />
      </Suspense>}
    </nav>
    <article className={`body-grid${shouldShowMap ? '' : ' no-map'}`}>
      <section className='dropdown-grid'>
        {(() => {
          // Group exits by UI group while preserving order of first appearance
          const grouped = new Map<string, typeof displayedExits>();
          const groupOrder: string[] = []; // Track order of first appearance
          
          displayedExits.forEach(exit => {
            const groupKey = exit.uiGroup || 'All Exits'; // Default to "All Exits" if no group
            if (!grouped.has(groupKey)) {
              grouped.set(groupKey, []);
              groupOrder.push(groupKey); // Record order of first appearance
            }
            grouped.get(groupKey)!.push(exit);
          });

          // Render grouped exits with headings in order of first appearance
          const renderedGroups: React.ReactNode[] = [];

          groupOrder.forEach((groupName) => {
            const exitsInGroup = grouped.get(groupName)!;
            const renderedExits = exitsInGroup.map((exit) => {
              const validExitIds = gameManager
                .getValidEntrancesForExit(currentGameId, exit.id, session!.selectedOptions);
              
              // Convert exit IDs to entrance display options
              const validEntrances = validExitIds.flatMap(exitId => 
                gameManager.getEntrancesForNode(currentGameId, exitId)
              );

              // Build disabled options set only if game doesn't allow swap on duplicate
              let disabledOptions: Set<string> | undefined;
              if (!game.allowSwapOnDuplicate) {
                // Get all selected values except the current one
                const selectedValues = Object.entries(selected)
                  .filter(([selectedExitId]) => selectedExitId !== exit.id)
                  .map(([, value]) => value)
                  .filter(value => value); // exclude empty strings
                disabledOptions = new Set(selectedValues);
              }

              const overallIdx = exits.findIndex(e => e.id === exit.id);

              return (
                <RenderGridRow
                  key={exit.id}
                  idx={overallIdx}
                  value={selected[exit.id] || ''}
                  onDropdownChange={handleDropdownChange}
                  validEntrances={validEntrances}
                  exitName={exit.name}
                  startUnselected={game.startUnselected}
                  disabledOptions={disabledOptions}
                  hideDisabledOptions={game.hideDisabledOptions}
                />
              );
            });

            renderedGroups.push(
              <div key={`group-${groupName}`}>
                <h3>{groupName}</h3>
                {renderedExits}
              </div>
            );
          });

          return renderedGroups;
        })()}
      </section>
      {shouldShowMap &&
      <section className="mermaid-container">
        <Suspense fallback={<div>Loading map...</div>}>
          <MermaidMap mermaidCode={mermaidCode} />
        </Suspense>
      </section>}
    </article>
  </>;
}

export default App;
