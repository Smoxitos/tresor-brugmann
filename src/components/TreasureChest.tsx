import { KeyRound, LockKeyhole, Sparkles } from 'lucide-react';

interface TreasureChestProps {
  unlocked: boolean;
  isOpen?: boolean;
  decorative?: boolean;
  onActivate?: () => void;
}

export function TreasureChest({
  unlocked,
  isOpen = false,
  decorative = false,
  onActivate,
}: TreasureChestProps) {
  const content = (
    <>
      <span className="chest-glow" />
      <span className="chest-spark chest-spark-one">
        <Sparkles size={15} />
      </span>
      <span className="chest-spark chest-spark-two">
        <Sparkles size={12} />
      </span>
      <span className="chest-art">
        <span className="chest-lid">
          <span className="chest-band" />
        </span>
        <span className="chest-base">
          <span className="chest-band" />
          <span className="chest-keyplate">
            {unlocked ? <KeyRound size={13} /> : <LockKeyhole size={13} />}
          </span>
        </span>
      </span>
    </>
  );

  const className = [
    'treasure-chest',
    unlocked ? 'is-unlocked' : 'is-locked',
    isOpen ? 'is-open' : '',
    decorative ? 'is-decorative' : '',
  ]
    .filter(Boolean)
    .join(' ');

  if (decorative) {
    return (
      <div className={className} aria-hidden="true">
        {content}
      </div>
    );
  }

  return (
    <button
      type="button"
      className={className}
      onClick={onActivate}
      aria-label={
        unlocked
          ? 'Coffre du CHU Brugmann débloqué, ouvrir le trésor'
          : 'Coffre du CHU Brugmann verrouillé'
      }
    >
      {content}
    </button>
  );
}
