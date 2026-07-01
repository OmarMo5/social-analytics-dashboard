import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Newspaper, Globe, BarChart2, Calendar } from 'lucide-react';
import CONFIG from "../config/config";
// News Slices
import {
  selectAnalytics,
  selectStatus,
  selectError,
  selectAllArticles,
} from '../store/slices/newsSlice';

// Other Platform Actions & Selectors
import { loadTikTok, selectTikTokStats, selectTikTokStatus, selectTikTokAnalytics } from '../store/slices/tiktokSlice';
import { loadFacebook, selectPageStats, selectFBStatus, selectFBAnalytics } from '../store/slices/facebookSlice';
import { loadInstagram, selectIGAnalytics, selectIGStatus } from '../store/slices/instagramSlice';
import { loadYouTube, selectYTAnalytics, selectYTStatus } from '../store/slices/youtubeSlice';
import { loadMaps, selectMapsAnalytics, selectMapsStatus } from '../store/slices/mapsSlice';

// Existing Components
import KPICard from '../components/dashboard/KPICard';
import SentimentDonut from '../components/dashboard/SentimentDonut';
import PlatformChart from '../components/dashboard/PlatformChart';
import DailyChart from '../components/dashboard/DailyChart';
import TopPlatformCard from '../components/dashboard/TopPlatformCard';
import TrendingCard from '../components/dashboard/TrendingCard';
import Loader from '../components/common/Loader';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';

// New Components
import CircularKPICard from '../components/dashboard/CircularKPICard';
import SummaryMetricCard from '../components/dashboard/SummaryMetricCard';
import YouTubeStatusCard from '../components/dashboard/YouTubeStatusCard';
import PrimaryAuditSummary from '../components/dashboard/PrimaryAuditSummary';
import AudiencePlatformSize from '../components/dashboard/AudiencePlatformSize';

export default function DashboardPage() {
  const dispatch = useDispatch();
  const status = useSelector(selectStatus);
  const error = useSelector(selectError);
  const analytics = useSelector(selectAnalytics);
  const articles = useSelector(selectAllArticles);

  // Other platform states
  const tiktokStats = useSelector(selectTikTokStats);
  const tiktokStatus = useSelector(selectTikTokStatus);
  const tiktokAnalytics = useSelector(selectTikTokAnalytics);
  const fbStats = useSelector(selectPageStats);
  const fbStatus = useSelector(selectFBStatus);
  const fbAnalytics = useSelector(selectFBAnalytics);
  const ytData = useSelector(selectYTAnalytics);
  const ytStatus = useSelector(selectYTStatus);
  const igData = useSelector(selectIGAnalytics);
  const igStatus = useSelector(selectIGStatus);
  const mapsData = useSelector(selectMapsAnalytics);
  const mapsStatus = useSelector(selectMapsStatus);

  useEffect(() => {
    if (tiktokStatus === 'idle') dispatch(loadTikTok());
    if (fbStatus === 'idle') dispatch(loadFacebook());
    if (ytStatus === 'idle') dispatch(loadYouTube());
    if (igStatus === 'idle') dispatch(loadInstagram());
    if (mapsStatus === 'idle') dispatch(loadMaps());
  }, [dispatch, tiktokStatus, fbStatus, ytStatus, igStatus, mapsStatus]);

  if (status === 'loading' && !articles.length) return <Loader />;
  if (status === 'failed') return <ErrorState message={error} />;
  if (!analytics) return <EmptyState />;

  const { sentiment, platforms, daily, todayCount, total } = analytics;

  // Format Helper
  const formatLargeNum = (n, sign = '') => {
    if (n === null || n === undefined) return '--';
    if (n >= 1000000) return sign + (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return sign + (n / 1000).toFixed(1) + 'K';
    return sign + n.toLocaleString();
  };

  // Calculations
  const fbLikes = fbStats?.totalLikes || 43794;
  const igLikes = igData?.totalLikes || 145;
  const ytLikes = ytData?.totalLikes || 2895;
  const mapsLikes = mapsData?.totalLikes || 2386;

  // إجمالي الإعجابات المتاحة (فيسبوك، تيك توك، إنستجرام، يوتيوب، مابس)
  const totalLikes = (tiktokStats?.totalLikes || 1054984) + fbLikes + igLikes + ytLikes + mapsLikes;

  // إجمالي التفاعل المتاح
  const ttEngagement = (tiktokStats?.totalLikes || 1054984) + (tiktokAnalytics?.totalComments || 0) + (tiktokAnalytics?.totalShares || 0);
  const fbEngagement = fbAnalytics ? (fbAnalytics.totalReact + fbAnalytics.totalCom + fbAnalytics.totalShares) : (fbStats?.monthlyEngagement || 621);
  const igEngagement = igData ? (igData.totalLikes + igData.totalCom + igData.totalShare) : 173;
  const ytEngagement = ytData ? (ytData.totalLikes + ytData.totalCom) : 2913;
  const mapsEngagement = mapsData ? mapsData.totalLikes : 2386;

  const totalEngagement = ttEngagement + fbEngagement + igEngagement + ytEngagement + mapsEngagement;

  // إجمالي المتابعين المعروف (فيسبوك، إنستجرام، تيك توك)
  const igStaticFollowers = 45000; // Instagram followers (baseline)
  const totalFollowers =
    igStaticFollowers +
    (tiktokStats?.followerCount || 29029) +
    (fbStats?.totalFollowers || 43794);

  // حساب أقوى منصة ديناميكياً
  const activePlatforms = [
    { name: 'Instagram', label: 'إنستجرام', count: igStaticFollowers, color: '#c25e00' },
    { name: 'Facebook', label: 'فيسبوك', count: fbStats?.totalFollowers || 43794, color: '#1877f2' },
    { name: 'TikTok', label: 'تيك توك', count: tiktokStats?.followerCount || 29029, color: '#0f766e' },
  ];
  activePlatforms.sort((a, b) => b.count - a.count);
  const strongestPlatform = activePlatforms[0];
  const strongestPlatformPct = totalFollowers > 0 ? Math.round((strongestPlatform.count / totalFollowers) * 100) : 86;

  // تفاعل المنصات ديناميكياً (التفاعل / إجمالي الوصول والمشاهدات)
  const totalReachViews = (tiktokAnalytics?.totalViews || 0) + (fbStats?.monthlyReach || 24534) + (igData?.totalReach || 5556) + (ytData?.totalViews || 295346);
  const platformEngagementRate = totalReachViews > 0 ? Math.min(99, Math.max(10, Math.round((totalEngagement / totalReachViews) * 100))) : 68;

  // تفاعل الناس (إيجابي)
  const positiveSentiment = sentiment?.find((s) => s.name === 'إيجابي');
  const positiveSentimentPct = positiveSentiment ? positiveSentiment.pct : 71;

  return (
    <div style={{
      width: '100%',
      maxWidth: '100%',
      overflow: 'hidden',
      boxSizing: 'border-box',
    }}>
      {/* العنوان */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 12,
          marginBottom: 24,
          width: '100%',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: 'var(--text-1)',
              margin: 0,
            }}
          >
            لوحة المؤشرات الرئيسية
          </h1>
          <p
            style={{
              fontSize: 13,
              color: 'var(--text-3)',
              marginTop: 6,
              marginBottom: 0,
            }}
          >
            نظرة تنفيذية لحظية على الحضور الإعلامي والرقمي للمتحف
          </p>
        </div>
        <div
          style={{
            fontSize: 14,
            color: 'var(--text-3)',
            whiteSpace: 'nowrap',
            background: 'var(--bg-card)',
            padding: '8px 16px',
            borderRadius: 8,
            border: '1px solid var(--border)',
          }}
        >
          إجمالي الأخبار المتحقق منها:{' '}
          <span
            style={{
              color: 'var(--gold)',
              fontWeight: 800,
              fontSize: 18,
            }}
          >
            {total}
          </span>
        </div>
      </div>

      {/* الصف الجديد الأول: 5 كروت دائرية */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-5 w-full">
        <CircularKPICard
          percentage={positiveSentimentPct}
          label="تفاعل الناس"
          sub="البيئة العامة إيجابية، الأسئلة تدور حول الحجز"
          color="#007a6e"
        />
        <CircularKPICard
          percentage={CONFIG.STATIC_METRICS.Internet.visibility}
          label="ظهور الإنترنت"
          sub="أخبار ومقالات، يقوى بمزيد من media monitoring"
          color="#0a58ca"
        />
        <CircularKPICard
          percentage={positiveSentimentPct}
          label="ظهور السوشيال"
          sub={`حضور قوي في Facebook, TikTok, Instagram`}
          color="#c25e00"
        />
        <CircularKPICard
          percentage={strongestPlatformPct}
          label={`أقوى منصة: ${strongestPlatform.label}`}
          sub={`${strongestPlatform.count.toLocaleString()} متابعاً - الجمهور الأكبر`}
          color={strongestPlatform.color}
        />
        <CircularKPICard
          percentage={platformEngagementRate}
          label="تفاعل المنصات"
          sub="بناءً على إجمالي التفاعل والوصول المتاح"
          color="#007a6e"
        />
      </div>

      {/* الصف الجديد الثاني: 4 كروت إجمالي */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5 w-full">
        <SummaryMetricCard
          label="إجمالي التفاعل المتاح"
          value={formatLargeNum(totalEngagement, '+')}
          footer="إعجابات + تعليقات + مشاركات مرصودة"
        />
        <SummaryMetricCard
          label="مشاهدات YouTube"
          value={ytData ? formatLargeNum(ytData.totalViews) : '--'}
          footer={ytData ? `${ytData.total} فيديو محلَّل` : 'جاري التحميل...'}
          badge={ytData ? 'نشط' : undefined}
          badgeColor={ytData ? 'var(--pos)' : undefined}
        />
        <SummaryMetricCard
          label="إجمالي الإعجابات المتاحة"
          value={formatLargeNum(totalLikes, '+')}
          footer="TikTok المصدر الأكبر"
          badge="TikTok"
          badgeColor="#0f766e"
        />
        <SummaryMetricCard
          label="إجمالي المتابعين المعروف"
          value={formatLargeNum(totalFollowers, '+')}
          footer="فيسبوك + إنستجرام + تيك توك"
        />
      </div>

      {/* الصف الخامس (السابق الأول): 4 كروت */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5 w-full">
        <KPICard
          icon={Newspaper}
          iconColor="#e8b84b"
          label="أخبار جديدة اليوم"
          value={todayCount || '0'}
          sub="بناءً على تاريخ النشر"
          trend={todayCount > 0 ? 6 : undefined}
        />
        <KPICard
          icon={BarChart2}
          iconColor="#a78bfa"
          label="إجمالي الأخبار"
          value={total}
          sub={`أبرز منصة: ${platforms[0]?.name || '—'}`}
        />
        <KPICard
          icon={Globe}
          iconColor="#22c55e"
          label="أبرز المشاعر"
          value={sentiment[0]?.name || '—'}
          sub={`${sentiment[0]?.pct || 0}% من الإجمالي`}
          subColor={
            sentiment[0]?.name === 'إيجابي'
              ? '#22c55e'
              : sentiment[0]?.name === 'سلبي'
                ? '#ef4444'
                : 'var(--text-3)'
          }
        />
        <KPICard
          icon={Calendar}
          iconColor="#38bdf8"
          label="أحدث تغطية"
          value={articles[0]?.date?.slice(0, 10) || '—'}
          sub="آخر تاريخ في البيانات"
        />
      </div>

      {/* الصف الجديد الثالث: كارت حالة اتصال يوتيوب */}
      <YouTubeStatusCard youtubeData={ytData} status={ytStatus} />

      {/* الصف الجديد الرابع: المحقق وحجم الجمهور */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6 w-full">
        <div className="lg:col-span-4">
          <PrimaryAuditSummary />
        </div>
        <div className="lg:col-span-8">
          <AudiencePlatformSize tiktokStats={tiktokStats} facebookStats={fbStats} />
        </div>
      </div>



      {/* الصف الثاني: 3 كروت */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-5 w-full">
        <TrendingCard articles={articles} />
        <TopPlatformCard platforms={platforms} />
        <SentimentDonut data={sentiment} />
      </div>

      {/* الصف الثالث: 2 رسوم بيانية */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
        <DailyChart data={daily} />
        <PlatformChart data={platforms} />
      </div>
    </div>
  );
}