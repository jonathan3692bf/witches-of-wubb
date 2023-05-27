import type { ArgumentType, RequestInfo } from 'node-osc';
import { Socket } from 'socket.io';
import { RFIDToClipMap } from '../utils/get-clip-from-rfid';
import logger from '../utils/logger';
import EmitEvent from './outgoing-events';
import {
  GetTempo,
  GetTrackVolumes,
  QueueClip,
  SetTempo,
  SetTrackVolume,
  StopOrRemoveClipFromQueue,
  playingClips,
  queuedClips,
  trackVolumes,
} from '../ableton-api';
import {
  BrowserClipInfo,
  BrowserClipInfoList,
  SetTrackVolumeInputType,
  TagDetectionData,
  TrackVolumesType,
} from '../types';

export const IP_ADDRESS_TO_PILLAR_INDEX_MAP: Record<string, number> = {
  '192.168.0.101': 1,
  '192.168.0.102': 2,
  '192.168.0.103': 3,
  '192.168.0.104': 4,
};

export function getPillarIPAddressFromIndex(index: number) {
  return Object.entries(IP_ADDRESS_TO_PILLAR_INDEX_MAP).find(([_, i]) => i === index)?.[0] ?? '';
}

// This is a list of incoming events, their source, and their handlers
const incomingEvents: { [key: string]: any } = {
  '/new/tag': {
    osc: true,
    websocket: true,
    oscHandler: (message: [string, ...ArgumentType[]], rinfo: RequestInfo) => {
      const [_, tag] = message;
      handleNewTag(tag as string, rinfo.address);
    },
    wsHandler: (data: TagDetectionData) => {
      const pillarAddress = getPillarIPAddressFromIndex(data.pillar);
      handleNewTag(data.rfid, pillarAddress);
    },
  },
  '/departed/tag': {
    osc: true,
    websocket: true,
    oscHandler: (message: [string, ...ArgumentType[]], rinfo: RequestInfo) => {
      const [_, tag] = message;
      handleDepartedTag(tag as string, rinfo.address);
    },
    wsHandler: (data: TagDetectionData) => {
      const pillarAddress = getPillarIPAddressFromIndex(data.pillar);
      handleDepartedTag(data.rfid, pillarAddress);
    },
  },
};

function handleNewTag(rfid: string, requestAddress: string) {
  logger.info(`New tag detected with ${rfid} from machine: ${requestAddress}`);
  try {
    const clipMetadata = RFIDToClipMap[rfid as string];
    if (clipMetadata) {
      logger.info(`RFID ${rfid} maps to clip ${clipMetadata.clipName} > type ${clipMetadata.type}`);
      const pillar = IP_ADDRESS_TO_PILLAR_INDEX_MAP[requestAddress];
      EmitEvent('ingredient_detected', { ...clipMetadata, pillar, requestAddress });
      QueueClip(clipMetadata, pillar);
    }
  } catch (err) {
    logger.error("Couldn't find track from RFID tag");
  }
}

function handleDepartedTag(rfid: string, requestAddress: string) {
  logger.info(`Departed tag detected with ${rfid} from machine: ${requestAddress}`);
  try {
    const clipMetadata = RFIDToClipMap[rfid as string];
    if (clipMetadata) {
      logger.info(`RFID ${rfid} maps to clip ${clipMetadata.clipName} > type ${clipMetadata.type}`);
      const pillar = IP_ADDRESS_TO_PILLAR_INDEX_MAP[requestAddress];

      EmitEvent('ingredient_removed', { ...clipMetadata, pillar, requestAddress });
      StopOrRemoveClipFromQueue(clipMetadata.clipName, pillar);
    }
  } catch (err) {
    logger.error("Couldn't find track from RFID tag");
  }
}

export function AddSocketEventsHandlers(socket: Socket) {
  Object.entries(incomingEvents).forEach(([eventName, event]) => {
    if (event.websocket) {
      socket.on(eventName, event.wsHandler);
    }
  });

  socket.on('get_playing_clips', (_, callback) => {
    const clips: BrowserClipInfoList = playingClips.map((data) => {
      if (data) {
        const { pillar, clipName, type, assetName } = data;
        const bci: BrowserClipInfo = { pillar, clipName, type, assetName };
        return bci;
      }
      return data;
    });
    callback(clips);
  });
  socket.on('get_queued_clips', (_, callback) => {
    const clips: BrowserClipInfoList = queuedClips.map((data) => {
      if (data) {
        const { pillar, clipName, type, assetName } = data;
        const bci: BrowserClipInfo = { pillar, clipName, type, assetName };
        return bci;
      }
      return data;
    });
    callback(clips);
  });
  socket.on('get_tempo', async (_, callback) => {
    const tempo = await GetTempo();
    callback(tempo);
  });
  socket.on('set_tempo', (tempo: number, callback) => {
    SetTempo(tempo);
    callback(tempo);
  });
  socket.on('get_track_volumes', async (_, callback) => {
    if (!trackVolumes?.length) await GetTrackVolumes();
    const formattedVolumes: TrackVolumesType = trackVolumes.map(
      (trackVolume) => trackVolume?.raw.value,
    );
    logger.info(`Emitting track volumes: ${formattedVolumes}`);
    callback(formattedVolumes);
  });
  socket.on('set_track_volume', async ({ pillar, volume }: SetTrackVolumeInputType) => {
    await SetTrackVolume(pillar, volume);
  });
  return socket;
}

export function OSCEventHandlers(message: [string, ...ArgumentType[]], rinfo: RequestInfo) {
  const [eventName] = message;
  if (incomingEvents[eventName]?.osc) {
    incomingEvents[eventName].oscHandler(message, rinfo);
  }
}
