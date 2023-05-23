import fs from 'fs';
import path from 'path';
import logger from './logger';
import Papa from 'papaparse';
import { ClipNameToInfoMapType, ClipTypes, RFIDToClipMapType } from '../types';

let csv = '';
export const RFIDToClipMap: RFIDToClipMapType = {};
export const ClipNameToInfoMap: ClipNameToInfoMapType = {};

try {
  logger.info('Trying to read RFID CSV file');
  csv = fs.readFileSync(path.join(process.cwd(), '../src/assets/', 'Music Database.csv'), 'utf-8');
  const results = Papa.parse(csv, {
    header: true,
    transformHeader: (header) => header.replace(':', ''),
  });
  results.data.forEach((row: any) => {
    const rfid = row['RFID'];
    // const rfid = String(row['Asset ID']);
    const clipName = String(row['Clip Name']);
    const type = row['Clip Type (e.g. Vocals)'] as ClipTypes;
    const assetName = String(row['Icon / Asset Name']);
    if (clipName?.trim()) {
      RFIDToClipMap[rfid] = { clipName, type, assetName };
      ClipNameToInfoMap[clipName?.replace(/[* ]/g, '')] = { type, assetName };
    }
  });
  logger.trace('RFID CSV parsed');
} catch (err) {
  logger.error(err);
}
