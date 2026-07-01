import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchTikTokData } from '../../services/tiktokService';

export const loadTikTok = createAsyncThunk(
  'tiktok/load',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchTikTokData();
    } catch (e) {
      return rejectWithValue(e.response?.data?.error?.message || e.message);
    }
  }
);

const tiktokSlice = createSlice({
  name: 'tiktok',
  initialState: {
    stats: null,
    posts: [],
    analytics: null,
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadTikTok.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loadTikTok.fulfilled, (state, { payload }) => {
        state.status = 'succeeded';
        state.stats = payload.stats;
        state.posts = payload.posts;
        state.analytics = payload.analytics;
      })
      .addCase(loadTikTok.rejected, (state, { payload }) => {
        state.status = 'failed';
        state.error = payload;
      });
  },
});

export const selectTikTokStats = (state) => state.tiktok.stats;
export const selectTikTokPosts = (state) => state.tiktok.posts;
export const selectTikTokAnalytics = (state) => state.tiktok.analytics;
export const selectTikTokStatus = (state) => state.tiktok.status;
export const selectTikTokError = (state) => state.tiktok.error;

export default tiktokSlice.reducer;