import { configureStore } from '@reduxjs/toolkit';
import newsReducer      from './slices/newsSlice';
import instagramReducer from './slices/instagramSlice';
import youtubeReducer   from './slices/youtubeSlice';
import mapsReducer      from './slices/mapsSlice';
import facebookReducer  from './slices/facebookSlice';
import tiktokReducer from './slices/tiktokSlice';
import xReducer from './slices/xSlice';

const store = configureStore({
  reducer: {
    news:      newsReducer,
    instagram: instagramReducer,
    youtube:   youtubeReducer,
    maps:      mapsReducer,
    facebook:  facebookReducer,
    tiktok: tiktokReducer,
    x: xReducer,
  },
});

export default store;
