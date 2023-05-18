import { Ableton } from 'ableton-js';
import { Track } from 'ableton-js/ns/track';
import { DeviceParameter } from 'ableton-js/ns/device-parameter';
import * as socketio from 'socket.io';
import * as nodeOSC from 'node-osc';
import throttle from 'lodash.throttle';
import memoize from 'lodash.memoize';
import logger from './utils/logger';
import { FindNextPhraseLeader } from './utils/is-new-phrase-leader';
import {
  ClipBoard,
  ClipInfo,
  ClipList,
  ClipMetadataType,
  ClipTypes,
  TrackNames,
  WarpMarker,
} from './types';

import EmitEvent from './events/outgoing-events';
import { AddSocketEventsHandlers, OSCEventHandlers } from './events/incoming-events';
import { ClipNameToInfoMap } from './utils/get-clip-from-rfid';

export function getTrackName(track: number) {
  return Object.values(TrackNames)[track];
}

export function getTrackIndex(track: string) {
  return Object.values(TrackNames).indexOf(track);
}

let oscServer: nodeOSC.Server;
export const sockets: socketio.Socket[] = [];

export let allAbletonClips: ClipBoard;
export let tracks: Track[];
export let trackVolumes: Array<DeviceParameter>;
export let phraseLeader: ClipInfo;
export let cleanUpPhraseLeaderEventListener: any;
export const stoppingClips: ClipList = [];
export const playingClips: ClipList = [];
export const triggeredClips: ClipList = [];
export const queuedClips: ClipList = [];

export const ableton = new Ableton({ logger: logger });

export const TRIGGER_ORDER = [ClipTypes.Drums, ClipTypes.Melody, ClipTypes.Bass, ClipTypes.Vox];

export async function StartAbleton() {
  logger.info('Starting AbletonJS');
  await ableton.start();
  await GetTracksAndClips();
  await GetTrackVolumes();
}

export function ConnectOSCServer(server: nodeOSC.Server) {
  oscServer = server;
  oscServer.on('message', OSCEventHandlers);
}

const MemoizedClipLocation = memoize((clipName, pillar) =>
  allAbletonClips[pillar].find((clip) => {
    // console.log('Looking for clip', clipName, 'against', clip?.raw.name);

    return clip?.raw.name.trim() === clipName.trim();
  }),
);

export function AddWebSocket(s: socketio.Socket) {
  s.on('disconnect', () => {
    logger.info('Web client disconnected');
    const disconnectedSocketIndex = sockets.findIndex((socket) => socket === s);
    sockets.splice(disconnectedSocketIndex, 1);
  });
  // s.onAny((eventName, ...args) => {
  //   logger.info(`Received event ${eventName} with data: ${args}`);
  // });
  sockets.push(s);
  AddSocketEventsHandlers(s);
}

export function QueueClip(clipMetadata: ClipMetadataType, pillar: number) {
  const { clipName } = clipMetadata;
  logger.info(`Begin queing clip ${clipName}`);
  if (queuedClips[pillar]?.clipName.replace(/[* ]/g, '') === clipName.replace(/[* ]/g, '')) {
    logger.info(`Clip ${clipName} is already queued`);
    return;
  }
  const clip = MemoizedClipLocation(clipName, pillar);

  if (clip) {
    // if no items are playing, skip the queue
    const silence = playingClips.every((clip) => !clip);
    if (silence) {
      logger.info(`Triggering clip "${clipName}" on pillar ${pillar}`);
      clip?.fire();
    } else {
      logger.info(`Queuing clip "${clipName}" on pillar ${pillar}`);
      queuedClips[pillar] = {
        clip,
        pillar,
        ...clipMetadata,
      };
      EmitEvent('clip_is_queued', {
        pillar,
        ...clipMetadata,
      });
    }
  }
}

export function TriggerQueuedClips() {
  logger.info(`Begin triggering clip queue`);
  const queueCopy = queuedClips.slice().filter((clip) => clip);
  queueCopy.sort((a, b) => {
    if (!a || !b) return 0;
    return TRIGGER_ORDER.indexOf(a.type) - TRIGGER_ORDER.indexOf(b.type);
  });

  // shift items out of the queue and into the triggeredClips list
  while (queueCopy.length) {
    const item = queueCopy.shift();
    if (!item) continue;
    logger.info(`Triggering clip "${item.clip.raw.name}" on pillar ${item.pillar} `);
    item.clip.fire();
    queuedClips[item.pillar] = null;
  }
}

export async function StopOrRemoveClipFromQueue(clipName: string, pillar: number) {
  logger.trace(`Try to stop or unqueue clip ${clipName}`);
  const playingClip = playingClips[pillar];
  const queuedClip = queuedClips[pillar];
  if (playingClip?.clipName.replace(/[* ]/g, '') === clipName.replace(/[* ]/g, '')) {
    logger.info(`Stopping clip "${clipName}" on pillar ${pillar}`);
    stoppingClips[pillar] = playingClip;
    // clip.stop() won't work because of looping: stop the whole track instead.
    EmitEvent('clip_is_stopping', {
      ...playingClip,
      clip: undefined,
    });
    await tracks[pillar].sendCommand('stop_all_clips');

    playingClips[pillar] = null;
    if (playingClip.clipName.replace(/[* ]/g, '') === phraseLeader.clipName.replace(/[* ]/g, '')) {
      // Find the next phrase leader, check if such a clip is playing,
      // then promote that clip to phrase leader else trigger queued clips and let god sort it out.
      const promotedClip = FindNextPhraseLeader(playingClips);
      if (promotedClip) {
        AddPhraseLeader(promotedClip);
      } else {
        TriggerQueuedClips();
      }
    }
  } else {
    // check if the clip is queued
    if (queuedClip?.clipName.replace(/[* ]/g, '') === clipName.replace(/[* ]/g, '')) {
      logger.info(`Removing clip from queue "${clipName}" on pillar ${pillar}`);
      queuedClips[pillar] = null;
      EmitEvent('clip_is_unqueued', {
        ...queuedClip,
        clip: undefined,
      });
    } else {
      logger.debug(`Clip ${clipName} is neither playing or queue`);
    }
  }
}

export async function AddPhraseLeader(newPhraseLeader: ClipInfo) {
  if (cleanUpPhraseLeaderEventListener) cleanUpPhraseLeaderEventListener();
  phraseLeader = newPhraseLeader;

  const { clip, clipName, pillar } = newPhraseLeader;
  logger.info(`New phrase leader "${clipName}" on pillar ${pillar}`);

  // figure out when this clip is about to end
  const endTime = await clip.get('loop_end');
  logger.debug(`Loop end on pillar ${pillar} > "${clipName}" | ${endTime}`);
  cleanUpPhraseLeaderEventListener = await clip.addListener(
    'playing_position',
    throttle(
      function (clip: ClipInfo, endTime: number, currentTime: number) {
        if (currentTime >= endTime - 1) {
          logger.info(
            `Clip ending soon on pillar ${clip.pillar} > "${clip.clipName}" | ${currentTime} / ${endTime}`,
          );
          if (cleanUpPhraseLeaderEventListener) cleanUpPhraseLeaderEventListener();
          TriggerQueuedClips();
        }
      }.bind({}, newPhraseLeader, endTime),
      300,
    ),
  );
}

export const GetTracksAndClips = async () => {
  logger.info('Fetching tracks and clips from Ableton');
  // 2-D array of all the clips, ordered by Track
  allAbletonClips = [];
  tracks = await ableton.song.get('tracks');

  for (let pillar = 0; pillar < 4; pillar++) {
    const track = tracks[pillar];
    const clipSlots = await track.get('clip_slots');

    track.addListener('playing_slot_index', async (clipSlotIndex: number) => {
      if (clipSlotIndex >= 0) {
        const clip = allAbletonClips[pillar][clipSlotIndex];
        if (clip) {
          const warpMarkers = await clip.get('warp_markers');
          const bpm = CalculateBPMFromWarpMarkers(warpMarkers);
          const clipName = clip?.raw.name;
          const clipMetadata = ClipNameToInfoMap[clipName?.replace(/[* ]/g, '')];
          const clipInfo = {
            ...clipMetadata,
            clipName,
            pillar,
          };

          logger.info(`Pillar ${pillar} started playing ${clipName} > ${JSON.stringify(clipInfo)}`);
          if (!clipMetadata) {
            throw new Error(`Couldn't find clip metadata for "${clipName}"`);
          }

          playingClips[pillar] = { ...clipInfo, clip };
          const browserInfo = { ...clipInfo, bpm };
          EmitEvent('clip_playing', browserInfo);

          const newPhraseLeader = FindNextPhraseLeader(playingClips);
          if (newPhraseLeader?.clipName === clipName) {
            AddPhraseLeader(newPhraseLeader);
          }
        }
      } else {
        const clipInfo = stoppingClips[pillar];
        logger.info(`Clip stopped playing on pillar ${pillar} > "${clipInfo?.clipName}"`);
        EmitEvent('clip_stopped', {
          ...clipInfo,
          pillar,
          clip: undefined,
        });
        stoppingClips[pillar] = null;
      }
    });

    allAbletonClips.push([]);
    for (let clipSlotIndex = 0; clipSlotIndex < clipSlots.length; clipSlotIndex++) {
      const cs = clipSlots[clipSlotIndex];
      const clip = await cs.get('clip');
      allAbletonClips[pillar].push(clip);
    }
  }
  logger.info('Tracks and clips from Ableton fetched');

  return { allAbletonClips, tracks };
};

export async function GetTrackVolumes() {
  logger.info('Getting track volumes');
  trackVolumes = [];
  for (const track of tracks.slice(0, 4)) {
    const mixerDevice = await track.get('mixer_device');
    const deviceParameter = await mixerDevice.sendCommand('get_volume');
    logger.debug(
      `Getting volume device parameter for track ${track.raw.name}: ${JSON.stringify(
        deviceParameter,
      )}`,
    );
    trackVolumes.push(new DeviceParameter(ableton, deviceParameter));
  }
}

export function CalculateBPMFromWarpMarkers(warp_markers: WarpMarker[]) {
  const { beat_time: startBT, sample_time: startST } = warp_markers[0];
  const { beat_time: endBT, sample_time: endST } = warp_markers.slice(-1)[0];
  const bpm = (endBT - startBT) / ((endST - startST) / 60);
  return bpm;
}
