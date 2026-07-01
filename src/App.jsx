import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/layout/Layout';
import DashboardPage from './pages/DashboardPage';
import NewsPage from './pages/NewsPage';
import InstagramPage from './pages/InstagramPage';
import YouTubePage from './pages/YouTubePage';
import MapsPage from './pages/MapsPage';
import FacebookPage from './pages/FacebookPage';
import { useAutoRefresh } from './hooks/useAutoRefresh';
import TikTokPage from './pages/TikTokPage';
import XPage from './pages/XPage';

function AppRoutes() {
  useAutoRefresh();
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/instagram" element={<InstagramPage />} />
        <Route path="/youtube" element={<YouTubePage />} />
        <Route path="/maps" element={<MapsPage />} />
        <Route path="/facebook" element={<FacebookPage />} />
        <Route path="/tiktok" element={<TikTokPage />} />
        <Route path="/x" element={<XPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Provider store={store}>
        <BrowserRouter basename="/social-analytic">
          <AppRoutes />
        </BrowserRouter>
      </Provider>
    </ThemeProvider>
  );
}
