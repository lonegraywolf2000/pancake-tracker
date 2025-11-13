import { lazy, Suspense, useCallback, useState, type FC } from 'react'
import './App.css';

const ModalMap = lazy(() => import('./ModalMap'));
const MermaidMap = lazy(() => import('./MermaidMap'));

type Exit = {
  id: string;
  name: string;
};

const exits: Exit[] = [
  { id: 'yi-w', name: `Yoshi's Island West` },
  { id: 'yi-e', name: `Yoshi's Island East` },
  { id: 'dp-s', name: 'Donut Plains Star' },
  { id: 'dp-p', name: 'Donut Plains Pipe' },
  { id: 'dp-d', name: 'Donut Plains Door' },
  { id: 'vd-s', name: 'Vanilla Dome Star' },
  { id: 'vd-w', name: 'Vanilla Dome West Pipe' },
  { id: 'vd-e', name: 'Vanilla Dome East Pipe' },
  { id: 'tb-s', name: 'Twin Bridges Star', },
  { id: 'tb-f', name: 'Twin Bridges Forest' },
  { id: 'fi-w', name: 'Forest of Illusion West', },
  { id: 'fi-s', name: 'Forest of Illusion South' },
  { id: 'fi-t', name: 'Forest of Illusion Star' },
  { id: 'ch-e', name: 'Chocolate Island East Pipe' },
  { id: 'ch-s', name: 'Chocolate Island Ship' },
  { id: 'vb-t', name: 'Valley of Bowser Star' },
  { id: 'vb-n', name: 'Valley of Bowser North Pipe' },
  { id: 'vb-s', name: 'Valley of Bowser Southwest Pipe' },
  { id: 'sr-1', name: 'Star Road 1'},
  { id: 'sr-2', name: 'Star Road 2'},
  { id: 'sr-3', name: 'Star Road 3'},
  { id: 'sr-4', name: 'Star Road 4'},
  { id: 'sr-5', name: 'Star Road 5'},
  { id: 'sr-x', name: 'Star Road Center'},
  { id: 'sz-e', name: 'Special Start End' },
];

const entrances: Exit[] = [
  { id: 'yi-y', name: 'Yellow Switch Palace' },
  { id: 'dp-o', name: 'Donut Plains South' },
  { id: 'sr-1', name: 'Star Road 1'},
  { id: 'vb-w', name: 'Valley of Bowser West Pipe' },
  { id: 'vd-b', name: 'Vanilla Dome Start' },
  { id: 'sr-2', name: 'Star Road 2'},
  { id: 'tb-n', name: 'Twin Bridges North' },
  { id: 'tb-b', name: 'Twin Bridges South' },
  { id: 'sr-3', name: 'Star Road 3'},
  { id: 'fi-n', name: 'Forest of Illusion North' },
  { id: 'fi-o', name: 'Forest of Illusion Star Path' },
  { id: 'ch-m', name: 'Chocolate Island Main Path' },
  { id: 'sr-4', name: 'Star Road 4'},
  { id: 'vb-e', name: 'Valley of Bowser Southeast Pipe' },
  { id: 'vb-b', name: 'Valley of Bowser Entrance', },
  { id: 'sr-5', name: 'Star Road 5'},
  { id: 'dp-e', name: 'Donut Plains East' },
  { id: 'ch-p', name: 'Chocolate Island West Pipe' },
  { id: 'dp-s', name: 'Donut Plains Star' },
  { id: 'vd-s', name: 'Vanilla Dome Star' },
  { id: 'tb-s', name: 'Twin Bridges Star' },
  { id: 'fi-t', name: 'Forest of Illusion Star'},
  { id: 'vb-s', name: 'Valley of Bowser Star' },
  { id: 'sz-b', name: 'Special Zone Start' },
  { id: 'yi-s', name: `Yoshi's Island Start` },
];

type OptionProps = {
  options: Exit[]
}

const Options: FC<OptionProps> = ({ options }) => (
  <>
    {options.map(opt => (
      <option key={opt.id} value={opt.id}>{opt.name}</option>
    ))}
  </>
);

type RenderGridRowProps = {
  idx: number;
  value: string;
  onDropdownChange: (index: number, newValue: string) => void;
};

const RenderGridRow: FC<RenderGridRowProps> = ({ idx, value, onDropdownChange }) => {
  const exit = exits[idx];
  const handleChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    onDropdownChange(idx, e.target.value);
  }, [idx, onDropdownChange]);

  return (
    <div className="dropdown-row">
      <div className="exit-label">{exit.name}</div>
      <select
        id={`drop-${exit.id}`}
        data-idx={idx}
        value={value}
        onChange={handleChange}
        className="dropdown-select"
      >
        <Options options={entrances} />
      </select>
    </div>
  );
};

const initialSelected = exits.reduce((acc, exit, idx) => {
  acc[exit.id] = entrances[idx]?.id || '';
  return acc;
}, {} as Record<string, string>);

function App() {
  const [selected, setSelected] = useState<Record<string, string>>(initialSelected);
  const [isOpen, setIsOpen] = useState(false);

  const handleDropdownChange = useCallback((idx: number, newValue: string) => {
    setSelected(prev => {
      const exitId = exits[idx].id;
      const swapExitId = Object.keys(prev).find(key => prev[key] === newValue);
      if (!swapExitId || swapExitId === exitId) {
        if (prev[exitId] === newValue) return prev;
        return { ...prev, [exitId]: newValue };
      }
      return {
        ...prev,
        [exitId]: newValue,
        [swapExitId]: prev[exitId],
      };
    });
  }, []);

  const handleReset = () => setSelected(initialSelected);

  const initialNodes = `
  graph TD;
  yi-s["Yoshi's Island"];
  yi-s-->yi-w["YI NW Exit"];
  yi-s-->yi-e["YI NE Exit"];
  yi-y["YI Yellow Switch"];
  dp-o["Donut Plains"];
  dp-o-->dp-s["DP Star Warp"];
  dp-o-->dp-p["DP West Pipe"];
  dp-o-->dp-d["DP Door"];
  dp-e["DP East Pipe"]-->dp-d;
  vd-b["Vanilla Dome"];
  vd-b-->vd-s["VD Star Warp"];
  vd-b-->vd-w["VD North Pipe"];
  vd-b-->vd-e["VD South Pipe"];
  tb-n["Twin Bridges North"];
  tb-b["Twin Bridges South"];
  tb-f["TB To the Forest"];
  tb-n-->tb-f;
  tb-b-->tb-f;
  tb-b-->tb-s["TB Star Warp"];
  fi-n["Forest of Illusion"];
  fi-n-->fi-w["FI West Exit"];
  fi-n-->fi-s["FI South Exit"];
  fi-o["To Forest Star"]-->fi-t["FI Star Warp"];
  ch-m["Chocolate Island"];
  ch-m-->ch-e["CI East Pipe"];
  ch-m-->ch-s["CI Sunken Ship"];
  ch-p["CI West Pipe"]-->ch-s;
  vb-w["VB 1st Secret Start"]-->vb-n["VB 1st Secret End"];
  vb-e["VB 2nd Secret Start"]-->vb-s["VB 2nd Secret End"];
  vb-b["Valley of Bowser"];
  vb-b-->vb-z["VB Back Door"];
  vb-b-->vb-y["VB Front Door"];
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
  sr-5-->sr-x["Star Road Center"];
  sz-b["Special Zone Start"]-->sz-e["Special Zone End"];
`;

  const dynamicLinks = exits.map(exit => {
    const entranceId = selected[exit.id];
    return `${exit.id}-->${entranceId};`
  }).join('\n');

  const mermaidCode = initialNodes + dynamicLinks;

  return <>
    <nav>
      <button onClick={() => handleReset()}>Reset Connections</button>
      <button onClick={() => setIsOpen(true)}>Full Size Map</button>
      {isOpen && <ModalMap
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        mermaidCode={mermaidCode}
      />}
    </nav>
    <article className='body-grid'>
      <section className='dropdown-grid'>
        {exits.map((exit, idx) => (
          <RenderGridRow
            key={exit.id}
            idx={idx}
            value={selected[exit.id]}
            onDropdownChange={handleDropdownChange}
          />
        ))}
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
