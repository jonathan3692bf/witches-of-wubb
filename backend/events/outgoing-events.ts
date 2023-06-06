import * as nodeOSC from 'node-osc';
import { restartTimeoutTimer, sockets } from '../ableton-api';
import logger from '../utils/logger';

const LIGHTING_SERVER_ADDRESS = process.env.LIGHTING_SERVER_ADDRESS as string;
const LIGHTING_SERVER_PORT = Number(process.env.LIGHTING_SERVER_PORT as string);
const lightingClient = new nodeOSC.Client(LIGHTING_SERVER_ADDRESS, LIGHTING_SERVER_PORT);

function SendOSCMessage(address: string, data?: Record<any, any>) {
  const message = new nodeOSC.Message(address);

  if (data?.type) {
    message.append(data.type);
  }

  lightingClient.send(message, (err) => {
    if (err) logger.error(err);
  });
}

function Emit(eventName: string, data?: Record<any, any>) {
  logger.debug(`Emitting event ${eventName} with data: ${JSON.stringify(data)}`);
  sockets?.forEach((socket) => {
    socket?.emit(eventName, data);
  });
  if (data?.pillar > -1) {
    const pillar = data?.pillar + 1;
    SendOSCMessage(`/${pillar}/${eventName}`, data);
  } else {
    SendOSCMessage(`/${eventName}`, data);
  }
}

export function EmitEventWithoutResetingTimout(eventName: string, data?: Record<any, any>) {
  Emit(eventName, data);
}

export default function EmitEvent(eventName: string, data?: Record<any, any>) {
  restartTimeoutTimer();
  Emit(eventName, data);
}
