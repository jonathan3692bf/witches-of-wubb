import { useContext } from 'react';
import { AbletonContext } from '../contexts/ableton-provider';
// import { LoggerContext } from '../contexts/logger-provider';

const MIN_VALUE = 0;
const MAX_VALUE = 0.7;
const RESET_VALUE = 0.6;
export default function VolumeSlider({ pillar }: { pillar: number }) {
  // const { logger } = useContext(LoggerContext);
  const { trackVolume, changeTrackVolume } = useContext(AbletonContext);
  const value = trackVolume[pillar] ? Math.min(trackVolume[pillar], 0.7) : 0;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newVolume = Number(e.target.value);
    changeTrackVolume({ pillar, volume: newVolume });
  }

  function resetVolume() {
    changeTrackVolume({ pillar, volume: RESET_VALUE });
  }

  return (
    <>
      <div id={`${pillar}-volume-range`} className='w-full max-h-full flex flex-col items-center'>
        <label
          htmlFor={`${pillar}-volume-range`}
          className={
            'block mb-2 text-sm font-medium stroke-black font-fondamento' +
            (pillar % 2 === 0 ? ' text-left' : '')
          }
        >
          Volume
        </label>
        <div className='flex flex-row text-lg max-h-full gap-4 justify-center h-[170px]'>
          <input
            id={`${pillar}-volume-range`}
            type='range'
            min={MIN_VALUE}
            max={MAX_VALUE}
            step={0.01}
            value={value}
            onChange={handleChange}
            // orient='vertical'
            className='h-2 w-[170px] cursor-pointer accent-red-800 custom-volume-slider'
          />
        </div>
        <button
          onClick={resetVolume}
          className='bg-white font-fondamento hover:bg-gray-100 text-gray-800 font-semibold px-1 w-min border border-gray-400 rounded shadow mt-4'
        >
          Reset
        </button>
      </div>
    </>
  );
}
