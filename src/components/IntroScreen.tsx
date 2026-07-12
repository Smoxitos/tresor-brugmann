import { Compass, Heart, MapPinned, Plane, Sparkles } from 'lucide-react';
import { gameData } from '../data/gameData';

interface IntroScreenProps {
  onStart: () => void;
}

const particlePositions = [9, 17, 26, 36, 47, 58, 68, 77, 86, 93];

export function IntroScreen({ onStart }: IntroScreenProps) {
  return (
    <main className="intro-screen">
      <div className="ambient-particles" aria-hidden="true">
        {particlePositions.map((left, index) => (
          <span
            key={left}
            style={{
              left: `${left}%`,
              top: `${12 + ((index * 23) % 74)}%`,
              animationDelay: `${index * -0.48}s`,
            }}
          />
        ))}
      </div>

      <section className="intro-card" aria-labelledby="game-title">
        <div className="intro-emblem" aria-hidden="true">
          <Compass size={42} strokeWidth={1.5} />
        </div>
        <p className="eyebrow">
          <Sparkles size={15} aria-hidden="true" /> Une aventure rien que pour toi
        </p>
        <h1 id="game-title">{gameData.gameTitle}</h1>
        <p className="intro-subtitle">{gameData.introSubtitle}</p>

        <div className="ornamental-divider" aria-hidden="true">
          <span />
          <MapPinned size={22} />
          <span />
        </div>

        <p className="intro-copy">{gameData.introText}</p>

        <div className="journey-preview" aria-label="Trajet de Zaventem à Brugmann">
          <span>
            <Plane size={18} aria-hidden="true" /> Zaventem
          </span>
          <i aria-hidden="true" />
          <span>
            <Heart size={18} aria-hidden="true" /> Brugmann
          </span>
        </div>

        <button className="primary-button intro-start" type="button" onClick={onStart}>
          Commencer l’aventure
          <Compass size={20} aria-hidden="true" />
        </button>

        <p className="intro-footnote">3 énigmes · 1 trésor · une équipe inoubliable</p>
      </section>
    </main>
  );
}
