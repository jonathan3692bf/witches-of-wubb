import { useContext, useEffect, useState } from 'react';
import { AbletonContext } from '../contexts/ableton-provider';
import { ClipTypes, ClipMetadataType } from 'backend/types';

export type SpellRecipeType = { [key: string]: ClipMetadataType };

export default function useGrimoire() {
  const { playingClips } = useContext(AbletonContext);
  const [spellRecipe, setSpellRecipe] = useState<SpellRecipeType>({});
  const actuallyPlayingClips = playingClips.filter((clip) => clip);

  function generateNewSpell() {
    const randomClip =
      actuallyPlayingClips[Math.floor(Math.random() * actuallyPlayingClips.length)];
    const newSpell = {} as SpellRecipeType;
    for (const type of Object.keys(ClipTypes)) {
      const reccs = randomClip?.recommendedClips?.[type];
      if (reccs) {
        newSpell[type] = reccs[Math.floor(Math.random() * reccs.length)];
      }
    }
    setSpellRecipe(newSpell);
  }

  useEffect(() => {
    if (actuallyPlayingClips.length === 0) {
      setSpellRecipe({});
    } else if (actuallyPlayingClips.length === 1) {
      generateNewSpell();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actuallyPlayingClips.length]);

  return { spellRecipe, generateNewSpell };
}
