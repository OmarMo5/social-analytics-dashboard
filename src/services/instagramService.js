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

export async function fetchInstagramPosts() {
  const { GOOGLE_API_KEY, SPREADSHEET_ID } = CONFIG;
  const url = `${BASE_URL}/${SPREADSHEET_ID}/values/${encodeURIComponent('instagram')}`;
  const { data } = await axios.get(url, { params: { key: GOOGLE_API_KEY } });

  return parseRows(data.values).map(row => ({
    id:            row['ID']             || String(row._idx),
    date:          row['date']           || '',
    time:          row['time']           || '',
    caption:       row['caption']        || '',
    mediaType:     row['media_type']     || '',
    link:          row['link']           || '',
    likes:         num(row['like_count']),
    comments:      num(row['comments_count']),
    reach:         num(row['reach']),
    shares:        num(row['shares']),
  }));
}
