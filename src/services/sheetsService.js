import axios from 'axios';
import CONFIG from '../config/config';

const BASE_URL = 'https://sheets.googleapis.com/v4/spreadsheets';

// Arabic platform name normaliser
const PLATFORM_LABELS = {
  news:      'أخبار إلكترونية',
  website:   'مواقع إلكترونية',
  x:         'X (تويتر)',
  twitter:   'X (تويتر)',
  instagram: 'Instagram',
  tiktok:    'TikTok',
  youtube:   'YouTube',
  facebook:  'Facebook',
  linkedin:  'LinkedIn',
  podcast:   'بودكاست',
  tv:        'تلفزيون',
  radio:     'راديو',
  print:     'صحافة مطبوعة',
};

function normalisePlatform(raw) {
  const key = (raw || '').trim().toLowerCase();
  return PLATFORM_LABELS[key] || raw || 'أخرى';
}

function normaliseSentiment(raw) {
  const v = (raw || '').trim();
  if (!v) return null;
  const lc = v.toLowerCase();
  if (/إيجاب|ايجاب|positive|pos\b|good|جيد|ممتاز/.test(lc))  return 'إيجابي';
  if (/سلب|negative|neg\b|bad|سيء|ضار|critical/.test(lc))     return 'سلبي';
  if (/محايد|neutral|mixed|عادي|متوازن/.test(lc))              return 'محايد';
  return 'محايد'; // fallback for unknown values → treat as neutral not unset
}

function stripHtml(str) {
  return (str || '').replace(/<[^>]*>/g, '').replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/&middot;/g, '·').trim();
}

function parseRows(values) {
  if (!values || values.length < 2) return [];
  const [headers, ...rows] = values;
  return rows.map((row) => {
    const obj = {};
    headers.forEach((h, i) => { obj[h.trim()] = (row[i] ?? '').toString().trim(); });
    return obj;
  });
}

export async function fetchArticles() {
  const { GOOGLE_API_KEY, SPREADSHEET_ID, SHEET_NAME, COLUMNS } = CONFIG;
  const url = `${BASE_URL}/${SPREADSHEET_ID}/values/${encodeURIComponent(SHEET_NAME)}`;
  const { data } = await axios.get(url, { params: { key: GOOGLE_API_KEY } });

  const allRows = parseRows(data.values);

  return allRows
    .filter((row) => {
      const v = (row[COLUMNS.VERIFIED] || '').toUpperCase();
      return v === 'TRUE';
    })
    .map((row, idx) => ({
      id:        idx,
      title:     stripHtml(row[COLUMNS.TITLE])   || '—',
      source:    stripHtml(row[COLUMNS.SOURCE]) || '',
      platform:  normalisePlatform(row[COLUMNS.PLATFORM]),
      date:      row[COLUMNS.DATE]     || '',
      link:      row[COLUMNS.LINK]     || '',
      sentiment: normaliseSentiment(row[COLUMNS.SENTIMENT]),
      raw:       row,
    }));
}
