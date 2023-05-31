import { ClipNameToInfoMapType, ClipTypes, RFIDToClipMapType } from '../types';

export default function ParseCSV(
  RFIDToClipMap: RFIDToClipMapType,
  ClipNameToInfoMap: ClipNameToInfoMapType,
  row: any,
) {
  const rfid = row['RFID'];
  // const rfid = String(row['Asset ID']);
  const clipName = String(row['Clip Name']);
  const type = row['Clip Type (e.g. Vocals)'] as ClipTypes;
  const assetName = String(row['Icon / Asset Name']);
  const artist = String(row['Artist']);
  const songTitle = String(row['Song Title']);
  if (clipName?.trim()) {
    RFIDToClipMap[rfid] = { clipName, type, assetName, artist, songTitle };
    ClipNameToInfoMap[clipName?.replace(/[ ]/g, '')] = { rfid, type, assetName, artist, songTitle };
  }
}
