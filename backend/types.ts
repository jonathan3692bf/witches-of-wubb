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
  rfid: string;
  clipName: string;
  type: ClipTypes;
  assetName: string;
  artist?: string;
  songTitle?: string;
  bpm?: number;
  ingredientName?: string;
  recommendedClips?: {
    [key: string]: string[]; // name of the clips as surfaced from the CSV
  };
  // recommendedSpells?: { [key in keyof ClipTypes]: ClipMetadataType }[];
};

export type RFIDToClipMapType = {
  [key: string]: Omit<ClipMetadataType, 'rfid'>;
};
export type ClipNameToInfoMapType = {
  [key: string]: Omit<ClipMetadataType, 'clipName'>;
};

export type ClipInfo = { clip: Clip; pillar: number } & ClipMetadataType;
export type BrowserClipInfo = Omit<ClipInfo, 'clip'>;
export type BrowserClipInfoList = (BrowserClipInfo | null)[];

export type ClipList = (ClipInfo | null)[];
export type ClipBoard = Array<Clip | null>[];

export type SetTrackVolumeInputType = { pillar: number; volume: number };
export type TrackVolumesType = number[];
