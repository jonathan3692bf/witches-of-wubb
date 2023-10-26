import { useContext } from 'react';
import { AbletonContext } from '~/contexts/ableton-provider';

export function KeyAdjuster() {
  const { masterKey, changeMasterKey, keylock, changeKeylock } = useContext(AbletonContext);
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
    <div className='w-100 my-5 flex gap-4 items-center justify-center font-medium stroke-black font-fondamento text-3xl'>
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
  );
}
