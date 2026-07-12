import { useEffect, useMemo, useRef, useState } from 'react';
import { Compass, Info, LockKeyhole, RotateCcw, Route, Sparkles } from 'lucide-react';
import { gameData, type LevelId, type Riddle } from '../data/gameData';
import { LevelMarker, type MarkerStatus } from './LevelMarker';
import { ProgressBar } from './ProgressBar';
import { TreasureChest } from './TreasureChest';

interface TreasureMapProps {
  completedLevelIds: readonly LevelId[];
  activeLevelId: LevelId | null;
  lastCompletedLevelId: LevelId | null;
  onOpenLevel: (level: Riddle) => void;
  onOpenChest: () => void;
  onRestart: () => void;
}

function getMarkerStatus(
  level: Riddle,
  completedLevelIds: readonly LevelId[],
  activeLevelId: LevelId | null,
): MarkerStatus {
  if (completedLevelIds.includes(level.id)) return 'completed';
  if (activeLevelId === level.id) return 'active';
  if (level.id === completedLevelIds.length + 1) return 'available';
  return 'locked';
}

export function TreasureMap({
  completedLevelIds,
  activeLevelId,
  lastCompletedLevelId,
  onOpenLevel,
  onOpenChest,
  onRestart,
}: TreasureMapProps) {
  const completedCount = completedLevelIds.length;
  const treasureUnlocked = completedCount === gameData.levels.length;
  const [mapUnavailable, setMapUnavailable] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [chestMessage, setChestMessage] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);

  const compassPosition = useMemo(
    () => gameData.levels[completedCount]?.position ?? gameData.chestPosition,
    [completedCount],
  );

  useEffect(() => {
    if (!lastCompletedLevelId) return;
    setShowSuccessToast(true);
    const timeout = window.setTimeout(() => setShowSuccessToast(false), 4800);
    return () => window.clearTimeout(timeout);
  }, [lastCompletedLevelId]);

  useEffect(() => {
    if (treasureUnlocked) setChestMessage('');
  }, [treasureUnlocked]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || (!mapReady && !mapUnavailable)) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const destinationX = (compassPosition.x / 100) * viewport.scrollWidth;
    const left = Math.max(0, destinationX - viewport.clientWidth / 2);
    const timeout = window.setTimeout(() => {
      viewport.scrollTo({ left, behavior: reducedMotion ? 'auto' : 'smooth' });
    }, 80);

    return () => window.clearTimeout(timeout);
  }, [compassPosition, mapReady, mapUnavailable]);

  const handleChestActivation = () => {
    if (!treasureUnlocked) {
      setChestMessage(gameData.lockedChestMessage);
      return;
    }
    setChestMessage('');
    onOpenChest();
  };

  return (
    <main className="map-screen">
      <header className="map-header">
        <div className="map-brand">
          <span className="map-brand-icon" aria-hidden="true">
            <Compass size={25} />
          </span>
          <div>
            <p>La dernière expédition</p>
            <h1>{gameData.gameTitle}</h1>
          </div>
        </div>
        <ProgressBar completedCount={completedCount} total={gameData.levels.length} />
      </header>

      <section className="map-shell" aria-labelledby="map-section-title">
        <div className="map-toolbar">
          <div>
            <span className="section-kicker">
              <Route size={16} aria-hidden="true" /> Sur la piste du trésor
            </span>
            <h2 id="map-section-title">
              {treasureUnlocked ? 'Le coffre t’attend à Brugmann' : 'Suis la ligne rouge'}
            </h2>
          </div>
          <div className="map-legend" aria-label="Légende des marqueurs">
            <span><i className="legend-dot available" /> Disponible</span>
            <span><i className="legend-dot complete" /> Réussi</span>
            <span><LockKeyhole size={13} aria-hidden="true" /> Verrouillé</span>
          </div>
        </div>

        <p className="mobile-map-hint">
          <Info size={15} aria-hidden="true" /> Fais glisser la carte pour explorer le trajet.
        </p>

        <div className="map-viewport" ref={viewportRef} tabIndex={0} aria-label="Carte interactive défilable de Bruxelles">
          <div className="map-canvas" style={{ aspectRatio: gameData.mapAspectRatio }}>
            {!mapUnavailable ? (
              <img
                className="map-image"
                src={gameData.imagePaths.map}
                alt={gameData.imageAlt.map}
                draggable="false"
                onLoad={() => setMapReady(true)}
                onError={() => setMapUnavailable(true)}
              />
            ) : (
              <div className="map-fallback" role="img" aria-label={gameData.imageAlt.map}>
                <Compass size={68} strokeWidth={1.2} aria-hidden="true" />
                <strong>La carte est partie en reconnaissance</strong>
                <span>Les étapes restent accessibles pendant son absence.</span>
              </div>
            )}

            <svg
              className="route-overlay"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {gameData.routeSegments.map((segment, index) => (
                <polyline
                  key={segment.id}
                  className={index < completedCount ? 'route-segment is-lit' : 'route-segment'}
                  points={segment.points.map((point) => `${point.x},${point.y}`).join(' ')}
                />
              ))}
            </svg>

            <div
              className="traveller-compass"
              style={{ left: `${compassPosition.x}%`, top: `${compassPosition.y}%` }}
              aria-hidden="true"
            >
              <Compass size={22} />
            </div>

            {gameData.levels.map((level) => (
              <LevelMarker
                key={level.id}
                level={level}
                status={getMarkerStatus(level, completedLevelIds, activeLevelId)}
                onActivate={onOpenLevel}
              />
            ))}

            <div
              className="chest-marker"
              style={{ left: `${gameData.chestPosition.x}%`, top: `${gameData.chestPosition.y}%` }}
            >
              <TreasureChest unlocked={treasureUnlocked} onActivate={handleChestActivation} />
              <span className="chest-location-label">CHU Brugmann</span>
            </div>
          </div>
        </div>

        <div className="map-status-row">
          <div className="map-announcement" role="status" aria-live="polite">
            {showSuccessToast && lastCompletedLevelId ? (
              <span className="success-toast">
                <Sparkles size={18} aria-hidden="true" />
                Étape réussie ! Le niveau suivant est débloqué.
              </span>
            ) : chestMessage ? (
              <span className="locked-message">
                <LockKeyhole size={17} aria-hidden="true" /> {chestMessage}
              </span>
            ) : treasureUnlocked ? (
              <span className="unlocked-message">
                <Sparkles size={18} aria-hidden="true" /> {gameData.unlockedChestMessage}
              </span>
            ) : (
              <span className="journey-status">
                Prochaine étape : {gameData.levels[completedCount]?.location}
              </span>
            )}
          </div>

          <button type="button" className="restart-button" onClick={onRestart}>
            <RotateCcw size={15} aria-hidden="true" /> Recommencer l’aventure
          </button>
        </div>
      </section>
    </main>
  );
}
