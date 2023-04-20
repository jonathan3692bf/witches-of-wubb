/* eslint-disable no-console */
import { createContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';

export const SocketioContext = createContext({} as Socket);

export default function SocketioProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket>({} as Socket);
  useEffect(() => {
    if (!socket.connected) {
      const sock = io('localhost:3000');

      sock.on('connect', () => {
        setSocket(sock);
        console.log('Connected to socket.io server');
      });
    }
  }, [socket]);

  return <SocketioContext.Provider value={socket}>{children}</SocketioContext.Provider>;
}
