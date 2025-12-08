import { useEffect } from 'react';

interface MermaidGraphDemoProps {
  title: string;
  code: string;
}

const MermaidGraphDemo = ({ title, code }: MermaidGraphDemoProps) => {
  useEffect(() => {
    // This would render if you had mermaid imported
    console.log(`${title}:\n${code}`);
  }, [title, code]);

  return (
    <div style={{ marginBottom: '2rem', border: '1px solid #ccc', padding: '1rem' }}>
      <h3>{title}</h3>
      <pre style={{ backgroundColor: '#f5f5f5', overflow: 'auto', maxHeight: '300px' }}>
        {code}
      </pre>
    </div>
  );
};

export const GraphApproachComparison = () => {
  const nodeBasedExample = `
  graph TD;
  yi-s["Yoshi's Island"];
  yi-s-->yi-w["YI NW Exit"];
  yi-s-->yi-e["YI NE Exit"];
  yi-y["YI Yellow Switch"];
  dp-o["Donut Plains"];
  `;

  const edgeLabeledExample = `
  graph TD;
  yi-s["Yoshi's Island"];
  yi-s-->|YI NW Exit|yi-y["YI Yellow Switch"];
  yi-s-->|YI NE Exit|dp-o["Donut Plains"];
  `;

  const hybridExample = `
  graph TD;
  yi-s["Yoshi's Island"];
  yi-s-->|West Exit|yi-y["YI Yellow Switch"];
  yi-s-->|East Exit|dp-o["Donut Plains"];
  
  dp-o["Donut Plains"];
  dp-o-->dp-s["DP Star Warp"];
  dp-o-->dp-p["DP West Pipe"];
  `;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Graph Approach Comparison</h2>
      
      <MermaidGraphDemo 
        title="1. NODE-BASED (Current)" 
        code={nodeBasedExample} 
      />
      
      <MermaidGraphDemo 
        title="2. EDGE-LABELED (New)" 
        code={edgeLabeledExample} 
      />
      
      <MermaidGraphDemo 
        title="3. HYBRID (Mix Both)" 
        code={hybridExample} 
      />

      <div style={{ backgroundColor: '#f0f8ff', padding: '1rem', borderRadius: '4px' }}>
        <h3>Recommendation for Your Use Case</h3>
        <p><strong>HYBRID approach</strong> would be ideal for SMW:</p>
        <ul>
          <li><strong>Transition exits</strong> → Use edge labels (cleaner)</li>
          <li><strong>Pipe/Star exits</strong> → Keep as nodes (clearer for dropdowns)</li>
        </ul>
        <p>This lets you have a cleaner graph for simple transitions while keeping complexity for the exit-to-entrance mappings.</p>
      </div>
    </div>
  );
};

export default GraphApproachComparison;
