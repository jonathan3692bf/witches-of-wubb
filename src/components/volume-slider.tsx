import { useContext } from 'react';
import { AbletonContext } from '../contexts/ableton-provider';
// import { LoggerContext } from '../contexts/logger-provider';

const MIN_VALUE = 0;
const MAX_VALUE = 1;
export default function VolumeSlider({ pillar }: { pillar: number }) {
  const { trackVolume, changeTrackVolume } = useContext(AbletonContext);
  // const { logger } = useContext(LoggerContext);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newVolume = Number(e.target.value);
    changeTrackVolume({ pillar, volume: newVolume });
  }

  function resetVolume() {
    changeTrackVolume({ pillar, volume: 0.85 });
  }

  return (
    <>
      <div className='w-full text-center flex flex-col'>
        <label htmlFor={`${pillar}-volume-range`} className='block mb-2 text-sm font-medium '>
          Volume
        </label>
        <div className='flex flex-row text-lg h-full gap-4 justify-center'>
          <div className='flex flex-col justify-between'>
            {/* <div className=' text-gray-500 dark:text-gray-400'>{MAX_VALUE}</div>
            <div className=' text-gray-500 dark:text-gray-400'>{MIN_VALUE}</div> */}
          </div>
          {/* <div className='flex flex-col justify-center text-xl'>
            {Math.round((trackVolume[pillar] ?? 0) * 100)}
          </div> */}
          <input
            id={`${pillar}-volume-range`}
            type='range'
            min={MIN_VALUE}
            max={MAX_VALUE}
            step={0.01}
            value={trackVolume[pillar] ?? 0}
            onChange={handleChange}
            orient='vertical'
            className='h-[24vh] w-3 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-red-800'
          />
        </div>
        <button
          onClick={resetVolume}
          className='bg-white hover:bg-gray-100 text-gray-800 font-semibold px-1 w-min border border-gray-400 rounded shadow mx-auto mt-4'
        >
          Reset
        </button>
      </div>
    </>
  );
}
