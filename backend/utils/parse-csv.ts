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

  if (clipName?.trim() && rfid?.trim()) {
    RFIDToClipMap[rfid] = {
      clipName,
      type,
      assetName,
      artist,
      songTitle,
      ingredientName,
    };
    ClipNameToInfoMap[clipName?.replace(/[ ]/g, '')] = {
      rfid,
      type,
      assetName,
      artist,
      songTitle,
      ingredientName,
    };
  }
}

export function EnrichRecommendations(
  RFIDToClipMap: RFIDToClipMapType,
  ClipNameToInfoMap: ClipNameToInfoMapType,
  csv: any[],
  row: any,
) {
  const keyHeader = 'Key Numerical';
  const bpmHeader = 'BPM';

  const rfid = row['RFID'];
  const clipName = String(row['Clip Name']);

  const recommendedClips = csv
    .filter((compRow: any) => {
      return (
        Math.abs(compRow[keyHeader] - row[keyHeader]) <= 1 &&
        Math.abs(compRow[bpmHeader] - row[bpmHeader]) <= 20
      );
    })
    .map((row: any) => ({
      ...RFIDToClipMap[row['RFID']],
      rfid: row['RFID'],
    }))
    .reduce((acc: any, curr: any) => {
      if (acc[curr.type]) {
        acc[curr.type].push(curr);
      } else {
        acc[curr.type] = [curr];
      }
      return acc;
    }, {});

  RFIDToClipMap[rfid] = {
    ...RFIDToClipMap[rfid],
    recommendedClips,
  };

  ClipNameToInfoMap[clipName?.replace(/[ ]/g, '')] = {
    ...ClipNameToInfoMap[clipName?.replace(/[ ]/g, '')],
    recommendedClips,
  };
}
