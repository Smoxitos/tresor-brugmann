import { useState } from 'react';
import { Heart, RotateCcw, ScrollText, Sparkles, UsersRound } from 'lucide-react';
import { gameData } from '../data/gameData';
import { useAccessibleDialog } from '../hooks/useAccessibleDialog';
import { TreasureChest } from './TreasureChest';

interface FinalRevealProps {
  onReplay: () => void;
}

const confettiColors = ['#f5c451', '#9f2e24', '#fff2b7', '#2e745b', '#d98a2b'];

export function FinalReveal({ onReplay }: FinalRevealProps) {
  const [letterOpen, setLetterOpen] = useState(false);
  const [photoUnavailable, setPhotoUnavailable] = useState(false);
  const dialogRef = useAccessibleDialog(onReplay);

  return (
    <div className="final-backdrop">
      <div className="confetti-layer" aria-hidden="true">
        {Array.from({ length: 32 }, (_, index) => (
          <i
            key={index}
            style={{
              left: `${(index * 31) % 100}%`,
              animationDelay: `${-((index * 0.17) % 2.8)}s`,
              animationDuration: `${2.8 + (index % 5) * 0.35}s`,
              backgroundColor: confettiColors[index % confettiColors.length],
            }}
          />
        ))}
      </div>

      <section
        ref={dialogRef}
        className="final-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="final-title"
        tabIndex={-1}
      >
        <div className="final-chest-wrap">
          <TreasureChest unlocked isOpen decorative />
        </div>

        <p className="eyebrow final-eyebrow">
          <Sparkles size={16} aria-hidden="true" /> Le trésor est ouvert
        </p>
        <h1 id="final-title">{gameData.final.title}</h1>

        <div className="team-photo-frame">
          <span className="photo-tape photo-tape-left" aria-hidden="true" />
          <span className="photo-tape photo-tape-right" aria-hidden="true" />
          {!photoUnavailable ? (
            <img
              src={gameData.imagePaths.team}
              alt={gameData.imageAlt.team}
              onError={() => setPhotoUnavailable(true)}
              onLoad={(event) => {
                const image = event.currentTarget;
                if (image.naturalHeight > image.naturalWidth * 2.4) {
                  setPhotoUnavailable(true);
                }
              }}
            />
          ) : (
            <div className="team-photo-placeholder" role="img" aria-label="Emplacement réservé à la photo de l’équipe">
              <span className="placeholder-sun" aria-hidden="true" />
              <UsersRound size={70} strokeWidth={1.3} aria-hidden="true" />
              <strong>Votre photo d’équipe trouvera sa place ici</strong>
              <small>En attendant, tous les sourires sont déjà dans le souvenir.</small>
            </div>
          )}
          <span className="photo-caption">Brugmann · une équipe, mille souvenirs</span>
        </div>

        <div className="final-copy">
          <p className="treasure-message">{gameData.final.treasureMessage}</p>
          <p>{gameData.final.farewellMessage}</p>
          <p className="final-signoff">{gameData.final.signoff}</p>
        </div>

        {letterOpen && (
          <div className="farewell-letter" id="farewell-letter">
            <div className="letter-heading">
              <Heart size={19} fill="currentColor" aria-hidden="true" />
              <strong>Un dernier mot de l’équipe</strong>
            </div>
            <p>{gameData.final.lastMessage}</p>
            <span className="letter-signature">Avec toute notre amitié</span>
          </div>
        )}

        <div className="final-actions">
          <button type="button" className="secondary-button" onClick={onReplay}>
            <RotateCcw size={18} aria-hidden="true" /> Revoir l’aventure
          </button>
          <button
            type="button"
            className="primary-button"
            onClick={() => setLetterOpen((current) => !current)}
            aria-expanded={letterOpen}
            aria-controls="farewell-letter"
          >
            <ScrollText size={18} aria-hidden="true" />
            {letterOpen ? 'Replier le dernier message' : 'Afficher un dernier message'}
          </button>
        </div>
      </section>
    </div>
  );
}
