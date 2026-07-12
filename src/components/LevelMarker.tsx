import { Check, LockKeyhole } from 'lucide-react';
import type { MapPosition, Riddle } from '../data/gameData';

export type MarkerStatus = 'locked' | 'available' | 'active' | 'completed';

interface LevelMarkerProps {
  level: Riddle;
  status: MarkerStatus;
  onActivate: (level: Riddle) => void;
}

const statusLabels: Record<MarkerStatus, string> = {
  locked: 'verrouillé',
  available: 'disponible',
  active: 'en cours',
  completed: 'réussi',
};

function markerStyle(position: MapPosition) {
  return { left: `${position.x}%`, top: `${position.y}%` };
}

export function LevelMarker({ level, status, onActivate }: LevelMarkerProps) {
  const isInteractive = status === 'available' || status === 'active';

  return (
    <div className={`level-marker marker-${status}`} style={markerStyle(level.position)}>
      <button
        type="button"
        className="marker-button"
        onClick={() => isInteractive && onActivate(level)}
        disabled={!isInteractive}
        aria-label={`Niveau ${level.id}, ${level.location}, ${statusLabels[status]}`}
        aria-current={status === 'active' ? 'step' : undefined}
        data-level={level.id}
      >
        <span className="marker-ring" aria-hidden="true" />
        <span className="marker-content" aria-hidden="true">
          {status === 'locked' ? (
            <LockKeyhole size={20} />
          ) : status === 'completed' ? (
            <Check size={24} strokeWidth={3} />
          ) : (
            level.id
          )}
        </span>
      </button>
      <span className="marker-label" aria-hidden="true">
        <small>Niveau {level.id}</small>
        {level.location}
      </span>
    </div>
  );
}
