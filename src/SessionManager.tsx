import { useState, useCallback, type FC } from 'react';
import { storage } from './storage';
import type { GameSession } from './types';
import './SessionManager.css';

type SessionManagerProps = {
  sessions: GameSession[];
  currentSessionId: string | null;
  onSessionChange: (sessionId: string) => void;
  onSessionDelete: (sessionId: string) => void;
  onClose: () => void;
};

export const SessionManager: FC<SessionManagerProps> = ({
  sessions,
  currentSessionId,
  onSessionChange,
  onSessionDelete,
  onClose,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleStartEdit = useCallback((session: GameSession) => {
    setEditingId(session.id);
    setEditValue(session.name);
  }, []);

  const handleConfirmRename = useCallback((sessionId: string) => {
    if (editValue.trim()) {
      storage.renameSession(sessionId, editValue.trim());
      setEditingId(null);
      setEditValue('');
    }
  }, [editValue]);

  const handleCancelEdit = useCallback(() => {
    setEditingId(null);
    setEditValue('');
  }, []);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="session-manager-overlay" onClick={onClose}>
      <div className="session-manager-modal" onClick={(e) => e.stopPropagation()}>
        <div className="session-manager-header">
          <h2>Manage Sessions</h2>
          <button className="close-button" onClick={onClose} title="Close">×</button>
        </div>

        {sessions.length === 0 ? (
          <div className="no-sessions">No sessions yet</div>
        ) : (
          <div className="sessions-list">
            {sessions.map(session => (
              <div
                key={session.id}
                className={`session-item ${currentSessionId === session.id ? 'active' : ''}`}
              >
                <div className="session-info" onClick={() => onSessionChange(session.id)}>
                  {editingId === session.id ? (
                    <div className="session-edit" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        placeholder="Session name"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleConfirmRename(session.id);
                          } else if (e.key === 'Escape') {
                            handleCancelEdit();
                          }
                        }}
                      />
                      <button onClick={() => handleConfirmRename(session.id)} title="Confirm">✓</button>
                      <button onClick={handleCancelEdit} title="Cancel">✕</button>
                    </div>
                  ) : (
                    <>
                      <div className="session-name">{session.name}</div>
                      <div className="session-meta">
                        Created {formatDate(session.createdAt)} • Updated {formatDate(session.updatedAt)}
                      </div>
                    </>
                  )}
                </div>
                {editingId !== session.id && (
                  <div className="session-actions" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleStartEdit(session)}
                      title="Rename session"
                      className="rename-btn"
                    >
                      ✎
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete session "${session.name}"?`)) {
                          onSessionDelete(session.id);
                        }
                      }}
                      title="Delete session"
                      className="delete-btn"
                    >
                      🗑
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
