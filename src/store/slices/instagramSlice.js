import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchInstagramPosts } from '../../services/instagramService';

export const loadInstagram = createAsyncThunk('instagram/load', async (_, { rejectWithValue }) => {
  try { return await fetchInstagramPosts(); }
  catch (e) { return rejectWithValue(e.response?.data?.error?.message || e.message); }
});

const instagramSlice = createSlice({
  name: 'instagram',
  initialState: { posts: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: b => {
    b.addCase(loadInstagram.pending,   s => { s.status = 'loading'; s.error = null; });
    b.addCase(loadInstagram.fulfilled, (s, { payload }) => { s.status = 'succeeded'; s.posts = payload; });
    b.addCase(loadInstagram.rejected,  (s, { payload }) => { s.status = 'failed'; s.error = payload; });
  },
});

export const selectPosts      = s => s.instagram.posts;
export const selectIGStatus   = s => s.instagram.status;
export const selectIGError    = s => s.instagram.error;

export const selectIGAnalytics = s => {
  const posts = s.instagram.posts;
  if (!posts.length) return null;

  const total      = posts.length;
  const totalLikes = posts.reduce((a,p) => a + p.likes, 0);
  const totalCom   = posts.reduce((a,p) => a + p.comments, 0);
  const totalReach = posts.reduce((a,p) => a + p.reach, 0);
  const totalShare = posts.reduce((a,p) => a + p.shares, 0);
  const avgReach   = total ? Math.round(totalReach / total) : 0;
  const engRate    = totalReach ? +((( totalLikes + totalCom + totalShare) / totalReach) * 100).toFixed(2) : 0;

  // Media type distribution
  const typeMap = {};
  posts.forEach(p => { const t = p.mediaType||'OTHER'; typeMap[t] = (typeMap[t]||0)+1; });
  const mediaTypes = Object.entries(typeMap).map(([name,value]) => ({ name, value, pct: Math.round((value/total)*100) })).sort((a,b)=>b.value-a.value);

  // Reach over time (sorted by date)
  const timeline = [...posts]
    .filter(p => p.date)
    .sort((a,b) => a.date.localeCompare(b.date))
    .map(p => ({
      label:    new Date(p.date).toLocaleDateString('ar-EG', { month:'short', day:'numeric' }),
      date:     p.date,
      reach:    p.reach,
      likes:    p.likes,
      comments: p.comments,
      shares:   p.shares,
    }));

  // Top posts by reach
  const topPosts = [...posts].sort((a,b) => b.reach - a.reach).slice(0,5);

  return { total, totalLikes, totalCom, totalReach, totalShare, avgReach, engRate, mediaTypes, timeline, topPosts };
};

export default instagramSlice.reducer;
