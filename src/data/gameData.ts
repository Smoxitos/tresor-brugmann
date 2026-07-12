export type ChoiceId = 'A' | 'B' | 'C' | 'D';
export type LevelId = 1 | 2 | 3;

export interface MapPosition {
  x: number;
  y: number;
}

export interface Choice {
  id: ChoiceId;
  label: string;
}

export interface Riddle {
  id: LevelId;
  type: 'QCM';
  location: string;
  title: string;
  question: string;
  choices: readonly Choice[];
  correctChoiceIds: readonly ChoiceId[];
  hint: string;
  successMessage: string;
  position: MapPosition;
}

export interface RouteSegment {
  id: LevelId;
  points: readonly MapPosition[];
}

export interface GameConfig {
  colleagueName: string;
  gameTitle: string;
  introSubtitle: string;
  introText: string;
  imagePaths: {
    map: string;
    team: string;
  };
  imageAlt: {
    map: string;
    team: string;
  };
  mapAspectRatio: string;
  levels: readonly Riddle[];
  chestPosition: MapPosition;
  routeSegments: readonly RouteSegment[];
  encouragements: readonly string[];
  lockedChestMessage: string;
  unlockedChestMessage: string;
  final: {
    title: string;
    treasureMessage: string;
    farewellMessage: string;
    signoff: string;
    lastMessage: string;
  };
}

const choices = (labels: readonly [string, string, string, string]): readonly Choice[] =>
  labels.map((label, index) => ({
    id: (['A', 'B', 'C', 'D'] as const)[index],
    label,
  }));

const publicImage = (fileName: string) => `${import.meta.env.BASE_URL}images/${fileName}`;

export const gameData = {
  colleagueName: 'notre collègue',
  gameTitle: 'À la recherche du trésor de Brugmann',
  introSubtitle: 'Une dernière aventure en Belgique avant ton départ vers le Liban…',
  introText:
    'Trois énigmes se dressent entre toi et le trésor. Observe bien la carte, suis la ligne rouge et retrouve le chemin jusqu’à Brugmann.',
  imagePaths: {
    map: publicImage('carte-brugmann.png'),
    team: publicImage('equipe.jpg'),
  },
  imageAlt: {
    map: 'Carte au trésor de Bruxelles reliant Zaventem au CHU Brugmann par une ligne rouge',
    team: 'Photo souvenir de l’équipe du CHU Brugmann',
  },
  // Ce ratio correspond à la carte fournie (1492 × 1054) et évite toute déformation.
  mapAspectRatio: '1492 / 1054',
  levels: [
    {
      id: 1,
      type: 'QCM',
      location: 'Zaventem',
      title: 'Une question de localisation',
      question: 'Où se trouvent les meilleurs biologistes ?',
      choices: choices([
        'Au CHU Brugmann',
        'Au CHU Brugmann, évidemment',
        'Toujours au CHU Brugmann',
        'La réponse D',
      ]),
      correctChoiceIds: ['A', 'B', 'C'],
      hint:
        'Suis la ligne rouge jusqu’à l’endroit où le véritable trésor travaille tous les jours.',
      successMessage:
        'Évidemment ! Les meilleurs biologistes se trouvent à Brugmann. Toute autre réponse aurait été scientifiquement douteuse.',
      // Pour déplacer un marqueur : x va de 0 (gauche) à 100 (droite),
      // et y de 0 (haut) à 100 (bas). Les valeurs sont des pourcentages de la carte.
      position: { x: 89.6, y: 40.3 },
    },
    {
      id: 2,
      type: 'QCM',
      location: 'Parc du Cinquantenaire',
      title: 'La grande question salariale',
      question: 'Combien gagnent les biologistes ?',
      choices: choices([
        '3 000 € par mois',
        '5 000 € par mois',
        '10 000 € par mois',
        'Pas assez',
      ]),
      correctChoiceIds: ['D'],
      hint: 'Aucun chiffre ne semble vraiment satisfaisant…',
      successMessage:
        'Bonne réponse ! Après des années d’études, des gardes et des validations, la réponse reste toujours la même : pas assez.',
      position: { x: 59.7, y: 46.8 },
    },
    {
      id: 3,
      type: 'QCM',
      location: 'Atomium',
      title: 'Ce que tu emportes avec toi',
      question: 'Qu’est-ce que tu vas emporter de Brugmann avec toi au Liban ?',
      choices: choices([
        'De bons souvenirs',
        'Les fous rires avec l’équipe',
        'L’amitié de tes collègues',
        'Une quantité inquiétante d’histoires de laboratoire',
      ]),
      correctChoiceIds: ['A', 'B', 'C', 'D'],
      hint: 'Pour une fois, il est impossible de se tromper.',
      successMessage:
        'Bonne réponse ! En réalité, toutes les réponses étaient justes. Tu emportes un peu de tout cela avec toi.',
      position: { x: 31, y: 35.8 },
    },
  ],
  chestPosition: { x: 9.8, y: 29 },
  // Les points ci-dessous dessinent seulement la lueur de progression au-dessus
  // de la route rouge. Ils sont modifiables avec la même logique x/y que les marqueurs.
  routeSegments: [
    {
      id: 1,
      points: [
        { x: 89.6, y: 40.3 },
        { x: 82, y: 37.2 },
        { x: 75, y: 37.5 },
        { x: 67, y: 41.4 },
        { x: 59.7, y: 46.8 },
      ],
    },
    {
      id: 2,
      points: [
        { x: 59.7, y: 46.8 },
        { x: 51, y: 48.9 },
        { x: 43, y: 45.8 },
        { x: 36, y: 40.5 },
        { x: 31, y: 35.8 },
      ],
    },
    {
      id: 3,
      points: [
        { x: 31, y: 35.8 },
        { x: 25, y: 31.8 },
        { x: 18, y: 29.2 },
        { x: 9.8, y: 29 },
      ],
    },
  ],
  encouragements: [
    'Ce n’est pas encore la bonne réponse…',
    'Observe mieux la carte !',
    'Le Père Fouras ne donne pas ses secrets aussi facilement.',
    'Tu es proche, essaie encore !',
  ],
  lockedChestMessage:
    'Le coffre est encore verrouillé. Résous les trois énigmes pour découvrir le trésor.',
  unlockedChestMessage: 'Le trésor est débloqué !',
  final: {
    title: 'Félicitations, tu as trouvé le véritable trésor de Brugmann !',
    treasureMessage:
      'Le véritable trésor n’était pas caché dans un coffre… C’était tous les moments partagés avec l’équipe.',
    farewellMessage:
      'Même si une nouvelle aventure t’attend au Liban, une partie de toi restera toujours avec nous à Brugmann. Nous te souhaitons beaucoup de réussite, de bonheur et de belles découvertes pour la suite.',
    signoff: 'Bon voyage et à bientôt ! 🇧🇪 ❤️ 🇱🇧',
    lastMessage:
      'Merci pour tous les moments partagés, les discussions, les rires et ton travail avec nous. Cette carte représente le chemin jusqu’à Brugmann, mais surtout tous les souvenirs que tu emportes avec toi.',
  },
} as const satisfies GameConfig;
