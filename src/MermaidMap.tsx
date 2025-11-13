import type { MermaidConfig } from 'mermaid';
import { lazy, Suspense, type FC } from 'react';

const RenderMermaid = lazy(() => import('react-x-mermaid'));

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

const MermaidMap: FC<MermaidMapProps> = ({ mermaidCode, config }) => {
  return (
    <Suspense fallback={<div>Loading map...</div>}>
      <RenderMermaid mermaidCode={mermaidCode} mermaidConfig={config ?? fallbackConfig} />
    </Suspense>
  );
};

export default MermaidMap;
