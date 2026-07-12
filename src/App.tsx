import { useState } from 'react';
import { ConfirmModal } from './components/ConfirmModal';
import { FinalReveal } from './components/FinalReveal';
import { IntroScreen } from './components/IntroScreen';
import { RiddleModal } from './components/RiddleModal';
import { TreasureMap } from './components/TreasureMap';
import { gameData, type LevelId, type Riddle } from './data/gameData';
import { useGameProgress } from './hooks/useGameProgress';

export default function App() {
  const gameProgress = useGameProgress();
  const [activeLevelId, setActiveLevelId] = useState<LevelId | null>(null);
  const [lastCompletedLevelId, setLastCompletedLevelId] = useState<LevelId | null>(null);
  const [showResetConfirmation, setShowResetConfirmation] = useState(false);
  const [showFinalReveal, setShowFinalReveal] = useState(gameProgress.treasureOpened);

  const activeRiddle = gameData.levels.find((level) => level.id === activeLevelId) ?? null;

  const handleOpenLevel = (level: Riddle) => {
    const expectedLevelId = gameProgress.completedCount + 1;
    if (level.id !== expectedLevelId || gameProgress.completedLevelIds.includes(level.id)) return;
    setActiveLevelId(level.id);
  };

  const handleLevelSuccess = (levelId: LevelId) => {
    gameProgress.completeLevel(levelId);
    setLastCompletedLevelId(levelId);
  };

  const handleOpenChest = () => {
    if (gameProgress.completedCount !== gameData.levels.length) return;
    gameProgress.openTreasure();
    setShowFinalReveal(true);
  };

  const handleReset = () => {
    gameProgress.resetProgress();
    setActiveLevelId(null);
    setLastCompletedLevelId(null);
    setShowFinalReveal(false);
    setShowResetConfirmation(false);
  };

  if (!gameProgress.started) {
    return <IntroScreen onStart={gameProgress.startAdventure} />;
  }

  return (
    <>
      <div aria-hidden={Boolean(activeRiddle || showResetConfirmation || showFinalReveal)}>
        <TreasureMap
          completedLevelIds={gameProgress.completedLevelIds}
          activeLevelId={activeLevelId}
          lastCompletedLevelId={lastCompletedLevelId}
          onOpenLevel={handleOpenLevel}
          onOpenChest={handleOpenChest}
          onRestart={() => setShowResetConfirmation(true)}
        />
      </div>

      {activeRiddle && (
        <RiddleModal
          riddle={activeRiddle}
          onClose={() => setActiveLevelId(null)}
          onSuccess={handleLevelSuccess}
        />
      )}

      {showResetConfirmation && (
        <ConfirmModal
          onCancel={() => setShowResetConfirmation(false)}
          onConfirm={handleReset}
        />
      )}

      {showFinalReveal && <FinalReveal onReplay={() => setShowFinalReveal(false)} />}
    </>
  );
}
