import { describe, expect, it } from 'vitest';
import { gameData, type ChoiceId } from '../data/gameData';
import { validateChoice } from './validateChoice';

const allChoices: readonly ChoiceId[] = ['A', 'B', 'C', 'D'];

describe('validateChoice', () => {
  it('accepte A, B et C mais refuse D au niveau 1', () => {
    const level = gameData.levels[0];
    expect(allChoices.map((choice) => validateChoice(level, choice))).toEqual([
      true,
      true,
      true,
      false,
    ]);
  });

  it('n’accepte que D au niveau 2', () => {
    const level = gameData.levels[1];
    expect(allChoices.map((choice) => validateChoice(level, choice))).toEqual([
      false,
      false,
      false,
      true,
    ]);
  });

  it('accepte les quatre propositions au niveau 3', () => {
    const level = gameData.levels[2];
    expect(allChoices.every((choice) => validateChoice(level, choice))).toBe(true);
  });

  it('refuse une sélection vide', () => {
    expect(validateChoice(gameData.levels[0], null)).toBe(false);
  });
});
