import { Flag } from 'lucide-react';

interface ProgressBarProps {
  completedCount: number;
  total: number;
}

export function ProgressBar({ completedCount, total }: ProgressBarProps) {
  const percentage = (completedCount / total) * 100;

  return (
    <section className="progress-card" aria-label="Progression de l’aventure">
      <div className="progress-heading">
        <span>
          <Flag size={17} aria-hidden="true" /> Progression
        </span>
        <strong>
          {completedCount}/{total} énigmes
        </strong>
      </div>
      <div
        className="progress-track"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={completedCount}
        aria-valuetext={`${completedCount} énigme${completedCount > 1 ? 's' : ''} sur ${total}`}
      >
        <span className="progress-fill" style={{ width: `${percentage}%` }} />
        <div className="progress-milestones" aria-hidden="true">
          {Array.from({ length: total }, (_, index) => (
            <i key={index} className={index < completedCount ? 'is-complete' : ''} />
          ))}
        </div>
      </div>
    </section>
  );
}
