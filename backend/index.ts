import * as socketio from 'socket.io';
import { StartAbleton, ConnectOSCServer, AddWebSocket } from './ableton-api';
import logger from './utils/logger';
import * as nodeOSC from 'node-osc';

const wsPort: number = parseInt(process.env.WS_PORT || '3335', 10);
const oscPort: number = parseInt(process.env.OSC_PORT || '9000', 10);

async function main() {
  await StartAbleton();
  logger.info(`Websocket server is listening on localhost:${wsPort}`);
  const io: socketio.Server = new socketio.Server(wsPort, {
    cors: { origin: true },
  });
  const oscServer: nodeOSC.Server = new nodeOSC.Server(oscPort, '0.0.0.0');

  io.on('connection', (s: socketio.Socket) => {
    logger.info('Web client connected');

    s.on('disconnect', () => {
      logger.info('Web client disconnected');
    });
    AddWebSocket(s);
  });

  oscServer.on('listening', function () {
    logger.info(`OSC Server is listening on localhost:${oscPort}`);
    ConnectOSCServer(oscServer);
  });

  oscServer.on('message', function (msg, rinfo) {
    logger.trace(`OSC message: ${msg} from address: ${rinfo.address}`);
  });
}

main();
