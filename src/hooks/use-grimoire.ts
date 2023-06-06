import { useContext, useEffect, useState } from 'react';
import { AbletonContext } from '../contexts/ableton-provider';
import { ClipTypes, ClipMetadataType } from 'backend/types';
import { RFIDToClipMap } from '~/lib/database-output';

export type SpellRecipeType = { [key: string]: ClipMetadataType };

const SPELL_NAMES = [
  'Dancing Unicorn Vibez',
  'The Frog Princex',
  'Happily Never After',
  'The Rite of Spring Fling',
  'Bling Shot',
  'Cup in Smoke',
  'Unconvictional Love',
  'Fleeting Sex Appeal',
  'Cosmic Apotheosis',
  'Victory Sound',
  'Cheers for Fears',
  'Inner Demon Lure',
  'Self a Steam',
  'Mind Fog',
  'Woo Goo',
  'Immorality',
  'Cockroaching',
  'Seduction Production',
  'Even Higher Now',
  'Curse Reverse',
  'Bad Witch Boogie',
  'Aurora Aura',
  'Essence of Hell',
  'Twerking Toadstool',
  'Wand from the Pond',
  'Telepathic Erection',
  'Pole Gazing',
  'Rebirthing Rumba',
  'Black Hole Boom Boom',
  'Astral Ejecting',
  'Celestial Soup',
  'Starlight Shuffle',
  'Swirling Dervish',
  "Big Simpin'",
  'Songs of the Subs',
  'Badonka-Dom',
  'Pagan Popper',
  'Bone Drone',
  'Flower Shower',
];

function ChooseRandomElementFrom(array: any[]) {
  return array[Math.floor(Math.random() * array.length)];
}

export default function useGrimoire() {
  const { playingClips } = useContext(AbletonContext);
  const [spellRecipe, setSpellRecipe] = useState<SpellRecipeType>({});
  const [spellName, setSpellName] = useState<string>('');
  const actuallyPlayingClips = playingClips
    .filter((clip) => clip)
    .map((clip) => {
      if (clip) {
        return RFIDToClipMap[clip.rfid];
      }
      return clip;
    });

  function generateNewSpellName() {
    setSpellName((name) => {
      let newName = ChooseRandomElementFrom(SPELL_NAMES);
      while (newName === name) {
        newName = ChooseRandomElementFrom(SPELL_NAMES);
      }
      return newName;
    });
  }

  function generateNewSpell() {
    let randomClip;
    if (actuallyPlayingClips.length) {
      randomClip = ChooseRandomElementFrom(actuallyPlayingClips);
    } else {
      randomClip = ChooseRandomElementFrom(Object.values(RFIDToClipMap));
    }

    const newSpell = {} as SpellRecipeType;
    for (const type of Object.keys(ClipTypes)) {
      const reccs = randomClip?.recommendedClips?.[type];
      if (reccs) {
        newSpell[type] = reccs[Math.floor(Math.random() * reccs.length)];
      }
    }

    generateNewSpellName();
    setSpellRecipe(newSpell);
  }

  useEffect(() => {
    if (actuallyPlayingClips.length <= 1) {
      generateNewSpell();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actuallyPlayingClips.length]);

  return { spellRecipe, spellName, generateNewSpell };
}
