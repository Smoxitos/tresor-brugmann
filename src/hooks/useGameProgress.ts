import { useCallback, useEffect, useRef, useState } from 'react';
import type { LevelId } from '../data/gameData';

const STORAGE_KEY = 'brugmann-treasure-progress-v1';

interface GameProgress {
  version: 1;
  started: boolean;
  completedLevelIds: LevelId[];
  treasureOpened: boolean;
}

const initialProgress: GameProgress = {
  version: 1,
  started: false,
  completedLevelIds: [],
  treasureOpened: false,
};

function isSequentialProgress(value: unknown): value is LevelId[] {
  if (!Array.isArray(value) || value.length > 3) return false;
  return value.every((item, index) => item === index + 1);
}

function loadProgress(): GameProgress {
  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY);
    if (!rawValue) return initialProgress;

    const parsed: unknown = JSON.parse(rawValue);
    if (!parsed || typeof parsed !== 'object') return initialProgress;

    const candidate = parsed as Partial<GameProgress>;
    if (candidate.version !== 1 || !isSequentialProgress(candidate.completedLevelIds)) {
      return initialProgress;
    }

    const allLevelsCompleted = candidate.completedLevelIds.length === 3;
    return {
      version: 1,
      started: candidate.started === true || candidate.completedLevelIds.length > 0,
      completedLevelIds: [...candidate.completedLevelIds],
      treasureOpened: allLevelsCompleted && candidate.treasureOpened === true,
    };
  } catch {
    return initialProgress;
  }
}

export function useGameProgress() {
  const [progress, setProgress] = useState<GameProgress>(loadProgress);
  const skipNextPersistence = useRef(false);

  useEffect(() => {
    if (skipNextPersistence.current) {
      skipNextPersistence.current = false;
      return;
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Le jeu reste jouable en mémoire si localStorage est indisponible.
    }
  }, [progress]);

  const startAdventure = useCallback(() => {
    setProgress((current) => ({ ...current, started: true }));
  }, []);

  const completeLevel = useCallback((levelId: LevelId) => {
    setProgress((current) => {
      const expectedLevelId = current.completedLevelIds.length + 1;
      if (levelId !== expectedLevelId || current.completedLevelIds.includes(levelId)) {
        return current;
      }

      return {
        ...current,
        started: true,
        completedLevelIds: [...current.completedLevelIds, levelId],
      };
    });
  }, []);

  const openTreasure = useCallback(() => {
    setProgress((current) => {
      if (current.completedLevelIds.length !== 3) return current;
      return { ...current, treasureOpened: true };
    });
  }, []);

  const resetProgress = useCallback(() => {
    skipNextPersistence.current = true;
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Une remise à zéro de la session reste possible même sans accès au stockage.
    }
    setProgress(initialProgress);
  }, []);

  return {
    ...progress,
    completedCount: progress.completedLevelIds.length,
    startAdventure,
    completeLevel,
    openTreasure,
    resetProgress,
  };
}

export { STORAGE_KEY };
