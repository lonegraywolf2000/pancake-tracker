import { useEffect, useRef, type FC } from 'react';
import mermaid, { type MermaidConfig } from 'mermaid';


// Define the props interface for the Mermaid component
export interface MermaidProps {
  code: string; // The Mermaid diagram code
  config?: MermaidConfig; // Optional Mermaid configuration
}

// Helper to generate unique IDs for multiple diagrams on a page
let idCounter = 0;
function generateUniqueId(): string {
  return `mermaid-react-${idCounter++}`;
}

const MermaidDiagram: FC<MermaidProps> = ({ code, config }) => {
  const idRef = useRef(generateUniqueId()); // Unique ID for the diagram
  const containerRef = useRef<HTMLDivElement>(null); // Ref for the container div

  useEffect(() => {
    let active = true; // Flag to prevent updates after component unmounts

    // Initialize Mermaid with optional configuration
    mermaid.initialize({
      startOnLoad: false, // Important for manual rendering
      ...config,
    });

    // Render the Mermaid diagram
    mermaid
      .render(idRef.current, code)
      .then(({ svg }) => {
        if (active && containerRef.current) {
          containerRef.current.innerHTML = svg; // Inject the SVG into the container
        }
      })
      .catch((err) => {
        if (active && containerRef.current) {
          // Display error message if rendering fails
          containerRef.current.innerHTML = `<pre>Mermaid render error:\n${String(err)}</pre>`;
          console.error('Mermaid render error:', err);
        }
      });

    // Cleanup function to set active to false on unmount
    return () => {
      active = false;
    };
  }, [code, config]); // Re-run effect if code or config changes

  return <div ref={containerRef} />; // Render a div that will contain the SVG
}

export default MermaidDiagram;
