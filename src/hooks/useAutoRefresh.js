import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loadArticles } from '../store/slices/newsSlice';
import CONFIG from '../config/config';

export function useAutoRefresh() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadArticles());
    const mins = CONFIG.AUTO_REFRESH_MINUTES;
    if (!mins) return;
    const id = setInterval(() => dispatch(loadArticles()), mins * 60 * 1000);
    return () => clearInterval(id);
  }, [dispatch]);
}
