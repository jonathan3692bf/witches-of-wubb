import { useContext } from 'react';
import { AbletonContext } from '~/contexts/ableton-provider';
import VolumeSlider from './volume-slider';
// import { LoggerContext } from '~/contexts/logger-provider';

export default function CurrentlyPlayingList() {
  const { queuedClips, playingClips, stoppingClips } = useContext(AbletonContext);
  // const { logger } = useContext(LoggerContext);

  return (
    <div className='flex flex-row justify-between'>
      {[1, 2, 3, 4]?.map((pillar, index) => {
        const playing = playingClips[index];
        const queued = queuedClips[index];
        const stopping = stoppingClips[index];
        const info = queued ?? playing ?? stopping;
        const clipName = info?.clipName?.replace(/^\*/, '').trimStart() ?? '';

        return (
          <div className='w-[15%]' key={pillar}>
            Pillar {pillar}
            <div className='h-[200px] mb-4'>
              <div
                className={`w-full h-full flex items-center text-center rounded-md border border-1 ${
                  (queued || stopping) && 'opacity-40 animate-pulse'
                }`}
              >
                {/* <img
                  src={`icons/${ClipNameAssetMap[clipName]}`}
                  alt={(queued || playing) ?? 'icon'}
                  className={`w-full h-full object-cover rounded-md ${
                    queued && 'opacity-40 animate-pulse'
                  }`}
                /> */}
                {clipName}
              </div>
              {/* {playing || queued ? (
              ) : (
                <div className="w-full h-full object-cover rounded-md border border-1"></div>
              )} */}
            </div>
            <VolumeSlider pillar={index} />
          </div>
        );
      })}
    </div>
  );
}
