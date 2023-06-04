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
  const ingredientName = String(row['Ingredient Name / Description']);
  // console.log(recommendedClips);

  if (clipName?.trim()) {
    RFIDToClipMap[rfid] = {
      clipName,
      type,
      assetName,
      artist,
      songTitle,
      ingredientName,
      // recommendedClips,
    };
    ClipNameToInfoMap[clipName?.replace(/[ ]/g, '')] = {
      rfid,
      type,
      assetName,
      artist,
      songTitle,
      ingredientName,
      // recommendedClips,
    };
  }
}

export function EnrichRecommendations(
  RFIDToClipMap: RFIDToClipMapType,
  ClipNameToInfoMap: ClipNameToInfoMapType,
  row: any,
) {
  function GetClipMetaData(clipName: string) {
    return ClipNameToInfoMap[clipName.replace(/[ ]/g, '')];
  }
  const rfid = row['RFID'];
  if (RFIDToClipMap[rfid]) {
    const clipName = String(row['Clip Name']);
    const recommendedVox = row['Compatible Vox Clips']
      ? JSON.parse(row['Compatible Vox Clips'])
      : [];
    const recommendedMelody = row['Compatible Mel Clips']
      ? JSON.parse(row['Compatible Mel Clips'])
      : [];
    const recommendedBass = row['Compatible Bass Clips']
      ? JSON.parse(row['Compatible Bass Clips'])
      : [];
    const recommendedDrums = row['Compatible Drum Clips']
      ? JSON.parse(row['Compatible Drum Clips'])
      : [];

    const recommendedClips = {
      [ClipTypes.Vox]: recommendedVox?.map(GetClipMetaData).filter((val: any) => val),
      [ClipTypes.Melody]: recommendedMelody?.map(GetClipMetaData).filter((val: any) => val),
      [ClipTypes.Bass]: recommendedBass?.map(GetClipMetaData).filter((val: any) => val),
      [ClipTypes.Drums]: recommendedDrums?.map(GetClipMetaData).filter((val: any) => val),
    };

    RFIDToClipMap[rfid] = {
      ...RFIDToClipMap[rfid],
      recommendedClips,
    };

    ClipNameToInfoMap[clipName?.replace(/[ ]/g, '')] = {
      ...ClipNameToInfoMap[clipName?.replace(/[ ]/g, '')],
      recommendedClips,
    };
  }
}
