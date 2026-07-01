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

function extractImagesFromDescription(description) {
  if (!description) return [];
  
  // محاولة استخراج روابط الصور من الوصف
  // الصيغ المدعومة: 
  // - روابط مباشرة: https://...jpg, https://...png, https://...jpeg, https://...gif, https://...webp
  // - روابط بين قوسين: (https://...jpg) أو [https://...png]
  // - روابط مفصولة بفواصل أو مسافات
  
  const urlPattern = /(https?:\/\/[^\s]+?\.(?:jpg|jpeg|png|gif|webp|bmp|svg|tiff|ico))/gi;
  const urls = description.match(urlPattern) || [];
  
  // تنظيف الروابط من علامات الترقيم الزائدة
  const cleanUrls = urls.map(url => {
    // إزالة علامات الترقيم من نهاية الرابط
    return url.replace(/[.,;:!?]$/, '');
  });
  
  // إزالة التكرار
  return [...new Set(cleanUrls)];
}

function cleanDescription(description) {
  if (!description) return '';
  
  // إزالة روابط الصور من الوصف للعرض النظيف
  const imageUrls = extractImagesFromDescription(description);
  let cleanText = description;
  
  imageUrls.forEach(url => {
    cleanText = cleanText.replace(url, '');
  });
  
  // تنظيف العلامات الزائدة
  cleanText = cleanText.replace(/[()[\]]/g, ' ').replace(/\s+/g, ' ').trim();
  
  return cleanText;
}

function formatDuration(seconds) {
  if (!seconds) return '0:00';
  const num = parseInt(seconds);
  if (isNaN(num)) return '0:00';
  
  const mins = Math.floor(num / 60);
  const secs = num % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ar-EG', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  } catch {
    return dateStr;
  }
}

function computeTikTokAnalytics(posts) {
  if (!posts.length) return null;
  
  const total = posts.length;
  const totalLikes = posts.reduce((a, p) => a + p.like_count, 0);
  const totalShares = posts.reduce((a, p) => a + p.share_count, 0);
  const totalViews = posts.reduce((a, p) => a + p.view_count, 0);
  const totalComments = posts.reduce((a, p) => a + p.comment_count, 0);
  
  const avgLikes = total ? Math.round(totalLikes / total) : 0;
  const avgShares = total ? Math.round(totalShares / total) : 0;
  const avgViews = total ? Math.round(totalViews / total) : 0;
  const avgComments = total ? Math.round(totalComments / total) : 0;
  
  // Engagement Rate (معيار تقريبي للتفاعل)
  const engagementRate = totalViews > 0 
    ? ((totalLikes + totalComments + totalShares) / totalViews * 100).toFixed(2)
    : 0;
  
  // تحليل شهري
  const monthMap = {};
  posts.forEach(p => {
    const key = p.create_date?.slice(0, 7);
    if (!key) return;
    if (!monthMap[key]) monthMap[key] = { 
      key, 
      count: 0, 
      views: 0, 
      likes: 0, 
      shares: 0, 
      comments: 0 
    };
    monthMap[key].count++;
    monthMap[key].views += p.view_count;
    monthMap[key].likes += p.like_count;
    monthMap[key].shares += p.share_count;
    monthMap[key].comments += p.comment_count;
  });
  
  const timeline = Object.values(monthMap)
    .sort((a, b) => a.key.localeCompare(b.key))
    .map(m => ({
      ...m,
      label: new Date(m.key + '-01').toLocaleDateString('ar-EG', { month: 'short', year: '2-digit' }),
    }));
  
  // أعلى فيديوهات تفاعلاً
  const topPosts = [...posts]
    .sort((a, b) => (b.view_count + b.like_count + b.comment_count + b.share_count) - 
                     (a.view_count + a.like_count + a.comment_count + a.share_count))
    .slice(0, 5);
  
  // إحصائيات إضافية
  const videosWithImages = posts.filter(p => p.cover_image_url).length;
  const totalDuration = posts.reduce((a, p) => a + num(p.duration), 0);
  const avgDuration = total ? totalDuration / total : 0;
  
  return {
    total,
    totalLikes,
    totalShares,
    totalViews,
    totalComments,
    avgLikes,
    avgShares,
    avgViews,
    avgComments,
    engagementRate,
    timeline,
    topPosts,
    videosWithImages,
    avgDuration,
    totalDuration
  };
}

export async function fetchTikTokData() {
  const { GOOGLE_API_KEY, SPREADSHEET_ID } = CONFIG;

  try {
    const [postsRes, accountRes] = await Promise.all([
      axios.get(`${BASE_URL}/${SPREADSHEET_ID}/values/${encodeURIComponent('TikTok')}`, { params: { key: GOOGLE_API_KEY } }),
      axios.get(`${BASE_URL}/${SPREADSHEET_ID}/values/${encodeURIComponent('Tiktok Account')}`, { params: { key: GOOGLE_API_KEY } }).catch(() => null)
    ]);

    const rows = parseRows(postsRes.data.values);
    const accRows = accountRes ? parseRows(accountRes.data.values) : [];
    const acc = accRows[0] || {};
    
    // إحصائيات عامة (حساب المنصة)
    const stats = {
      totalVideos: num(acc.video_count) || rows.length,
      totalViews: rows.reduce((a, r) => a + num(r.view_count), 0),
      totalLikes: num(acc.likes_count) || rows.reduce((a, r) => a + num(r.like_count), 0),
      totalShares: rows.reduce((a, r) => a + num(r.share_count), 0),
      totalComments: rows.reduce((a, r) => a + num(r.comment_count), 0),
      followerCount: num(acc.follower_count) || 29029, // Default fallback if fetch fails
      isVerified: acc.is_verified === 'TRUE',
      platform: 'TikTok'
    };

    // معالجة الفيديوهات
    const posts = rows.map(row => {
      const description = row.video_description || '';
      const imageUrls = extractImagesFromDescription(description);
      const cleanDesc = cleanDescription(description);
      
      return {
        id: row.title || String(row._idx),
        title: row.title || 'فيديو بدون عنوان',
        video_description: cleanDesc,
        description_full: description,
        duration: row.duration || '0:00',
        duration_seconds: num(row.duration),
        create_date: row.create_date || '',
        create_time: row.create_time || '',
        cover_image_url: row.cover_image_url || '',
        embed_html: row.embed_html || '',
        like_count: num(row.like_count),
        share_count: num(row.share_count),
        share_url: row.share_url || '',
        view_count: num(row.view_count),
        comment_count: num(row.comment_count),
        images: imageUrls, // روابط الصور المستخرجة
      };
    });

    // ترتيب الفيديوهات من الأحدث للأقدم
    posts.sort((a, b) => (b.create_date || '').localeCompare(a.create_date || ''));

    const analytics = computeTikTokAnalytics(posts);

    return { 
      stats, 
      posts, 
      analytics 
    };
  } catch (error) {
    console.error('Error fetching TikTok data:', error);
    throw error;
  }
}