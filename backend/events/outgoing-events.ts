import * as nodeOSC from 'node-osc';
import { sockets } from '../ableton-api';
import logger from '../utils/logger';

const LIGHTING_SERVER_ADDRESS = process.env.LIGHTING_SERVER_ADDRESS as string;
const LIGHTING_SERVER_PORT = Number(process.env.LIGHTING_SERVER_PORT as string);
const lightingClient = new nodeOSC.Client(LIGHTING_SERVER_ADDRESS, LIGHTING_SERVER_PORT);

export default function EmitEvent(eventName: string, data?: Record<any, any>) {
  logger.info(`Emitting event ${eventName} with data: ${JSON.stringify(data)}`);
  sockets?.forEach((socket) => {
    socket?.emit(eventName, data);
  });
  if (data?.pillar > -1) {
    const pillar = data?.pillar + 1;
    const message = new nodeOSC.Message(`/${pillar}/${eventName}`);

    if (data?.type) {
      message.append(data.type);
    }

    lightingClient.send(message, (err) => {
      if (err) logger.error(err);
    });
  }
}
