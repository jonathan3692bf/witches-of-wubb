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
    <div className='w-full text-center flex flex-col'>
      <label htmlFor='default-range' className='block mb-2 text-sm font-medium '>
        Adjust tempo
      </label>
      <div className='flex items-center gap-8 text-lg mx-auto'>
        <span className=' text-gray-500 dark:text-gray-400'>{MIN_VALUE}</span>
        <input
          id='default-range'
          type='range'
          min={MIN_VALUE}
          max={MAX_VALUE}
          value={tempo}
          onChange={handleChange}
          className='w-[50vw] h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700'
        />

        <span className=' text-gray-500 dark:text-gray-400'>{MAX_VALUE}</span>
      </div>
      <div className='text-xl'>{tempo}</div>
    </div>
  );
}
