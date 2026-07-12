import { useState, type FormEvent, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { CheckCircle2, Lightbulb, Sparkles, X } from 'lucide-react';
import { gameData, type ChoiceId, type Riddle } from '../data/gameData';
import { useAccessibleDialog } from '../hooks/useAccessibleDialog';
import { validateChoice } from '../utils/validateChoice';

interface RiddleModalProps {
  riddle: Riddle;
  onClose: () => void;
  onSuccess: (levelId: Riddle['id']) => void;
}

type FeedbackStatus = 'idle' | 'error' | 'success';

export function RiddleModal({ riddle, onClose, onSuccess }: RiddleModalProps) {
  const [selectedChoice, setSelectedChoice] = useState<ChoiceId | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [status, setStatus] = useState<FeedbackStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const dialogRef = useAccessibleDialog(onClose);

  const selectChoice = (choiceId: ChoiceId) => {
    if (status === 'success') return;
    setSelectedChoice(choiceId);
    setStatus('idle');
    setErrorMessage('');
  };

  const handleRadioKeyDown = (
    event: ReactKeyboardEvent<HTMLInputElement>,
    choiceId: ChoiceId,
  ) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      selectChoice(choiceId);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedChoice || status === 'success') return;

    if (validateChoice(riddle, selectedChoice)) {
      setStatus('success');
      onSuccess(riddle.id);
      return;
    }

    const selectedChoiceData = riddle.choices.find(
      (choice) => choice.id === selectedChoice,
    );
    const randomIndex = Math.floor(Math.random() * gameData.encouragements.length);
    setErrorMessage(
      selectedChoiceData?.incorrectFeedback ?? gameData.encouragements[randomIndex],
    );
    setStatus('error');
  };

  const handleValidationKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    event.currentTarget.form?.requestSubmit();
  };

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <div
        ref={dialogRef}
        className={`riddle-modal ${status === 'error' ? 'has-error' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="riddle-title"
        aria-describedby="riddle-question"
        tabIndex={-1}
      >
        <button
          type="button"
          className="icon-button modal-close"
          onClick={onClose}
          aria-label="Fermer l’énigme"
        >
          <X size={22} aria-hidden="true" />
        </button>

        <header className="riddle-header">
          <span className="level-kicker">Niveau {riddle.id} · {riddle.location}</span>
          <h2 id="riddle-title">{riddle.title}</h2>
          <p id="riddle-question">{riddle.question}</p>
        </header>

        <form onSubmit={handleSubmit}>
          <fieldset className="choices-fieldset" disabled={status === 'success'}>
            <legend className="sr-only">Choisis une réponse</legend>
            {riddle.choices.map((choice) => {
              const isSelected = selectedChoice === choice.id;
              return (
                <label
                  key={choice.id}
                  className={`choice-option ${isSelected ? 'is-selected' : ''}`}
                >
                  <input
                    type="radio"
                    name={`riddle-${riddle.id}`}
                    value={choice.id}
                    checked={isSelected}
                    onChange={() => selectChoice(choice.id)}
                    onKeyDown={(event) => handleRadioKeyDown(event, choice.id)}
                  />
                  <span className="choice-letter" aria-hidden="true">{choice.id}</span>
                  <span className="choice-label">{choice.label}</span>
                  {isSelected && <CheckCircle2 className="choice-check" size={20} aria-hidden="true" />}
                </label>
              );
            })}
          </fieldset>

          {showHint && status !== 'success' && (
            <aside className="hint-box" id="riddle-hint">
              <Lightbulb size={19} aria-hidden="true" />
              <p><strong>Indice du Père Fouras</strong>{riddle.hint}</p>
            </aside>
          )}

          <div className="feedback-region" aria-live="polite" aria-atomic="true">
            {status === 'error' && <p className="error-feedback">{errorMessage}</p>}
            {status === 'success' && (
              <div className="success-feedback">
                <div className="success-stars" aria-hidden="true">
                  {Array.from({ length: 8 }, (_, index) => (
                    <Sparkles key={index} size={15 + (index % 3) * 3} />
                  ))}
                </div>
                <strong>Étape réussie !</strong>
                <span>Bonne réponse ! Le chemin continue…</span>
                <p>{riddle.successMessage}</p>
              </div>
            )}
          </div>

          <div className="modal-actions">
            {status !== 'success' ? (
              <>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setShowHint((current) => !current)}
                  aria-expanded={showHint}
                  aria-controls="riddle-hint"
                >
                  <Lightbulb size={18} aria-hidden="true" />
                  {showHint ? 'Masquer l’indice' : 'Obtenir un indice'}
                </button>
                <button
                  type="submit"
                  className="primary-button"
                  disabled={!selectedChoice}
                  onKeyDown={handleValidationKeyDown}
                >
                  Valider ma réponse
                </button>
              </>
            ) : (
              <button type="button" className="primary-button continue-button" onClick={onClose}>
                Continuer sur la carte
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
