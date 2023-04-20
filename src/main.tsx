import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import SocketioProvider from './contexts/socketio-provider';
import CountdownProvider from './contexts/countdown-provider';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <SocketioProvider>
      <CountdownProvider>
        <App />
      </CountdownProvider>
    </SocketioProvider>
  </React.StrictMode>,
);
