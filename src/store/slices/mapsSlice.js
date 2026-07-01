import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchMapsReviews } from '../../services/mapsService';

export const loadMaps = createAsyncThunk('maps/load', async (_, { rejectWithValue }) => {
  try { return await fetchMapsReviews(); }
  catch (e) { return rejectWithValue(e.response?.data?.error?.message || e.message); }
});

const mapsSlice = createSlice({
  name: 'maps',
  initialState: { reviews: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: b => {
    b.addCase(loadMaps.pending,   s => { s.status = 'loading'; s.error = null; });
    b.addCase(loadMaps.fulfilled, (s, { payload }) => { s.status = 'succeeded'; s.reviews = payload; });
    b.addCase(loadMaps.rejected,  (s, { payload }) => { s.status = 'failed'; s.error = payload; });
  },
});

export const selectReviews   = s => s.maps.reviews;
export const selectMapsStatus = s => s.maps.status;
export const selectMapsError  = s => s.maps.error;

export const selectMapsAnalytics = s => {
  const reviews = s.maps.reviews;
  if (!reviews.length) return null;

  const total      = reviews.length;
  const avgStars   = +(reviews.reduce((a,r) => a + r.stars, 0) / total).toFixed(2);
  const totalLikes = reviews.reduce((a,r) => a + r.likes, 0);
  const withImages = reviews.filter(r => r.images.length > 0).length;
  const withText   = reviews.filter(r => r.text).length;

  // Stars distribution 1-5
  const starDist = [5,4,3,2,1].map(s => ({
    stars: s,
    count: reviews.filter(r => Math.round(r.stars) === s).length,
    pct:   Math.round((reviews.filter(r => Math.round(r.stars) === s).length / total) * 100),
  }));

  // Timeline by month
  const monthMap = {};
  reviews.forEach(r => {
    const key = r.date?.slice(0,7);
    if (!key) return;
    if (!monthMap[key]) monthMap[key] = { label: key, count: 0, totalStars: 0 };
    monthMap[key].count++;
    monthMap[key].totalStars += r.stars;
  });
  const timeline = Object.values(monthMap)
    .sort((a,b) => a.label.localeCompare(b.label))
    .map(m => ({
      ...m,
      label: new Date(m.label + '-01').toLocaleDateString('ar-EG', { month:'short', year:'2-digit' }),
      avgStars: +(m.totalStars / m.count).toFixed(1),
    }));

  // Branch breakdown
  const branchMap = {};
  reviews.forEach(r => {
    const b = r.branch || 'غير محدد';
    if (!branchMap[b]) branchMap[b] = { name:b, count:0, totalStars:0, positives:0 };
    branchMap[b].count++;
    branchMap[b].totalStars += r.stars;
    if (r.stars >= 4) branchMap[b].positives++;
  });
  const branches = Object.values(branchMap)
    .map(b => ({ ...b, avgStars: +(b.totalStars / b.count).toFixed(1) }))
    .sort((a,b) => b.count - a.count);

  // AI sentiment distribution
  const aiMap = {};
  reviews.forEach(r => {
    const k = r.aiCheck || 'غير محدد';
    aiMap[k] = (aiMap[k] || 0) + 1;
  });
  const aiDist = Object.entries(aiMap).map(([label, count]) => ({ label, count, pct: Math.round((count/total)*100) })).sort((a,b)=>b.count-a.count);

  // Top reviews by likes
  const topByLikes = [...reviews].filter(r=>r.likes>0).sort((a,b)=>b.likes-a.likes).slice(0,5);

  return { total, avgStars, totalLikes, withImages, withText, starDist, timeline, branches, aiDist, topByLikes };
};

export default mapsSlice.reducer;
