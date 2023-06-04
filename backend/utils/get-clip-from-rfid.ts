import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import logger from './logger';
import ParseCSV, { EnrichRecommendations } from './parse-csv';
import { ClipNameToInfoMapType, RFIDToClipMapType } from '../types';

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
  results.data.forEach(ParseCSV.bind(this, RFIDToClipMap, ClipNameToInfoMap));
  results.data.forEach(
    EnrichRecommendations.bind(this, RFIDToClipMap, ClipNameToInfoMap, results.data),
  );
  logger.trace('RFID CSV parsed');
} catch (err) {
  logger.error(err);
}
