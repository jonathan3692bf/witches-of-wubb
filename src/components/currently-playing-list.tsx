import { useContext } from 'react';
import { AbletonContext } from '~/contexts/ableton-provider';
import VolumeSlider from './volume-slider';
import cauldrongif from '../assets/images/cauldron-hottub.gif';
import frame from '../assets/images/frame_576_v2.png';

import { ClipTypes } from 'backend/types';
// import { LoggerContext } from '~/contexts/logger-provider';

export default function CurrentlyPlayingList() {
  const { queuedClips, playingClips, stoppingClips } = useContext(AbletonContext);
  // const { logger } = useContext(LoggerContext);

  return (
    <div className='h-[75vh] w-screen'>
      <div className='h-[75%] w-screen grid grid-cols-2 gap-10 justify-items-center absolute inset-0 z-10'>
        {[1, 2, 3, 4]?.map((pillar, index) => {
          const playing = playingClips[index];
          const queued = queuedClips[index];
          const stopping = stoppingClips[index];
          const info = queued ?? playing ?? stopping;
          let clipName = info?.clipName?.trimStart() ?? '';
          if (info?.artist && info?.songTitle) {
            clipName = `${info?.artist} - ${info?.songTitle}`;
          }

          // determine the color-blur color based on the track type
          let colorBlurClass = 'bg-purple-700';
          switch (playingClips[index]?.type) {
            case ClipTypes.Vox:
              colorBlurClass = 'bg-red-700';
              break;
            case ClipTypes.Bass:
              colorBlurClass = 'bg-green-700';
              break;
            case ClipTypes.Drums:
              colorBlurClass = 'bg-blue-700';
              break;
            case ClipTypes.Melody:
              colorBlurClass = 'bg-yellow-700';
              break;
            default:
              colorBlurClass = 'bg-purple-700';
          }
          return (
            <div className='w-[50%]' key={pillar}>
              Pillar {pillar}
              <div className='object-scale-down max-h-full max-w-full mb-4 grid grid-cols-4'>
                <div className='object-scale-down max-h-full max-w-full m-auto'>
                  <VolumeSlider pillar={index} />
                </div>
                <div className='relative col-span-3 flex justify-items-center'>
                  <div
                    id='color-blur'
                    className={`absolute -inset-0 rounded-lg blur-xl ${colorBlurClass}`}
                  ></div>
                  <div className='max-h-[85%] max-w-[85%] border m-auto border-black relative'>
                    <div
                      className={`absolute -inset-0 z-30 object-scale-down max-h-[90%] max-w-[90%] bg-white border m-auto text-center rounded-md border-1 ${
                        (queued || stopping) && 'animate-pulse'
                      }`}
                    >
                      {/* <img
                        src={`icons/${ClipNameAssetMap[clipName]}`}
                        alt={(queued || playing) ?? 'icon'}
                        className={`w-full h-full object-cover rounded-md ${
                          queued && 'opacity-40 animate-pulse'
                        }`}
                      /> */}
                    </div>
                    <div
                      id='frame'
                      className='object-scale-down max-h-full max-w-full relative z-40 scale-150'
                    >
                      <img src={frame} alt='Frame'></img>
                    </div>
                  </div>
                </div>
                {/* {playing || queued ? (
                  ) : (
                    <div className="w-full h-full object-cover rounded-md border border-1"></div>
                  )} */}
                <div className='justify-center col-start-2 col-span-3 -inset-0 z-40 max-h-full max-w-full mt-6 text-center text-xs rounded-md border border-1'>
                  {clipName}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className='h-[75%] w-screen grid justify-items-center relative z-0'>
        <img
          className='object-scale-down max-h-full max-w-[30%] m-auto'
          src={cauldrongif}
          alt='Cauldron'
        ></img>
      </div>
    </div>
  );
}
