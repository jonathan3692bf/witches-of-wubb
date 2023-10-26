import { useContext } from 'react';
import { AbletonContext } from '../contexts/ableton-provider';
// import { LoggerContext } from '../contexts/logger-provider';

const MIN_VALUE = 75;
const MAX_VALUE = 155;
export default function TempoSlider() {
  const { changeTempo, tempo } = useContext(AbletonContext);
  // const { logger } = useContext(LoggerContext);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newTempo = parseInt(e.target.value);
    changeTempo(newTempo);
  }

  return (
    <div className='text-center flex flex-col items-center gap-4 min-h-[180px] relative'>
      <label
        htmlFor='tempo-slider'
        className='absolute2 block text-3xl font-medium stroke-black font-fondamento mb-3'
      >
        <strong>{Math.ceil(tempo)}</strong> BPM
      </label>
      <div className='flex items-center text-lg h-[100px]'>
        <span className='relative text-gray-500 dark:text-gray-400 self-end left-[20px]'>
          {MIN_VALUE}
        </span>
        <input
          id='tempo-slider'
          type='range'
          min={MIN_VALUE}
          max={MAX_VALUE}
          value={tempo}
          onChange={handleChange}
          className='w-[31vw] h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 custom-tempo-slider'
        />
        <span className='relative text-gray-500 dark:text-gray-400 self-end right-[20px] z-[-1]'>
          {MAX_VALUE}
        </span>
      </div>
    </div>
  );
}
