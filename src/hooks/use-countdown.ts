import { useContext } from 'react';
import { CountdownContext } from '../contexts/countdown-provider';

export default function useCountdown() {
  const { countdown, resetCountdown } = useContext(CountdownContext);

  return { countdown, resetCountdown };
}
