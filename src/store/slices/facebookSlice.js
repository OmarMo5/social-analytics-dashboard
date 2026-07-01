import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchFacebookData } from '../../services/facebookService';

export const loadFacebook = createAsyncThunk('facebook/load', async (_, { rejectWithValue }) => {
  try { return await fetchFacebookData(); }
  catch (e) { return rejectWithValue(e.response?.data?.error?.message || e.message); }
});

const facebookSlice = createSlice({
  name: 'facebook',
  initialState: { pageStats: null, posts: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: b => {
    b.addCase(loadFacebook.pending,   s => { s.status = 'loading'; s.error = null; });
    b.addCase(loadFacebook.fulfilled, (s, { payload }) => {
      s.status    = 'succeeded';
      s.pageStats = payload.pageStats;
      s.posts     = payload.posts;
    });
    b.addCase(loadFacebook.rejected,  (s, { payload }) => { s.status = 'failed'; s.error = payload; });
  },
});

export const selectPageStats    = s => s.facebook.pageStats;
export const selectFBPosts      = s => s.facebook.posts;
export const selectFBStatus     = s => s.facebook.status;
export const selectFBError      = s => s.facebook.error;

export const selectFBAnalytics = s => {
  const posts = s.facebook.posts;
  if (!posts.length) return null;

  const total        = posts.length;
  const totalReact   = posts.reduce((a,p) => a + p.reactions, 0);
  const totalShares  = posts.reduce((a,p) => a + p.shares,    0);
  const totalCom     = posts.reduce((a,p) => a + p.comments,  0);
  const avgReact     = total ? Math.round(totalReact  / total) : 0;
  const avgEng       = total ? Math.round((totalReact + totalShares + totalCom) / total) : 0;

  // Monthly timeline
  const monthMap = {};
  posts.forEach(p => {
    const key = p.date?.slice(0,7);
    if (!key) return;
    if (!monthMap[key]) monthMap[key] = { key, count:0, reactions:0, shares:0, comments:0 };
    monthMap[key].count++;
    monthMap[key].reactions += p.reactions;
    monthMap[key].shares    += p.shares;
    monthMap[key].comments  += p.comments;
  });
  const timeline = Object.values(monthMap)
    .sort((a,b) => a.key.localeCompare(b.key))
    .map(m => ({
      ...m,
      label: new Date(m.key+'-01').toLocaleDateString('ar-EG', { month:'short', year:'2-digit' }),
    }));

  // Top posts by engagement
  const topPosts = [...posts]
    .sort((a,b) => (b.reactions + b.shares + b.comments) - (a.reactions + a.shares + a.comments))
    .slice(0, 5);

  // Posts with links
  const withLink = posts.filter(p => p.link).length;

  return { total, totalReact, totalShares, totalCom, avgReact, avgEng, timeline, topPosts, withLink };
};

export default facebookSlice.reducer;
