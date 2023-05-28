import { Clip } from 'ableton-js/ns/clip';

export enum ClipTypes {
  Vox = 'Vox',
  Melody = 'Melody',
  Bass = 'Bass',
  Drums = 'Drums',
}

export interface WarpMarker {
  beat_time: number;
  sample_time: number;
}

export type TagDetectionData = { rfid: string; pillar: number };

export type ClipMetadataType = {
  clipName: string;
  type: ClipTypes;
  assetName: string;
};

export type RFIDToClipMapType = {
  [key: string]: ClipMetadataType;
};
export type ClipNameToInfoMapType = {
  [key: string]: { type: ClipTypes; assetName: string };
};

export type ClipInfo = { clip: Clip; pillar: number } & ClipMetadataType;
export type BrowserClipInfo = Omit<ClipInfo, 'clip'> & { bpm?: number };
export type BrowserClipInfoList = (BrowserClipInfo | null)[];

export type ClipList = (ClipInfo | null)[];
export type ClipBoard = (Clip | null)[];

export type SetTrackVolumeInputType = { pillar: number; volume: number };
export type TrackVolumesType = number[];
