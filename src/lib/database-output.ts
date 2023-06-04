import ParseCSV, { EnrichRecommendations } from 'backend/utils/parse-csv';
import { ClipNameToInfoMapType, RFIDToClipMapType } from 'backend/types';
import csv from '~/assets/Music Database.csv';

export const RFIDToClipMap: RFIDToClipMapType = {};
export const ClipNameToInfoMap: ClipNameToInfoMapType = {};

csv.forEach(ParseCSV.bind(this, RFIDToClipMap, ClipNameToInfoMap));

csv.forEach(EnrichRecommendations.bind(this, RFIDToClipMap, ClipNameToInfoMap, csv));
