import { createContext, useEffect, useState, ReactNode } from 'react';

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const CountdownContext = createContext({ countdown: 15, resetCountdown: () => {} } as {
  countdown: number;
  resetCountdown: () => void;
});

export default function CountdownProvider({ children }: { children: ReactNode }) {
  const [ttr, setTtr] = useState(15);
  useEffect(() => {
    const timer = setInterval(() => {
      setTtr((ttr) => ttr - 1);
    }, 1000);

    if (ttr === 0) {
      setTtr(15);
    }

    return () => {
      clearInterval(timer);
    };
  });

  function resetCountdown() {
    setTtr(15);
  }

  return <CountdownContext.Provider value={{ countdown: ttr, resetCountdown }}>{children}</CountdownContext.Provider>;
}
