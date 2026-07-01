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

function num(v) { return parseFloat(String(v).replace(/,/g, '')) || 0; }

export async function fetchFacebookData() {
  const { GOOGLE_API_KEY, SPREADSHEET_ID } = CONFIG;

  const [statsRes, postsRes] = await Promise.all([
    axios.get(`${BASE_URL}/${SPREADSHEET_ID}/values/${encodeURIComponent('facebook')}`,        { params: { key: GOOGLE_API_KEY } }),
    axios.get(`${BASE_URL}/${SPREADSHEET_ID}/values/${encodeURIComponent('facebook_posts')}`,  { params: { key: GOOGLE_API_KEY } }),
  ]);

  // Page stats — single data row
  const statsRows = parseRows(statsRes.data.values);
  const s = statsRows[0] || {};
  const pageStats = {
    id:                s['ID']                  || '',
    totalLikes:        num(s['total likes']),
    totalFollowers:    num(s['totla followers'] || s['total followers']),
    pageRate:          num(s['page_rate']),
    activeNow:         num(s['active_now']),
    monthlyReach:      num(s['monthly_reach']),
    monthlyEngagement: num(s['monthly_engagement']),
    platform:          s['platform']            || 'Facebook',
  };

  // Posts
  const posts = parseRows(postsRes.data.values).map(row => ({
    id:             row['id']                                            || String(row._idx),
    message:        row['message']                                       || '',
    date:           row['date']                                          || '',
    time:           row['time']                                          || '',
    link:           row['link']                                          || '',
    shares:         num(row['shares']),
    reactions:      num(row['reactions_total']),
    comments:       num(row['comments_totla'] || row['comments_total']),
  }));

  return { pageStats, posts };
}
