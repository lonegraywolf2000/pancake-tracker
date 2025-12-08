import type { MermaidConfig } from 'mermaid';
import { lazy, Suspense, type FC } from 'react';

const RenderMermaid = lazy(() => import('react-x-mermaid'));

export type MermaidMapProps = {
  mermaidCode: string;
  config?: MermaidConfig;
};

// Default config for inline MermaidMap (larger text for legibility)
const fallbackConfig: MermaidConfig = {
  theme: 'dark',
  themeVariables: {
    fontSize: '36px',
    lineColor: '#aaa',
    tertiaryTextColor: '#fff',
  },
  flowchart: {
    useMaxWidth: true,
    htmlLabels: true,
    nodeSpacing: 100,
    rankSpacing: 100,
  },
};

const MermaidMap: FC<MermaidMapProps> = ({ mermaidCode, config }) => {
  return (
    <Suspense fallback={<div>Loading map...</div>}>
      <RenderMermaid mermaidCode={mermaidCode} mermaidConfig={config ?? fallbackConfig} />
    </Suspense>
  );
};

export default MermaidMap;
