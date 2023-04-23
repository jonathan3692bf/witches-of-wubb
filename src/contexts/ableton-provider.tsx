import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { SocketioContext } from '../contexts/socketio-provider';
import { LoggerContext } from './logger-provider';

export type TrackType = string[];
export type ClipsType = string[][];
export type ClipMap = Record<string, string | null>;
export type TrackVolumeMap = Record<string, number | null>;
export enum TrackNames {
  Vocals,
  Melody1,
  Melody2,
  Bass,
  Drums,
}

export function getTrackName(track: number) {
  return Object.values(TrackNames)[track];
}

export const AbletonContext = createContext({
  getTracksAndClips: () => null,
  changeTempo: (_) => null,
  changeTrackVolume: (_, __) => null,
  isLoading: false,
  tempo: 120,
  tracks: [],
  trackVolume: {},
  allClips: [],
  queuedClips: {},
  playingClips: {},
  stoppingClips: {},
} as {
  getTracksAndClips: () => void;
  changeTempo: (x: number) => void;
  changeTrackVolume: (track: string, volume: number) => void;
  isLoading: boolean;
  tempo: number;
  tracks: TrackType;
  trackVolume: TrackVolumeMap;
  allClips: ClipsType;
  queuedClips: ClipMap;
  playingClips: ClipMap;
  stoppingClips: ClipMap;
});

export default function AbletonProvider({ children }: { children: ReactNode }) {
  const socket = useContext(SocketioContext);
  const { logger } = useContext(LoggerContext);
  const [isLoading, setLoading] = useState(false);
  const [tempo, setTempo] = useState(120);
  const [tracks, setTracks] = useState<TrackType>([]);
  const [trackVolume, setTrackVolume] = useState<TrackVolumeMap>({});
  const [allClips, setAllClips] = useState<ClipsType>([]);
  const [queuedClips, setQueuedClips] = useState<ClipMap>({});
  const [playingClips, setPlayingClips] = useState<ClipMap>({});
  const [stoppingClips, setStoppingClips] = useState<ClipMap>({});

  useEffect(() => {
    if (socket.connected) {
      // socket.on('clip_list', (clips: Array<Array<string | null>>) => {
      //   Logger.debug('clip_list fired:', clips)
      //   setClips(clips);
      // });
      // socket.on('track_names', (tracks: Array<string | null>) => {
      //   Logger.debug('track_names fired:', tracks)
      //   setTracks(tracks);
      // });

      getTracksAndClips();

      socket.on(
        'clip_is_queued',
        ({
          clip,
          track,
          clipSlotIndex,
        }: {
          clip: string;
          track: number;
          clipSlotIndex: number;
        }) => {
          const trackName = getTrackName(track);
          logger.debug('clip_is_queued fired:', clip, trackName, clipSlotIndex);
          setQueuedClips((queuedClips) => ({ ...queuedClips, [trackName]: clip }));
        },
      );
      socket.on('clip_is_unqueued', ({ clip, track }: { clip: string; track: number }) => {
        const trackName = getTrackName(track);
        logger.debug('clip_is_unqueued fired:', clip, trackName);
        setQueuedClips((queuedClips) => ({ ...queuedClips, [trackName]: null }));
      });

      socket.on(
        'clip_is_playing',
        ({
          clip,
          track,
          clipSlotIndex,
        }: {
          clip: string;
          track: number;
          clipSlotIndex: number;
        }) => {
          const trackName = getTrackName(track);
          logger.debug('clip_is_playing fired:', clip, trackName, clipSlotIndex);
          setQueuedClips((queuedClips) => {
            if (queuedClips[trackName] === clip) return { ...queuedClips, [trackName]: null };
            return queuedClips;
          });
          setPlayingClips((playing) => ({ ...playing, [trackName]: clip }));
        },
      );

      socket.on('clip_is_stopping', ({ clip, track }: { clip: string; track: number }) => {
        const trackName = getTrackName(track);
        logger.debug('clip_is_stopping fired:', clip, trackName);
        setStoppingClips((stopping) => ({ ...stopping, [trackName]: clip }));
      });
      socket.on('track_stopped', ({ track }: { track: number }) => {
        const trackName = getTrackName(track);
        logger.debug('track_stopped fired:', trackName);
        setPlayingClips((playing) => ({ ...playing, [trackName]: null }));
        setStoppingClips((stopping) => ({ ...stopping, [trackName]: null }));
      });
      socket.on('tempo_changed', (tempo: number) => {
        logger.debug('tempo_changed fired:', tempo);
        setTempo(tempo);
      });
      socket.on('volume_changed', (track: string, volume: number) => {
        logger.debug('volume_changed fired:', track, volume);
        setTrackVolume((trackVolume) => ({ ...trackVolume, [track]: volume }));
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  function getTracksAndClips() {
    setLoading(true);
    setAllClips([]);
    setTracks([]);
    socket.emit('get_clip_board', null, (clips: string[][]) => {
      logger.debug('get_clip_board returned:', clips);
      setAllClips(clips);
      if (tracks?.length) setLoading(false);
    });
    socket.emit('get_track_names', null, (tracks: string[]) => {
      logger.debug('get_track_names returned:', tracks);
      setTracks(tracks);
      if (allClips?.length) setLoading(false);
    });
    socket.emit('get_track_volumes', null, (volumes: TrackVolumeMap) => {
      logger.debug('get_track_volumes returned:', volumes);
      setTrackVolume(volumes);
    });
    socket.emit('get_playing_clips', null, (playingClips: ClipMap) => {
      logger.debug('get_playing_clips returned:', playingClips);
      setPlayingClips(playingClips);
    });
    socket.emit('get_queued_clips', null, (queuedClips: ClipMap) => {
      logger.debug('get_queued_clips returned:', queuedClips);
      setQueuedClips(queuedClips);
    });
    socket.emit('get_tempo', null, (tempo: number) => {
      logger.debug('get_tempo returned:', tempo);
      setTempo(tempo);
    });
  }

  function changeTempo(tempo: number) {
    socket.emit('set_tempo', tempo, (tempo: number) => {
      logger.debug('change_tempo returned:', tempo);
      setTempo(tempo);
    });
  }
  function changeTrackVolume(track: string, volume: number) {
    socket.emit(
      'set_track_volume',
      { track, volume },
      (resp: { track: string; volume: number }) => {
        logger.debug('set_track_volume returned:', resp);
        setTrackVolume((tv) => ({ ...tv, [resp.track]: resp.volume }));
      },
    );
  }

  return (
    <AbletonContext.Provider
      value={{
        getTracksAndClips,
        changeTempo,
        isLoading,
        tempo,
        tracks,
        trackVolume,
        changeTrackVolume,
        allClips,
        queuedClips,
        playingClips,
        stoppingClips,
      }}
    >
      {children}
    </AbletonContext.Provider>
  );
}
