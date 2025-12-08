import { Suspense } from 'react';
import Modal from 'react-modal';
import MermaidMap from './MermaidMap';
import type { MermaidConfig } from 'mermaid';

type ModalMapProps = {
  isOpen: boolean;
  onRequestClose: () => void;
  mermaidCode: string;
  config?: any;
  styles?: any;
};

const fallbackStyles: Modal.Styles = {
  content: {
    color: 'black',
  }
};

const fallbackConfig: MermaidConfig = {
  theme: 'dark',
  themeVariables: {
    fontSize: '18px',
    nodePadding: 25,
  },
  flowchart: {
    useMaxWidth: true,
    htmlLabels: true,
  },
};

Modal.setAppElement('#root');

const ModalMap = ({
  isOpen,
  onRequestClose,
  mermaidCode,
  config,
  styles,
}: ModalMapProps) => (
  <Modal
    isOpen={isOpen}
    onRequestClose={onRequestClose}
    contentLabel="Entrance Map"
    style={styles ?? fallbackStyles}
  >
    Scroll down as necessary to see the entire thing!
    <button onClick={onRequestClose}>Close</button>
    <Suspense fallback={<div>Loading map...</div>}>
      <MermaidMap mermaidCode={mermaidCode} config={config ?? fallbackConfig} />
    </Suspense>
  </Modal>
);

export default ModalMap;