import { useContext } from 'react';
import { AbletonContext } from '~/contexts/ableton-provider';
import VolumeSlider from './volume-slider';

import { getBackgroundColorFromType } from '~/lib/utils';
// import { LoggerContext } from '~/contexts/logger-provider';

export default function CurrentlyPlayingList({
  setIsModalOpen,
}: {
  setIsModalOpen: (state: boolean) => void;
}) {
  const { queuedClips, playingClips, stoppingClips, clipTempo } = useContext(AbletonContext);
  // const { logger } = useContext(LoggerContext);

  return (
    <div id='inner_playing' className='h-[50vh] w-screen relative'>
      <div
        id='pillars'
        className='h-[50%] mt-5 w-screen grid grid-cols-2 gap-10 justify-items-center absolute inset-0'
      >
        {[1, 2, 3, 4]?.map((pillar, index) => {
          const playing = playingClips[index];
          const queued = queuedClips[index];
          const stopping = stoppingClips[index];
          const info = queued ?? playing ?? stopping;
          let clipName = info?.clipName?.trimStart() ?? '';
          if (info?.artist && info?.songTitle) {
            clipName = `${info?.artist} - ${info?.songTitle}`;
          } else {
            clipName = '';
          }

          // determine the color-blur color based on the track type
          const colorBlurClass = getBackgroundColorFromType(info?.type);

          return (
            <div id={`pillar-${pillar}`} className='w-[50%] text-center' key={pillar}>
              <div className='object-scale-down mb-4 grid grid-cols-4'>
                <div id='bpm' className='col-start-2 col-span-3'>
                  BPM{clipTempo[index] ? ` - (${Math.ceil(clipTempo[index] as number)})` : ``}
                </div>
                <div className='object-scale-down max-h-full max-w-full mr-12'>
                  <VolumeSlider pillar={index} />
                </div>
                <div className='relative col-span-3 flex justify-items-center'>
                  <div
                    id='color-blur'
                    className={`absolute -inset-0 rounded-lg blur-xl ${colorBlurClass}`}
                  ></div>
                  <div
                    id='frame_full'
                    className='max-h-[85%] max-w-[85%] border m-auto border-black relative'
                  >
                    <div
                      id='frame_bg'
                      className={`absolute -inset-0 object-scale-down max-h-[90%] max-w-[90%] bg-white border m-auto text-center rounded-md border-1 ${
                        (queued || stopping) && 'animate-pulse'
                      }`}
                    >
                      {info?.assetName ? (
                        <img
                          src={`public/ingredients/${info?.assetName}`}
                          // src={`icons/magic_icon_bass_342c1a64-2dd6-40ac-b51d-003cabe29068.png`}
                          alt={info?.assetName ?? 'icon'}
                          className={`w-full h-full object-cover rounded-md ${
                            queued && 'opacity-40 animate-pulse'
                          }`}
                        />
                      ) : null}
                    </div>
                    <div
                      id='frame'
                      className='object-scale-down max-h-full max-w-full relative scale-150'
                    >
                      <img src='/images/frame_576_v2.png' alt='Frame'></img>
                    </div>
                  </div>
                </div>
                {/* {playing || queued ? (
                  ) : (
                    <div className="w-full h-full object-cover rounded-md border border-1"></div>
                  )} */}
                <div
                  id='clip-name'
                  className='justify-center col-start-2 col-span-3 -inset-0 h-[18px] max-h-full max-w-full mt-6 text-center text-xs rounded-md border border-1'
                >
                  {clipName}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button
        data-testid='cauldron'
        onClick={() => {
          setIsModalOpen(true);
        }}
        className='absolute top-[10%] left-[36%] h-[400px]'
      >
        <img
          className='object-scale-down h-full'
          src='/images/cauldron-hottub-crop.gif'
          alt='Cauldron'
        />
      </button>
    </div>
  );
}
