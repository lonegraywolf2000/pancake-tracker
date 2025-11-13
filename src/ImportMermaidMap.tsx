import type { MermaidConfig } from 'mermaid';
import { useState, useEffect, type ComponentType, type FC } from 'react';

export type MermaidMapProps = {
  mermaidCode: string;
  config?: MermaidConfig;
};

const fallbackConfig: MermaidConfig = {
  theme: 'dark',
  // maxTextSize: 60,
  themeVariables: {
    fontSize: '18px'
  }
};

const MermaidMap: FC<MermaidMapProps> = (props) => {
  const [RenderMermaid, setRenderMermaid] = useState<ComponentType<MermaidMapProps> | null>(null);

  useEffect(() => {
    import('react-x-mermaid').then(mod => {
      setRenderMermaid(() => mod.default);
    });
  }, []);

  if (!RenderMermaid) return <div>Loading map...</div>;
  return <RenderMermaid mermaidCode={props.mermaidCode} config={props.config ?? fallbackConfig} />;
};

export default MermaidMap;
