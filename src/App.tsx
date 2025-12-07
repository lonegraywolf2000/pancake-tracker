import { lazy, Suspense, useCallback, useState, type FC } from 'react'
import './App.css';
import { gameManager } from './gameManager';
import { storage } from './storage';
import type { Game, GameSession } from './types';

const ModalMap = lazy(() => import('./ModalMap'));
const MermaidMap = lazy(() => import('./MermaidMap'));

type Exit = {
  id: string;
  name: string;
};

type RenderGridRowProps = {
  idx: number;
  value: string;
  onDropdownChange: (index: number, newValue: string) => void;
  validEntrances: Exit[];
  exitName: string;
};

const RenderGridRow: FC<RenderGridRowProps> = ({ idx, value, onDropdownChange, validEntrances, exitName }) => {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    onDropdownChange(idx, e.target.value);
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
        {validEntrances.map(entrance => (
          <option key={entrance.id} value={entrance.id}>{entrance.name}</option>
        ))}
      </select>
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
  const entrances = game.entrances;

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
    setSelected(prev => {
      const exitId = exits[idx].id;
      const currentMapping = { ...prev };
      const currentEntranceForExit = currentMapping[exitId];

      if (currentEntranceForExit === newValue) return prev;

      // Find if another exit already maps to this entrance
      const swapExitId = Object.keys(currentMapping).find(key => currentMapping[key] === newValue);

      if (swapExitId && swapExitId !== exitId) {
        // Swap them
        currentMapping[exitId] = newValue;
        currentMapping[swapExitId] = currentEntranceForExit;
      } else {
        // Just set the new mapping
        currentMapping[exitId] = newValue;
      }

      // Update the session
      session!.exitToEntranceMap = currentMapping;
      storage.updateSession(session!);

      return currentMapping;
    });
  }, [exits, session]);

  const handleReset = () => {
    gameManager.resetSession(session!);
    setSelected({ ...session!.exitToEntranceMap });
  };

  const dynamicLinks = gameManager.generateDynamicLinks(session!, exits, entrances);

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
    <article className='body-grid'>
      <section className='dropdown-grid'>
        {displayedExits.map((exit, idx) => {
          const validEntrances = gameManager
            .getValidEntrancesForExit(currentGameId, exit.id, session!.selectedOptions)
            .map(entranceId => entrances.find(e => e.id === entranceId))
            .filter((e): e is Exit => e !== undefined);

          return (
            <RenderGridRow
              key={exit.id}
              idx={idx}
              value={selected[exit.id] || ''}
              onDropdownChange={handleDropdownChange}
              validEntrances={validEntrances}
              exitName={exit.name}
            />
          );
        })}
      </section>
      {!isOpen &&
      <section className="mermaid-container">
        <Suspense fallback={<div>Loading map...</div>}>
          <MermaidMap mermaidCode={mermaidCode} />
        </Suspense>
      </section>}
    </article>
  </>;
}

export default App;
