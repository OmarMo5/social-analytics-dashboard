import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchYouTubeVideos } from '../../services/youtubeService';

export const loadYouTube = createAsyncThunk('youtube/load', async (_, { rejectWithValue }) => {
  try { return await fetchYouTubeVideos(); }
  catch (e) { return rejectWithValue(e.response?.data?.error?.message || e.message); }
});

const youtubeSlice = createSlice({
  name: 'youtube',
  initialState: { videos: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: b => {
    b.addCase(loadYouTube.pending,   s => { s.status = 'loading'; s.error = null; });
    b.addCase(loadYouTube.fulfilled, (s, { payload }) => { s.status = 'succeeded'; s.videos = payload; });
    b.addCase(loadYouTube.rejected,  (s, { payload }) => { s.status = 'failed'; s.error = payload; });
  },
});

export const selectVideos    = s => s.youtube.videos;
export const selectYTStatus  = s => s.youtube.status;
export const selectYTError   = s => s.youtube.error;

export const selectYTAnalytics = s => {
  const videos = s.youtube.videos;
  if (!videos.length) return null;

  const total        = videos.length;
  const totalViews   = videos.reduce((a,v) => a + v.views,    0);
  const totalLikes   = videos.reduce((a,v) => a + v.likes,    0);
  const totalCom     = videos.reduce((a,v) => a + v.comments, 0);
  const totalFav     = videos.reduce((a,v) => a + v.favorites,0);
  const avgViews     = total ? Math.round(totalViews / total) : 0;
  const engRate      = totalViews ? +((( totalLikes + totalCom) / totalViews) * 100).toFixed(2) : 0;

  const timeline = [...videos]
    .filter(v => v.publishedAt)
    .sort((a,b) => a.publishedAt.localeCompare(b.publishedAt))
    .map(v => ({
      label:    new Date(v.publishedAt).toLocaleDateString('ar-EG', { month:'short', day:'numeric', year:'2-digit' }),
      date:     v.publishedAt,
      views:    v.views,
      likes:    v.likes,
      comments: v.comments,
    }));

  const topVideos = [...videos].sort((a,b) => b.views - a.views).slice(0,5);

  return { total, totalViews, totalLikes, totalCom, totalFav, avgViews, engRate, timeline, topVideos };
};

export default youtubeSlice.reducer;
