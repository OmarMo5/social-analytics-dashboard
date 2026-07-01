import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchArticles } from '../../services/sheetsService';

export const loadArticles = createAsyncThunk('news/loadArticles', async (_, { rejectWithValue }) => {
  try { return await fetchArticles(); }
  catch (err) { return rejectWithValue(err.response?.data?.error?.message || err.message); }
});

const initialFilters = { year: '', month: '', day: '', platform: '', sentiment: '', search: '' };

const newsSlice = createSlice({
  name: 'news',
  initialState: { articles: [], filters: initialFilters, status: 'idle', error: null, lastFetch: null },
  reducers: {
    setFilter(state, { payload: { key, value } }) { state.filters[key] = value; },
    resetFilters(state) { state.filters = initialFilters; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadArticles.pending,   (s) => { s.status = 'loading'; s.error = null; })
      .addCase(loadArticles.fulfilled, (s, { payload }) => { s.status = 'succeeded'; s.articles = payload; s.lastFetch = new Date().toISOString(); })
      .addCase(loadArticles.rejected,  (s, { payload }) => { s.status = 'failed'; s.error = payload; });
  },
});

export const { setFilter, resetFilters } = newsSlice.actions;

export const selectAllArticles      = (s) => s.news.articles;
export const selectFilters          = (s) => s.news.filters;
export const selectStatus           = (s) => s.news.status;
export const selectError            = (s) => s.news.error;
export const selectLastFetch        = (s) => s.news.lastFetch;

export const selectFilteredArticles = (state) => {
  const { articles, filters } = state.news;
  return articles.filter((a) => {
    const d = a.date ? new Date(a.date) : null;
    if (filters.year      && d && String(d.getFullYear()) !== filters.year)                          return false;
    if (filters.month     && d && String(d.getMonth() + 1).padStart(2,'0') !== filters.month)        return false;
    if (filters.day       && d && String(d.getDate()).padStart(2,'0') !== filters.day)               return false;
    if (filters.platform  && a.platform  !== filters.platform)                                       return false;
    if (filters.sentiment) {
      const sa = a.sentiment || 'غير محدد';
      if (sa !== filters.sentiment) return false;
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (!a.title.toLowerCase().includes(q) && !a.source.toLowerCase().includes(q)) return false;
    }
    return true;
  });
};

export const selectAnalytics = (state) => {
  const articles = state.news.articles;
  if (!articles.length) return null;
  const total = articles.length;

  // Sentiment (null → "غير محدد")
  const sentMap = { إيجابي: 0, سلبي: 0, محايد: 0, 'غير محدد': 0 };
  articles.forEach((a) => {
    const k = a.sentiment || 'غير محدد';
    sentMap[k] = (sentMap[k] || 0) + 1;
  });
  const sentiment = Object.entries(sentMap)
    .filter(([, v]) => v > 0)
    .map(([name, value]) => ({ name, value, pct: Math.round((value / total) * 100) }));

  // Platforms
  const platMap = {};
  articles.forEach((a) => { if (a.platform) platMap[a.platform] = (platMap[a.platform] || 0) + 1; });
  const platforms = Object.entries(platMap)
    .map(([name, value]) => ({ name, value, pct: Math.round((value / total) * 100) }))
    .sort((a, b) => b.value - a.value);

  // Daily (last 14 days)
  const dayMap = {};
  articles.forEach((a) => { if (a.date) { const d = a.date.slice(0,10); dayMap[d] = (dayMap[d]||0)+1; } });
  const daily = Object.entries(dayMap).sort((a,b) => a[0].localeCompare(b[0])).slice(-14).map(([date,count])=>({date,count}));

  const todayStr   = new Date().toISOString().slice(0,10);
  const todayCount = articles.filter((a) => a.date?.slice(0,10) === todayStr).length;

  return { sentiment, platforms, daily, todayCount, total };
};

export default newsSlice.reducer;
