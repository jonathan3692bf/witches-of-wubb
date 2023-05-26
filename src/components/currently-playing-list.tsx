import { useContext } from 'react';
import { AbletonContext } from '~/contexts/ableton-provider';
import VolumeSlider from './volume-slider';
import cauldrongif from '../assets/images/cauldron-gif.gif';
import frame from '../assets/images/black-frame.png';
// import { LoggerContext } from '~/contexts/logger-provider';

export default function CurrentlyPlayingList() {
  const { queuedClips, playingClips, stoppingClips } = useContext(AbletonContext);
  // const { logger } = useContext(LoggerContext);

  return (
    <div className='h-[80vh] w-screen'>
      <div className='h-[80%] w-screen grid grid-cols-2 gap-20 justify-items-center absolute inset-0 z-10'>
        {[1, 2, 3, 4]?.map((pillar, index) => {
          const playing = playingClips[index];
          const queued = queuedClips[index];
          const stopping = stoppingClips[index];
          const info = queued ?? playing ?? stopping;
          const clipName = info?.clipName?.replace(/^\*/, '').trimStart() ?? '';

          return (
            <div className='w-[50%]' key={pillar}>
              Pillar {pillar}
              <div className='object-scale-down max-h-full max-w-full mb-4 grid grid-cols-4'>
                <div className='object-scale-down max-h-full max-w-full m-auto'>
                  <VolumeSlider pillar={index} />
                </div>
                <div className='relative flex col-span-3 flex justify-items-center'>
                  <div className='absolute -inset-0 bg-purple-700 rounded-lg blur-xl'></div>
                  <div className='max-h-[85%] max-w-[85%] border m-auto border-black relative'>
                    <div
                      className={`absolute -inset-0 z-30 object-scale-down max-h-[90%] max-w-[90%] bg-white border m-auto text-center rounded-md border border-1 ${
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
                      {clipName}
                    </div>
                    <div className='object-scale-down max-h-full max-w-full relative z-40'>
                      <img src={frame} alt='Frame'></img>
                    </div>
                  </div>
                </div>
                {/* {playing || queued ? (
              ) : (
                <div className="w-full h-full object-cover rounded-md border border-1"></div>
              )} */}
              </div>
            </div>
          );
        })}
      </div>

      <div className='h-[75%] w-screen grid justify-items-center relative z-0'>
        <img
          className='object-scale-down max-h-full max-w-full m-auto'
          src={cauldrongif}
          alt='Cauldron'
        ></img>
      </div>
    </div>
  );
}
