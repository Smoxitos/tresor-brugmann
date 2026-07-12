import { TriangleAlert, X } from 'lucide-react';
import { useAccessibleDialog } from '../hooks/useAccessibleDialog';

interface ConfirmModalProps {
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmModal({ onCancel, onConfirm }: ConfirmModalProps) {
  const dialogRef = useAccessibleDialog(onCancel);

  return (
    <div className="modal-backdrop confirm-backdrop" role="presentation">
      <div
        ref={dialogRef}
        className="confirm-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-description"
        tabIndex={-1}
      >
        <button
          type="button"
          className="icon-button modal-close"
          onClick={onCancel}
          aria-label="Fermer la confirmation"
        >
          <X size={21} aria-hidden="true" />
        </button>
        <span className="confirm-icon" aria-hidden="true">
          <TriangleAlert size={30} />
        </span>
        <h2 id="confirm-title">Recommencer l’aventure ?</h2>
        <p id="confirm-description">
          Toute la progression sera effacée et les trois énigmes seront à nouveau verrouillées.
        </p>
        <div className="modal-actions confirm-actions">
          <button type="button" className="secondary-button" onClick={onCancel}>
            Garder ma progression
          </button>
          <button type="button" className="danger-button" onClick={onConfirm}>
            Oui, recommencer
          </button>
        </div>
      </div>
    </div>
  );
}
