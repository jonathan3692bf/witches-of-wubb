import { useContext } from 'react';
import { AbletonContext } from '~/contexts/ableton-provider';
import VolumeSlider from './volume-slider';

import { getBackgroundColorFromType } from '~/lib/utils';
// import { LoggerContext } from '~/contexts/logger-provider';

export default function CurrentlyPlayingList() {
  const {
    queuedClips,
    playingClips,
    stoppingClips,
    clipTempo,
    masterKey,
    changeMasterKey,
    keylock,
    changeKeylock,
  } = useContext(AbletonContext);
  // const { logger } = useContext(LoggerContext);

  function rotateKeyBackwards() {
    if (!masterKey) return;
    const pitch = masterKey.match(/[A-Z]/g)?.[0] ?? '';
    const key = Number(masterKey.match(/\d+/g)?.[0] ?? 1);
    if (pitch.toLowerCase() === 'b') {
      return changeMasterKey(`${key}A`);
    } else {
      if (key === 1) {
        return changeMasterKey(`12B`);
      } else {
        return changeMasterKey(`${key - 1}B`);
      }
    }
  }

  function rotateKeyForwards() {
    if (!masterKey) return;
    const pitch = masterKey.match(/[A-Z]/g)?.[0] ?? '';
    const key = Number(masterKey.match(/\d+/g)?.[0] ?? 1);
    if (pitch.toLowerCase() === 'a') {
      return changeMasterKey(`${key}B`);
    } else {
      if (key === 12) {
        return changeMasterKey(`1A`);
      } else {
        return changeMasterKey(`${key + 1}A`);
      }
    }
  }

  return (
    <div id='inner_playing' className='w-screen relative'>
      <div className='my-5 flex gap-4 items-center justify-center font-medium stroke-black font-fondamento text-lg'>
        <input
          id='keylock'
          name='keylock'
          checked={keylock}
          type='checkbox'
          className='ml-5'
          onChange={() => changeKeylock(!keylock)}
        />
        <label htmlFor='keylock'>Auto adjust tracks to key</label>

        {masterKey && (
          <button className='p-3' disabled={!masterKey} onClick={rotateKeyBackwards}>
            &lt;
          </button>
        )}
        <h2>{masterKey || 'N/A'}</h2>
        {masterKey && (
          <button className='p-3' disabled={!masterKey} onClick={rotateKeyForwards}>
            &gt;
          </button>
        )}
      </div>
      <div id='pillars' className='mt-5 w-screen grid grid-cols-2 gap-20 justify-items-center'>
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
            <div id={`pillar-${pillar}`} className='w-[70%] text-center' key={pillar}>
              <div className='object-scale-down grid grid-cols-4'>
                <div
                  id='bpm'
                  className={`col-start-${
                    index % 2 === 0 ? 2 : 1
                  } col-span-3 h-[50px] font-fondamento`}
                >
                  {clipTempo[index] ? `${Math.ceil(clipTempo[index] as number)} ` : ``}BPM
                </div>
                {index % 2 === 0 ? (
                  <div className='object-scale-down max-h-full max-w-full mr-20'>
                    <VolumeSlider pillar={index} />
                  </div>
                ) : null}
                <div className='relative col-span-3 flex justify-items-center'>
                  <div
                    id='color-blur'
                    className={`scale-[120%] absolute -inset-0 rounded-lg blur-xl ${colorBlurClass}`}
                  ></div>
                  <div id='frame_full' className=' border m-auto border-black relative'>
                    <div
                      id='frame_bg'
                      className={`absolute -inset-0 object-scale-down bg-black/25 border m-auto text-center rounded-md border-1 ${
                        (queued || stopping) && 'animate-pulse'
                      }`}
                    >
                      {info?.assetName ? (
                        <img
                          src={`/ingredients/${info?.assetName}`}
                          alt={info?.assetName ?? 'icon'}
                          className={`w-full h-full object-cover rounded-md ${
                            queued && 'opacity-40 animate-pulse'
                          }`}
                        />
                      ) : null}
                    </div>
                    <div
                      id='frame'
                      className='object-scale-down max-h-full max-w-full relative scale-[135%]'
                    >
                      <img src='/images/frame_576_v2.png' alt='Frame'></img>
                    </div>
                  </div>
                </div>
                {index % 2 === 1 ? (
                  <div className='object-scale-down max-h-full max-w-full ml-20'>
                    <VolumeSlider pillar={index} />
                  </div>
                ) : null}
                {/* {playing || queued ? (
                  ) : (
                    <div className="w-full h-full object-cover rounded-md border border-1"></div>
                  )} */}
              </div>
              {index % 2 === 0 ? (
                <div className='grid grid-cols-4'>
                  <div
                    id='clip-name'
                    className='mt-[60px] stroke-black font-fondamento justify-center col-start-2 col-span-3 h-[18px] max-h-full max-w-full text-center text-xs rounded-md border border-1'
                  >
                    {clipName}
                  </div>
                </div>
              ) : null}
              {index % 2 === 1 ? (
                <div className='grid grid-cols-4'>
                  <div
                    id='clip-name'
                    className='mt-[60px] stroke-black font-fondamento justify-center col-start-1  col-span-3 h-[18px] max-h-full max-w-full text-center text-xs rounded-md border border-1'
                  >
                    {clipName}
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      <div data-testid='cauldron' className='scale-95 absolute top-[20%] left-[36.5%] h-[400px]'>
        <img
          className='object-scale-down h-full'
          src='/images/cauldron-hottub-crop.gif'
          alt='Cauldron'
        />
      </div>
    </div>
  );
}
