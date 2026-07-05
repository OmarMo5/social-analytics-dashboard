import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/layout/Layout';
import LoginPage from './pages/LoginPage';
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
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
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
      <AuthProvider>
        <Provider store={store}>
          <BrowserRouter basename="/social-analytic">
            <AppRoutes />
          </BrowserRouter>
        </Provider>
      </AuthProvider>
    </ThemeProvider>
  );
}
