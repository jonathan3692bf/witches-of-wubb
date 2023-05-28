import { Ableton } from 'ableton-js';
import { Track } from 'ableton-js/ns/track';
import { DeviceParameter } from 'ableton-js/ns/device-parameter';
import * as socketio from 'socket.io';
import * as nodeOSC from 'node-osc';
import throttle from 'lodash.throttle';
import memoize from 'lodash.memoize';
import logger from './utils/logger';
import { FindNextPhraseLeader } from './utils/is-new-phrase-leader';
import { ClipBoard, ClipInfo, ClipList, ClipMetadataType, ClipTypes, WarpMarker } from './types';

import EmitEvent, { EmitEventWithoutResetingTimout } from './events/outgoing-events';
import { AddSocketEventsHandlers, OSCEventHandlers } from './events/incoming-events';
import { ClipNameToInfoMap } from './utils/get-clip-from-rfid';

let oscServer: nodeOSC.Server;
export const sockets: socketio.Socket[] = [];
export const TIMEOUT_IN_MILISECONDS = 15 * 1000;

export let timeoutId: NodeJS.Timeout;
export let timeoutWarningId: NodeJS.Timeout;
export const ATTRACTOR_STATE_CLIP_NAME = 'Silencio-5min';
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

export async function handleTimeout() {
  for (let i = 0; i < 4; i++) {
    await tracks[i].sendCommand('stop_all_clips');
    setTimeout(async () => {
      const clip = await MemoizedClipLocation(ATTRACTOR_STATE_CLIP_NAME, i);
      clip?.fire();
    }, 2_000);
  }
}

export function startTimeoutTimer() {
  logger.info('Starting timeout timer');
  timeoutWarningId = setTimeout(() => {
    if (playingClips.length && !queuedClips.length) {
      logger.warn('Timeout warning');
      EmitEventWithoutResetingTimout('timeout_warning');
    }
  }, TIMEOUT_IN_MILISECONDS - 10_000);
  timeoutId = setTimeout(() => {
    if (playingClips.length && !queuedClips.length) {
      logger.warn('Timeout exceeded, restarting the UI');
      EmitEventWithoutResetingTimout('attractor_state');
      handleTimeout();
    }
  }, TIMEOUT_IN_MILISECONDS);
}

export function restartTimeoutTimer() {
  logger.warn('Restarting timeout timer');
  clearTimeout(timeoutId);
  clearTimeout(timeoutWarningId);
  startTimeoutTimer();
}

export function ConnectOSCServer(server: nodeOSC.Server) {
  oscServer = server;
  oscServer.on('message', OSCEventHandlers);
}

const MemoizedClipLocation = memoize(
  async (clipName, pillar) => {
    const clipSlotIndex = allAbletonClips.findIndex((clip) => {
      return clip?.raw.name.trim() === clipName.trim();
    });
    if (pillar === 0) {
      return allAbletonClips[clipSlotIndex];
    } else {
      const clipSlots = await tracks[pillar].get('clip_slots');
      const clip = await clipSlots[clipSlotIndex].get('clip');
      return clip;
    }
  },
  (clipName, pillar) => `${clipName}-${pillar}`,
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

export async function QueueClip(clipMetadata: ClipMetadataType, pillar: number) {
  const { clipName } = clipMetadata;
  logger.info(`Begin queing clip ${clipName}`);
  if (queuedClips[pillar]?.clipName.replace(/[* ]/g, '') === clipName.replace(/[* ]/g, '')) {
    logger.info(`Clip ${clipName} is already queued`);
    return;
  }
  const clip = await MemoizedClipLocation(clipName, pillar);

  if (clip) {
    // if no items are playing, skip the queue
    const silence = playingClips.every((clip) => !clip);
    if (silence) {
      logger.info(`Triggering clip "${clipName}" on pillar ${pillar + 1}`);
      clip?.fire();
    } else {
      logger.info(`Queuing clip "${clipName}" on pillar ${pillar + 1}`);
      queuedClips[pillar] = {
        clip,
        pillar,
        ...clipMetadata,
      };
      EmitEvent('clip_queued', {
        pillar,
        ...clipMetadata,
      });
    }
  } else {
    logger.warn(`No clip "${clipName}" found on pillar ${pillar + 1}`);
    EmitEvent('clip_unqueued', {
      ...clipMetadata,
      pillar,
    });
  }
}

export async function TriggerQueuedClips() {
  logger.info(`Begin triggering clip queue`);
  for (let i = 0; i < queuedClips.length; i++) {
    const item = queuedClips[i];
    if (!item) continue;
    logger.info(`Triggering clip "${item.clip.raw.name}" on pillar ${item.pillar} `);
    await item.clip.fire();
    queuedClips[item.pillar] = null;
  }
}

export async function StopOrRemoveClipFromQueue(clipName: string, pillar: number) {
  logger.trace(`Try to stop or unqueue clip ${clipName}`);
  const playingClip = playingClips[pillar];
  const queuedClip = queuedClips[pillar];
  const isClipPlaying =
    playingClip?.clipName.replace(/[* ]/g, '') === clipName.replace(/[* ]/g, '');
  if (isClipPlaying) {
    logger.info(`Stopping clip "${clipName}" on pillar ${pillar + 1}`);
    stoppingClips[pillar] = playingClip;
    // clip.stop() won't work because of looping: stop the whole track instead.
    EmitEvent('clip_stopping', {
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
  }

  // check if the clip is queued
  const isClipQueued = queuedClip?.clipName.replace(/[* ]/g, '') === clipName.replace(/[* ]/g, '');
  if (isClipQueued) {
    logger.info(`Removing clip from queue "${clipName}" on pillar ${pillar + 1}`);
    queuedClips[pillar] = null;
    EmitEvent('clip_unqueued', {
      ...queuedClip,
      clip: undefined,
    });
  }

  if (!isClipPlaying && !isClipQueued) {
    logger.warn(
      `Clip ${clipName} is neither playing or queue. Stopping pillar ${pillar + 1} just in case.`,
    );
    await tracks[pillar].sendCommand('stop_all_clips');
  }
}

export async function AddPhraseLeader(newPhraseLeader: ClipInfo) {
  if (cleanUpPhraseLeaderEventListener) cleanUpPhraseLeaderEventListener();
  phraseLeader = newPhraseLeader;

  const { clip, clipName, pillar } = newPhraseLeader;
  logger.info(`New phrase leader "${clipName}" on pillar ${pillar + 1}`);

  // figure out when this clip is about to end
  const endTime = await clip.get('loop_end');
  logger.debug(`Loop end on pillar ${pillar + 1} > "${clipName}" | ${endTime}`);
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

    track.addListener('playing_slot_index', async (clipSlotIndex: number) => {
      if (clipSlotIndex >= 0) {
        const clip = allAbletonClips[clipSlotIndex];
        const clipName = clip?.raw.name;
        if (clipName && clipName !== ATTRACTOR_STATE_CLIP_NAME) {
          const warpMarkers = await clip.get('warp_markers');
          const bpm = CalculateBPMFromWarpMarkers(warpMarkers);
          const clipMetadata = ClipNameToInfoMap[clipName.replace(/[* ]/g, '')];
          const clipInfo = {
            ...clipMetadata,
            clipName,
            pillar,
          };

          logger.info(
            `Pillar ${pillar + 1} started playing ${clipName} > ${JSON.stringify(clipInfo)}`,
          );
          if (!clipMetadata) {
            throw new Error(`Couldn't find clip metadata for "${clipName}"`);
          }

          const browserInfo = { ...clipInfo, bpm };
          if (playingClips[pillar]?.clipName === clipName) {
            EmitEventWithoutResetingTimout('clip_playing', browserInfo);
          } else {
            EmitEvent('clip_started', browserInfo);
            SetTrackVolume(pillar, 0.85);
          }
          if (playingClips.every((item) => !item)) {
            // we're coming from a silent state, so let's set the tempo to this new clip's bpm
            SetTempo(bpm);
          }
          if (pillar === 0) {
            playingClips[pillar] = { ...clipInfo, clip };
          } else {
            const clip = await MemoizedClipLocation(clipName, pillar);
            if (clip) playingClips[pillar] = { ...clipInfo, clip };
          }

          const newPhraseLeader = FindNextPhraseLeader(playingClips);
          if (newPhraseLeader?.clipName === clipName) {
            AddPhraseLeader(newPhraseLeader);
          }
        }
      } else {
        const clipInfo = stoppingClips[pillar];
        logger.info(`Clip stopped playing on pillar ${pillar + 1} > "${clipInfo?.clipName}"`);
        EmitEventWithoutResetingTimout('clip_stopped', {
          ...clipInfo,
          pillar,
          clip: undefined,
        });
        stoppingClips[pillar] = null;
        playingClips[pillar] = null;
      }
    });

    if (pillar === 0) {
      const clipSlots = await track.get('clip_slots');
      for (let clipSlotIndex = 0; clipSlotIndex < clipSlots.length; clipSlotIndex++) {
        const cs = clipSlots[clipSlotIndex];
        const clip = await cs.get('clip');
        allAbletonClips.push(clip);
        // const previousClipName = clipSlotIndex
        //   ? (await clipSlots[clipSlotIndex - 1].get('clip'))?.raw.name
        //   : null;
        // const clipName = clip?.raw.name;
        // const checkDatabase =
        //   previousClipName && clipName ? previousClipName !== clipName : clipName ? true : false;
        // if (checkDatabase) {
        //   const info = ClipNameToInfoMap[clipName?.replace(/[ ]/g, '') as string];
        //   if (!info)
        //     logger.error(
        //       `Could not find clip: ${pillar + 1} | ${clipSlotIndex} / "${clipName}" in database`,
        //     );
        // }
      }
    }
  }
  logger.info('Tracks and clips from Ableton fetched');

  return { allAbletonClips, tracks };
};

export async function GetTempo() {
  logger.info('Getting tempo');
  return ableton.song.get('tempo');
}

export function SetTempo(tempo: number) {
  logger.info(`Setting tempo to: ${tempo}`);
  ableton.song.set('tempo', tempo);
  EmitEvent('tempo_changed', { tempo });
}

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

export async function SetTrackVolume(pillar: number, volume: number) {
  logger.info(`Setting volume for pillar ${pillar + 1} to ${volume}`);
  if (!trackVolumes?.length) await GetTrackVolumes();
  const trackVolume = trackVolumes[pillar];
  await trackVolume?.set('value', volume);
  EmitEvent('volume_changed', { pillar, volume });
}

export function CalculateBPMFromWarpMarkers(warp_markers: WarpMarker[]) {
  const { beat_time: startBT, sample_time: startST } = warp_markers[0];
  const { beat_time: endBT, sample_time: endST } = warp_markers.slice(-1)[0];
  const bpm = (endBT - startBT) / ((endST - startST) / 60);
  return bpm;
}
