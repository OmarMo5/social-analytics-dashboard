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

// Parse ISO 8601 duration PT4M13S → "4:13"
function parseDuration(iso) {
  if (!iso) return '';
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return iso;
  const h = parseInt(m[1] || 0);
  const min = parseInt(m[2] || 0);
  const sec = parseInt(m[3] || 0);
  if (h > 0) return `${h}:${String(min).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
  return `${min}:${String(sec).padStart(2,'0')}`;
}

export async function fetchYouTubeVideos() {
  const { GOOGLE_API_KEY, SPREADSHEET_ID } = CONFIG;
  const url = `${BASE_URL}/${SPREADSHEET_ID}/values/${encodeURIComponent('Youtube')}`;
  const { data } = await axios.get(url, { params: { key: GOOGLE_API_KEY } });

  return parseRows(data.values).map(row => ({
    id:            row['id']              || String(row._idx),
    publishedAt:   row['publishedAt']     || '',
    title:         row['title']           || '',
    description:   row['description']     || '',
    cover:         row['url_cover']       || '',
    durationRaw:   row['duration']        || '',
    duration:      parseDuration(row['duration']),
    views:         num(row['viewCount']),
    likes:         num(row['likeCount']),
    favorites:     num(row['favoriteCount']),
    comments:      num(row['commentCount']),
    embedHtml:     row['embedHtml']       || '',
  }));
}
