import axios from 'axios';
import CONFIG from '../config/config';

const BASE_URL = 'https://sheets.googleapis.com/v4/spreadsheets';

function parseRows(values) {
  if (!values || values.length < 2) return [];
  const [rawHeaders, ...rows] = values;
  const headers = rawHeaders.map(h => h.trim());
  return rows.map((row, idx) => {
    const obj = { _idx: idx };
    headers.forEach((h, i) => { obj[h] = (row[i] ?? '').toString().trim(); });
    return obj;
  });
}

function num(v) { return parseFloat(v) || 0; }

// Parse comma/newline separated image URLs
function parseImages(raw) {
  if (!raw) return [];
  return raw.split(/[\n,]/).map(s => s.trim()).filter(Boolean);
}

export async function fetchMapsReviews() {
  const { GOOGLE_API_KEY, SPREADSHEET_ID } = CONFIG;
  const url = `${BASE_URL}/${SPREADSHEET_ID}/values/${encodeURIComponent('maps')}`;
  const { data } = await axios.get(url, { params: { key: GOOGLE_API_KEY } });

  return parseRows(data.values).map(row => ({
    id:         row['id']              || String(row._idx),
    name:       row['name']            || 'زائر مجهول',
    museum:     row['museum']          || '',
    branch:     row['branch']          || '',
    text:       row['text']            || '',
    date:       row['Date']            || '',
    time:       row['time']            || '',
    likes:      num(row['likesCount']),
    reviewUrl:  row['reviewUrl']       || '',
    stars:      num(row['stars']),
    images:     parseImages(row['reviewImageUrls']),
    aiCheck:    row['Ai check']        || '',
  }));
}
