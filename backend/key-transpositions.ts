export const transpositions: { [key: string]: { [key: string]: number } } = {
  '6B': {
    // Bb Major
    '8B': 2,
    '3B': 3,
    '10B': 4,
    '5B': 5,
    '12B': 6,
    '7B': -5,
    '2B': -4,
    '9B': -3,
    '4B': -2,
    '11B': -1,
    '1B': 1,
  },
  '8B': {
    // C Major
    '10B': 2,
    '5B': 3,
    '12B': 4,
    '7B': 5,
    '2B': 6,
    '9B': -5,
    '4B': -4,
    '11B': -3,
    '6B': -2,
    '1B': -1,
    '3B': 1,
  },
  '3B': {
    // Db Major
    '5B': 2,
    '12B': 3,
    '7B': 4,
    '2B': 5,
    '9B': 6,
    '4B': -5,
    '11B': -4,
    '6B': -3,
    '1B': -2,
    '8B': -1,
    '10B': 1,
  },
  '10B': {
    // D Major
    '12B': 2,
    '7B': 3,
    '2B': 4,
    '9B': 5,
    '4B': 6,
    '11B': -5,
    '6B': -4,
    '1B': -3,
    '8B': -2,
    '3B': -1,
    '5B': 1,
  },
  '5B': {
    // Eb Major
    '7B': 2,
    '2B': 3,
    '9B': 4,
    '4B': 5,
    '11B': 6,
    '6B': -5,
    '1B': -4,
    '8B': -3,
    '3B': -2,
    '10B': -1,
    '12B': 1,
  },
  '12B': {
    // E Major
    '2B': 2,
    '9B': 3,
    '4B': 4,
    '11B': 5,
    '6B': 6,
    '1B': -5,
    '8B': -4,
    '3B': -3,
    '10B': -2,
    '5B': -1,
    '7B': 1,
  },
  '7B': {
    // F Major
    '9B': 2,
    '4B': 3,
    '11B': 4,
    '6B': 5,
    '1B': 6,
    '8B': -5,
    '3B': -4,
    '10B': -3,
    '5B': -2,
    '12B': -1,
    '2B': 1,
  },

  '2B': {
    // F# Major
    '4B': 2,
    '11B': 3,
    '6B': 4,
    '1B': 5,
    '8B': 6,
    '3B': -5,
    '10B': -4,
    '5B': -3,
    '12B': -2,
    '7B': -1,
    '9B': 1,
  },
  '9B': {
    // G Major (verify pattern)
    '11B': 2,
    '6B': 3,
    '1B': 4,
    '8B': 5,
    '3B': 6,
    '10B': -5,
    '5B': -4,
    '12B': -3,
    '7B': -2,
    '2B': -1,
    '4B': 1,
  },

  '4B': {
    // Ab Major
    '6B': 2,
    '1B': 3,
    '8B': 4,
    '3B': 5,
    '10B': 6,
    '5B': -5,
    '12B': -4,
    '7B': -3,
    '2B': -2,
    '9B': -1,
    '11B': 1,
  },
  '11B': {
    // A Major
    '1B': 2,
    '8B': 3,
    '3B': 4,
    '10B': 5,
    '5B': 6,
    '12B': -5,
    '7B': -4,
    '2B': -3,
    '9B': -2,
    '4B': -1,
    '6B': 1,
  },
  '1B': {
    // B Major
    '3B': 2,
    '10B': 3,
    '5B': 4,
    '12B': 5,
    '7B': 6,
    '2B': -5,
    '9B': -4,
    '4B': -3,
    '11B': -2,
    '6B': -1,
    '8B': 1,
  },
  '3A': {
    // Bb minor
    '5A': 2,
    '12A': 3,
    '7A': 4,
    '2A': 5,
    '9A': 6,
    '4A': -5,
    '11A': -4,
    '6A': -3,
    '1A': -2,
    '8A': -1,
    '10A': 1,
  },
  '5A': {
    // C minor
    '7A': 2,
    '2A': 3,
    '9A': 4,
    '4A': 5,
    '11A': 6,
    '6A': -5,
    '1A': -4,
    '8A': -3,
    '3A': -2,
    '10A': -1,
    '12A': 1,
  },
  '12A': {
    // Db minor
    '2A': 2,
    '9A': 3,
    '4A': 4,
    '11A': 5,
    '6A': 6,
    '1A': -5,
    '8A': -4,
    '3A': -3,
    '10A': -2,
    '5A': -1,
    '7A': 1,
  },
  '7A': {
    // D minor
    '9A': 2,
    '4A': 3,
    '11A': 4,
    '6A': 5,
    '1A': 6,
    '8A': -5,
    '3A': -4,
    '10A': -3,
    '5A': -2,
    '12A': -1,
    '2A': 1,
  },
  '2A': {
    // Eb minor
    '4A': 2,
    '11A': 3,
    '6A': 4,
    '1A': 5,
    '8A': 6,
    '3A': -5,
    '10A': -4,
    '5A': -3,
    '12A': -2,
    '7A': -1,
    '9A': 1,
  },
  '9A': {
    // E minor
    '11A': 2,
    '6A': 3,
    '1A': 4,
    '8A': 5,
    '3A': 6,
    '10A': -5,
    '5A': -4,
    '12A': -3,
    '7A': -2,
    '2A': -1,
    '4A': 1,
  },
  '4A': {
    // F minor
    '6A': 2,
    '1A': 3,
    '8A': 4,
    '3A': 5,
    '10A': 6,
    '5A': -5,
    '12A': -4,
    '7A': -3,
    '2A': -2,
    '9A': -1,
    '11A': 1,
  },
  '11A': {
    // F# minor
    '1A': 2,
    '8A': 3,
    '3A': 4,
    '10A': 5,
    '5A': 6,
    '12A': -5,
    '7A': -4,
    '2A': -3,
    '9A': -2,
    '4A': -1,
    '6A': 1,
  },
  '6A': {
    // G minor (verify pattern)
    '8A': 2,
    '3A': 3,
    '10A': 4,
    '5A': 5,
    '12A': 6,
    '7A': -5,
    '2A': -4,
    '9A': -3,
    '4A': -2,
    '11A': -1,
    '1A': 1,
  },
  '1A': {
    // Ab minor
    '3A': 2,
    '10A': 3,
    '5A': 4,
    '12A': 5,
    '7A': 6,
    '2A': -5,
    '9A': -4,
    '4A': -3,
    '11A': -2,
    '6A': -1,
    '8A': 1,
  },
  '8A': {
    // A minor
    '10A': 2,
    '5A': 3,
    '12A': 4,
    '7A': 5,
    '2A': 6,
    '9A': -5,
    '4A': -4,
    '11A': -3,
    '6A': -2,
    '1A': -1,
    '3A': 1,
  },
  '10A': {
    // B minor
    '12A': 2,
    '7A': 3,
    '2A': 4,
    '9A': 5,
    '4A': 6,
    '11A': -5,
    '6A': -4,
    '1A': -3,
    '8A': -2,
    '3A': -1,
    '5A': 1,
  },
};
