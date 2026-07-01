import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchXData } from '../../services/xService';

export const loadX = createAsyncThunk(
  'x/load',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchXData();
    } catch (e) {
      return rejectWithValue(e.response?.data?.error?.message || e.message);
    }
  }
);

const xSlice = createSlice({
  name: 'x',
  initialState: {
    stats: null,
    tweets: [],
    analytics: null,
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadX.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loadX.fulfilled, (state, { payload }) => {
        state.status = 'succeeded';
        state.stats = payload.stats;
        state.tweets = payload.tweets;
        state.analytics = payload.analytics;
      })
      .addCase(loadX.rejected, (state, { payload }) => {
        state.status = 'failed';
        state.error = payload;
      });
  },
});

export const selectXStats = (state) => state.x.stats;
export const selectXTweets = (state) => state.x.tweets;
export const selectXAnalytics = (state) => state.x.analytics;
export const selectXStatus = (state) => state.x.status;
export const selectXError = (state) => state.x.error;

export default xSlice.reducer;
