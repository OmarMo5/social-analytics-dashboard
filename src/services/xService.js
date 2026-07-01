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

function extractMediaUrls(media) {
  if (!media) return [];
  const urls = media
    .split(/[\s,]+/)
    .map(u => u.trim())
    .filter(u => /^https?:\/\//i.test(u));
  return [...new Set(urls)];
}

function engagementOf(t) {
  return t.likes + t.retweets + t.replies + t.quotes + t.bookmarks;
}

function computeXAnalytics(tweets) {
  if (!tweets.length) return null;

  const total = tweets.length;
  const totalLikes = tweets.reduce((a, t) => a + t.likes, 0);
  const totalRetweets = tweets.reduce((a, t) => a + t.retweets, 0);
  const totalReplies = tweets.reduce((a, t) => a + t.replies, 0);
  const totalQuotes = tweets.reduce((a, t) => a + t.quotes, 0);
  const totalBookmarks = tweets.reduce((a, t) => a + t.bookmarks, 0);
  const totalEngagement = totalLikes + totalRetweets + totalReplies + totalQuotes + totalBookmarks;

  const avgEngagement = total ? Math.round(totalEngagement / total) : 0;
  const avgLikes = total ? Math.round(totalLikes / total) : 0;

  // تحليل شهري
  const monthMap = {};
  tweets.forEach(t => {
    const key = t.created_date?.slice(0, 7);
    if (!key) return;
    if (!monthMap[key]) monthMap[key] = {
      key, count: 0, likes: 0, retweets: 0, replies: 0, quotes: 0, bookmarks: 0
    };
    monthMap[key].count++;
    monthMap[key].likes += t.likes;
    monthMap[key].retweets += t.retweets;
    monthMap[key].replies += t.replies;
    monthMap[key].quotes += t.quotes;
    monthMap[key].bookmarks += t.bookmarks;
  });

  const timeline = Object.values(monthMap)
    .sort((a, b) => a.key.localeCompare(b.key))
    .map(m => ({
      ...m,
      label: new Date(m.key + '-01').toLocaleDateString('ar-EG', { month: 'short', year: '2-digit' }),
    }));

  // أعلى التغريدات تفاعلاً
  const topTweets = [...tweets]
    .sort((a, b) => engagementOf(b) - engagementOf(a))
    .slice(0, 5);

  // توزيع اللغات
  const langMap = {};
  tweets.forEach(t => {
    const key = t.language || 'غير محدد';
    langMap[key] = (langMap[key] || 0) + 1;
  });
  const languages = Object.entries(langMap)
    .map(([name, value]) => ({ name, value, pct: Math.round((value / total) * 100) }))
    .sort((a, b) => b.value - a.value);

  const tweetsWithMedia = tweets.filter(t => t.media?.length > 0).length;

  return {
    total,
    totalLikes,
    totalRetweets,
    totalReplies,
    totalQuotes,
    totalBookmarks,
    totalEngagement,
    avgEngagement,
    avgLikes,
    timeline,
    topTweets,
    languages,
    tweetsWithMedia,
  };
}

export async function fetchXData() {
  const { GOOGLE_API_KEY, SPREADSHEET_ID } = CONFIG;

  try {
    const postsRes = await axios.get(
      `${BASE_URL}/${SPREADSHEET_ID}/values/${encodeURIComponent('X')}`,
      { params: { key: GOOGLE_API_KEY } }
    );

    const rows = parseRows(postsRes.data.values);

    const tweets = rows.map(row => ({
      id: row.tweet_url || String(row._idx),
      tweet_url: row.tweet_url || '',
      text: row.text || '',
      language: row.language || '',
      created_date: row.created_date || '',
      created_time: row.created_time || '',
      likes: num(row.likes),
      retweets: num(row.retweets),
      replies: num(row.replies),
      quotes: num(row.quotes),
      bookmarks: num(row.bookmarks),
      media: extractMediaUrls(row.media),
    }));

    // ترتيب التغريدات من الأحدث للأقدم
    tweets.sort((a, b) => (b.created_date + (b.created_time || '')).localeCompare(a.created_date + (a.created_time || '')));

    const analytics = computeXAnalytics(tweets);

    const stats = {
      totalTweets: tweets.length,
      totalLikes: analytics?.totalLikes || 0,
      totalRetweets: analytics?.totalRetweets || 0,
      totalReplies: analytics?.totalReplies || 0,
      totalBookmarks: analytics?.totalBookmarks || 0,
    };

    return { stats, tweets, analytics };
  } catch (error) {
    console.error('Error fetching X data:', error);
    throw error;
  }
}
