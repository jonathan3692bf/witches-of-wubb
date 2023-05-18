import { TRIGGER_ORDER } from '../ableton-api';
import { ClipInfo, ClipList } from '../types';

export function FindNextPhraseLeader(playingClips: ClipList) {
  const clipCopy = playingClips.slice().filter((clip) => clip) as ClipInfo[];
  clipCopy.sort((a, b) => {
    return TRIGGER_ORDER.indexOf(a.type) - TRIGGER_ORDER.indexOf(b.type);
  });
  return clipCopy[0];
}
