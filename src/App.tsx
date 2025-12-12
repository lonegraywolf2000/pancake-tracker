import { lazy, Suspense, useCallback, useState, type FC } from 'react'
import './App.css';
import { gameManager } from './gameManager';
import { storage } from './storage';
import type { Game, GameSession } from './types';

const ModalMap = lazy(() => import('./ModalMap'));
const MermaidMap = lazy(() => import('./MermaidMap'));

type RenderGridRowProps = {
  idx: number;
  value: string;
  onDropdownChange: (index: number, newValue: string) => void;
  validEntrances: Array<{ id: string; name: string; parentNodeId?: string }>;
  exitName: string;
  startUnselected?: boolean;
  disabledOptions?: Set<string>;
};

const RenderGridRow: FC<RenderGridRowProps> = ({ idx, value, onDropdownChange, validEntrances, exitName, startUnselected, disabledOptions }) => {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    onDropdownChange(idx, e.target.value);
  }, [idx, onDropdownChange]);

  const handleClear = useCallback(() => {
    onDropdownChange(idx, '');
  }, [idx, onDropdownChange]);

  return (
    <div className="dropdown-row">
      <div className="exit-label">{exitName}</div>
      <select
        id={`drop-${idx}`}
        data-idx={idx}
        value={value}
        onChange={handleChange}
        className="dropdown-select"
      >
        {startUnselected && <option value="">Select</option>}
        {validEntrances.map(entrance => {
          // Use exit ID as the option value (the specific destination exit)
          const optionValue = entrance.id;
          const isDisabled = disabledOptions?.has(optionValue) && value !== optionValue;
          return (
            <option key={optionValue} value={optionValue} disabled={isDisabled}>{entrance.name}</option>
          );
        })}
      </select>
      <button
        onClick={handleClear}
        title="Clear this selection"
        className="clear-button"
        style={{ marginLeft: '0.5rem', padding: '0.25rem 0.75rem' }}
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
        <div style={{ marginLeft: '2rem', display: 'inline-block' }}>
          <GameOptions game={game} session={session!} onOptionChange={handleOptionChange} />
        </div>
      </div>

      {isOpen && <ModalMap
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        mermaidCode={mermaidCode}
      />}
    </nav>
    <article className={`body-grid${shouldShowMap ? '' : ' no-map'}`}>
      <section className='dropdown-grid'>
        {displayedExits.map((exit, idx) => {
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

          return (
            <RenderGridRow
              key={exit.id}
              idx={idx}
              value={selected[exit.id] || ''}
              onDropdownChange={handleDropdownChange}
              validEntrances={validEntrances}
              exitName={exit.name}
              startUnselected={game.startUnselected}
              disabledOptions={disabledOptions}
            />
          );
        })}
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
