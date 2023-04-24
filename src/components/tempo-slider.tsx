import { useContext } from 'react';
import { AbletonContext } from '../contexts/ableton-provider';
// import { LoggerContext } from '../contexts/logger-provider';

const MIN_VALUE = 75;
const MAX_VALUE = 155;
export default function TempoSlider() {
  const { changeTempo, tempo, clipTempo, tracks } = useContext(AbletonContext);
  // const { logger } = useContext(LoggerContext);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newTempo = parseInt(e.target.value);
    changeTempo(newTempo);
  }

  return (
    <div className='w-full text-center flex flex-col'>
      <label htmlFor='tempo-slider' className='block mb-2 text-sm font-medium '>
        Adjust tempo
      </label>
      <div className='flex items-center gap-8 text-lg mx-auto'>
        <span className=' text-gray-500 dark:text-gray-400'>{MIN_VALUE}</span>
        <input
          id='tempo-slider'
          type='range'
          min={MIN_VALUE}
          max={MAX_VALUE}
          value={tempo}
          onChange={handleChange}
          className='w-[50vw] h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700'
        />

        <span className=' text-gray-500 dark:text-gray-400'>{MAX_VALUE}</span>
      </div>
      <div className='text-xl'>{Math.ceil(tempo)}</div>
      <div className='flex gap-8 mx-auto'>
        {tracks?.map((track, index) => {
          return (
            <button
              disabled={!clipTempo[track]}
              key={index}
              onClick={() => clipTempo[track] && changeTempo(clipTempo[track] as number)}
              className='bg-white hover:bg-gray-100 disabled:bg-gray-500 text-gray-800 font-semibold px-1 w-min border border-gray-400 rounded shadow mx-auto mt-4'
            >
              {clipTempo[track] ? `${track} (${Math.ceil(clipTempo[track] as number)})` : track}
            </button>
          );
        })}
      </div>
    </div>
  );
}
