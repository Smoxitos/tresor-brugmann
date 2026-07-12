import type { ChoiceId, Riddle } from '../data/gameData';

export function validateChoice(
  riddle: Pick<Riddle, 'correctChoiceIds'>,
  selectedChoiceId: ChoiceId | null,
): boolean {
  return selectedChoiceId !== null && riddle.correctChoiceIds.includes(selectedChoiceId);
}
