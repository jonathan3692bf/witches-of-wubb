import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import SocketioProvider from './contexts/socketio-provider';
import CountdownProvider from './contexts/countdown-provider';
import AbletonProvider from './contexts/ableton-provider';
import LoggerProvider from './contexts/logger-provider';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <LoggerProvider>
      <SocketioProvider>
        <AbletonProvider>
          <CountdownProvider>
            <App />
          </CountdownProvider>
        </AbletonProvider>
      </SocketioProvider>
    </LoggerProvider>
  </React.StrictMode>,
);
