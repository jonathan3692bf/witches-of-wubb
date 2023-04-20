// create a component which displays the results of useResetTimer and a button to call the reset function

import useResetTimer from '../hooks/use-countdown';

export default function Test() {
  const { countdown, resetCountdown } = useResetTimer();
  return (
    <div className="flex flex-col gap-4">
      <div>Countdown: {countdown}</div>
      <button onClick={resetCountdown} className="rounded bg-blue-500 cursor-pointer" type="button">
        Reset countdown
      </button>
    </div>
  );
}
