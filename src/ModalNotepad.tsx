import { useEffect, useRef, useState } from 'react';
import './ModalNotepad.css';
import { storage } from './storage';

type ModalNotepadProps = {
  isOpen: boolean;
  onClose: () => void;
  gameId: string;
  sessionId: string | null;
};

type DragState = {
  isDragging: boolean;
  offsetX: number;
  offsetY: number;
};

export default function ModalNotepad({ isOpen, onClose, gameId, sessionId }: ModalNotepadProps) {
  const [content, setContent] = useState('');
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [size, setSize] = useState({ width: 400, height: 300 });
  const [dragState, setDragState] = useState<DragState>({ isDragging: false, offsetX: 0, offsetY: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const debounceTimerRef = useRef<number | null>(null);

  const notepadKey = sessionId ? `${gameId}-${sessionId}` : gameId;

  // Load notepad data on mount or when gameId/sessionId changes
  useEffect(() => {
    if (isOpen) {
      const savedData = storage.getNotepadData(notepadKey);
      if (savedData) {
        setContent(savedData.content || '');
        setPosition(savedData.position || { x: 100, y: 100 });
        setSize(savedData.size || { width: 400, height: 300 });
      }
    }
  }, [isOpen, notepadKey]);

  // Debounced save to storage
  const saveToStorage = (newContent: string, newPosition?: typeof position, newSize?: typeof size) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      storage.setNotepadData(notepadKey, {
        content: newContent,
        position: newPosition || position,
        size: newSize || size,
      });
    }, 1000); // Save 1 second after user stops typing/moving
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    saveToStorage(newContent);
  };

  const handleMouseDownHeader = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setDragState({
        isDragging: true,
        offsetX: e.clientX - rect.left,
        offsetY: e.clientY - rect.top,
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (dragState.isDragging) {
      const newX = e.clientX - dragState.offsetX;
      const newY = e.clientY - dragState.offsetY;
      setPosition({ x: newX, y: newY });
    }

    if (isResizing && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const newWidth = Math.max(200, e.clientX - rect.left);
      const newHeight = Math.max(150, e.clientY - rect.top);
      setSize({ width: newWidth, height: newHeight });
    }
  };

  const handleMouseUpHeader = () => {
    if (dragState.isDragging) {
      setDragState({ isDragging: false, offsetX: 0, offsetY: 0 });
      saveToStorage(content, position);
    }
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const handleResizeEnd = () => {
    setIsResizing(false);
    saveToStorage(content, position, size);
  };

  useEffect(() => {
    if (dragState.isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', dragState.isDragging ? handleMouseUpHeader : handleResizeEnd);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', dragState.isDragging ? handleMouseUpHeader : handleResizeEnd);
      };
    }
  }, [dragState.isDragging, isResizing, dragState.offsetX, dragState.offsetY, position, size, content]);

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      className="modal-notepad"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
      }}
    >
      <div
        ref={headerRef}
        className="modal-notepad-header"
        onMouseDown={handleMouseDownHeader}
      >
        <h3>Notes</h3>
        <button
          className="modal-notepad-close"
          onClick={onClose}
          title="Close notepad"
        >
          ✕
        </button>
      </div>
      <textarea
        ref={textareaRef}
        className="modal-notepad-textarea"
        value={content}
        onChange={handleContentChange}
        placeholder="Type your notes here..."
      />
      <div
        className="modal-notepad-resize"
        onMouseDown={handleResizeStart}
        title="Drag to resize"
      />
    </div>
  );
}
