import { useContext } from 'react';
import { AbletonContext } from '~/contexts/ableton-provider';
import VolumeSlider from './volume-slider';
// import { LoggerContext } from '~/contexts/logger-provider';
import csv from "~/assets/BSS 23 Master Spreadsheet Budget, Inventory, Schedule, ETC - RFID's.csv";
const ClipNameAssetMap: Record<string, string> = {};

csv.reduce((acc: typeof ClipNameAssetMap, curr: any) => {
  const clipName = curr['Clip Name'].replace(/^\*\s?/, '');
  const assetName = curr['Icon / Asset Name'];

  if (clipName && assetName) {
    acc[clipName] = assetName;
  }
  return acc;
}, ClipNameAssetMap);

export default function CurrentlyPlayingList() {
  const { tracks, queuedClips, playingClips } = useContext(AbletonContext);
  // const { logger } = useContext(LoggerContext);

  return (
    <div className='flex flex-row justify-between'>
      {tracks?.map((track, index) => {
        const playing = playingClips[track];
        const queued = queuedClips[track];
        const clipName = (queued ?? playing ?? '').replace(/^\*\s?/, '');

        return (
          <div className='w-[15%]' key={index}>
            {track}
            <div className='h-[200px] mb-4'>
              <div
                className={`w-full h-full flex items-center text-center rounded-md border border-1 ${
                  queued && 'opacity-40 animate-pulse'
                }`}
              >
                <img
                  src={`icons/${ClipNameAssetMap[clipName]}`}
                  alt={(queued || playing) ?? 'icon'}
                  className={`w-full h-full object-cover rounded-md ${
                    queued && 'opacity-40 animate-pulse'
                  }`}
                />
              </div>
              {/* {playing || queued ? (
              ) : (
                <div className="w-full h-full object-cover rounded-md border border-1"></div>
              )} */}
            </div>
            <VolumeSlider track={track} />
          </div>
        );
      })}
    </div>
  );
}
