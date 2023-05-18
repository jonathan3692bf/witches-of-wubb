import * as nodeOSC from 'node-osc';
import { sockets } from '../ableton-api';
import logger from '../utils/logger';
import { getPillarIPAddressFromIndex } from './incoming-events';

const LIGHTING_SERVER_ADDRESS = process.env.LIGHTING_SERVER_ADDRESS ?? '127.0.0.1'; // '192.168.1.145'
const LIGHTING_SERVER_PORT = Number(process.env.LIGHTING_SERVER_PORT ?? 9001); // 9000
const lightingClient = new nodeOSC.Client(LIGHTING_SERVER_ADDRESS, LIGHTING_SERVER_PORT);

export default function EmitEvent(eventName: string, data?: Record<any, any>) {
  logger.info(`Emitting event ${eventName} with data: ${JSON.stringify(data)}`);
  sockets?.forEach((socket) => {
    socket?.emit(eventName, data);
  });
  const pillarIP = data?.pillarAddress ?? getPillarIPAddressFromIndex(data?.pillar);

  lightingClient.send([`/${eventName}`, pillarIP], (err) => {
    if (err) logger.error(err);
  });
}
