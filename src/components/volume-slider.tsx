import { useContext } from 'react';
import { AbletonContext } from '../contexts/ableton-provider';
// import { LoggerContext } from '../contexts/logger-provider';

const MIN_VALUE = 0;
const MAX_VALUE = 100;
export default function VolumeSlider({ track }: { track: string }) {
  const { trackVolume, changeTrackVolume } = useContext(AbletonContext);
  // const { logger } = useContext(LoggerContext);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newVolume = parseInt(e.target.value);
    changeTrackVolume(track, newVolume);
  }

  return (
    <>
      <div className='w-full text-center flex flex-col'>
        <label htmlFor='default-range' className='block mb-2 text-sm font-medium '>
          Adjust volume
        </label>
        <div className='flex flex-row text-lg h-full gap-4 justify-center'>
          <div className='flex flex-col justify-between'>
            <div className=' text-gray-500 dark:text-gray-400'>{MAX_VALUE}</div>
            <div className=' text-gray-500 dark:text-gray-400'>{MIN_VALUE}</div>
          </div>
          <input
            id='default-range'
            type='range'
            min={MIN_VALUE}
            max={MAX_VALUE}
            value={trackVolume[track] ?? 0}
            onChange={handleChange}
            // orient='vertical'
            className='h-[24vh] w-3 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700'
          />
          <div className='flex flex-col justify-center text-xl'>
            {Math.round(trackVolume[track] ?? 0)}
          </div>
        </div>
      </div>
    </>
  );
}
