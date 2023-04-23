import { createContext, ReactNode } from 'react';
import Logger from 'js-logger';

// eslint-disable-next-line react-hooks/rules-of-hooks
Logger.useDefaults();
const logger = Logger.get('App');
// logger.setLevel(Logger.INFO);
logger.setLevel(Logger.DEBUG);
// eslint-disable-next-line @typescript-eslint/no-empty-function
export const LoggerContext = createContext({
  logger,
  enableDebug: () => {
    null;
  },
  disableDebug: () => {
    null;
  },
});

export default function LoggerProvider({ children }: { children: ReactNode }) {
  function enableDebug() {
    logger.info('Enabling debug mode');
    logger.setLevel(Logger.DEBUG);
  }

  function disableDebug() {
    logger.info('Disabling debug mode');
    logger.setLevel(Logger.INFO);
  }

  return (
    <LoggerContext.Provider value={{ logger, enableDebug, disableDebug }}>
      {children}
    </LoggerContext.Provider>
  );
}
