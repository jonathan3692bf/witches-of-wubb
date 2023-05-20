import { createContext, useEffect, useState, ReactNode, useContext } from 'react';
import { io, Socket } from 'socket.io-client';
import { LoggerContext } from './logger-provider';
export const SocketioContext = createContext({} as Socket);

export default function SocketioProvider({ children }: { children: ReactNode }) {
  const { logger } = useContext(LoggerContext);
  const [socket, setSocket] = useState<Socket>({} as Socket);
  useEffect(() => {
    if (!socket.connected) {
      const sock = io(`localhost:${import.meta.env.VITE_WS_SERVER_PORT}`);

      sock.on('connect', () => {
        setSocket(sock);
        logger.debug('Connected to socket.io server');
      });
      sock.onAny((event, ...args) => {
        logger.debug(`${event} received with:`, args);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket.connected]);
  return <SocketioContext.Provider value={socket}>{children}</SocketioContext.Provider>;
}
