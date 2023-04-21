import { createContext, useEffect, useState, ReactNode, useContext } from 'react';
import { io, Socket } from 'socket.io-client';
import { LoggerContext } from './logger-provider';
export const SocketioContext = createContext({} as Socket);

export default function SocketioProvider({ children }: { children: ReactNode }) {
  const { logger } = useContext(LoggerContext);
  const [socket, setSocket] = useState<Socket>({} as Socket);
  useEffect(() => {
    if (!socket.connected) {
      const sock = io('localhost:3000');

      sock.on('connect', () => {
        setSocket(sock);
        logger.debug('Connected to socket.io server');
      });
    }
  }, [socket]);

  return <SocketioContext.Provider value={socket}>{children}</SocketioContext.Provider>;
}
