import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Video, Heart, Share2, MessageCircle, Eye, TrendingUp, Activity, 
  RefreshCw, Filter, X, ChevronLeft, ChevronRight, Users, Zap,
  Clock, Image, Music
} from 'lucide-react';
import { loadTikTok } from '../store/slices/tiktokSlice';
import { 
  selectTikTokStats, 
  selectTikTokPosts, 
  selectTikTokAnalytics,
  selectTikTokStatus, 
  selectTikTokError 
} from '../store/slices/tiktokSlice';
import TikTokKPICard from '../components/tiktok/TikTokKPICard';
import TikTokVideoCard from '../components/tiktok/TikTokVideoCard';
import TikTokEngagementChart from '../components/tiktok/TikTokEngagementChart';
import TikTokViewsChart from '../components/tiktok/TikTokViewsChart';

const PAGE_SIZE = 12;
const MONTH_NAMES = {
  '01': 'يناير',
  '02': 'فبراير',
  '03': 'مارس',
  '04': 'أبريل',
  '05': 'مايو',
  '06': 'يونيو',
  '07': 'يوليو',
  '08': 'أغسطس',
  '09': 'سبتمبر',
  '10': 'أكتوبر',
  '11': 'نوفمبر',
  '12': 'ديسمبر'
};
const TIKTOK_CYAN = '#25f4ee';
const TIKTOK_PINK = '#fe2c55';

function fmt(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n?.toLocaleString() ?? '0';
}

function formatDuration(seconds) {
  if (!seconds) return '0:00';
  const num = parseInt(seconds);
  if (isNaN(num)) return '0:00';
  const mins = Math.floor(num / 60);
  const secs = num % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Stats Header
function TikTokStatsHeader({ stats }) {
  if (!stats) return null;
  
  return (
    <div className="card fade-up" style={{ 
      padding: '24px 28px', 
      marginBottom: 28, 
      background: 'linear-gradient(135deg, color-mix(in srgb, #25f4ee 8%, var(--bg-card)), var(--bg-card))',
      border: '1px solid color-mix(in srgb, #25f4ee 20%, var(--border))',
      position: 'relative', 
      overflow: 'hidden' 
    }}>
      {/* Decorative circles */}
      <div style={{ 
        position: 'absolute', 
        top: -40, 
        left: -40, 
        width: 180, 
        height: 180, 
        borderRadius: '50%', 
        background: 'color-mix(in srgb, #25f4ee 6%, transparent)',
        pointerEvents: 'none' 
      }} />
      <div style={{ 
        position: 'absolute', 
        bottom: -60, 
        right: -60, 
        width: 200, 
        height: 200, 
        borderRadius: '50%', 
        background: 'color-mix(in srgb, #fe2c55 4%, transparent)',
        pointerEvents: 'none' 
      }} />
      
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ 
            width: 52, 
            height: 52, 
            borderRadius: 16, 
            background: 'linear-gradient(135deg, #25f4ee, #fe2c55)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            boxShadow: '0 8px 20px rgba(37,244,238,.4)' 
          }}>
            <svg width={26} height={26} viewBox="0 0 24 24" fill="white">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 15.64a6.33 6.33 0 0 0 10.48 4.48 6.32 6.32 0 0 0 1.94-4.48V9.66a7.74 7.74 0 0 0 4.05 1.08V7.56a4.83 4.83 0 0 1-1.88-.87z"/>
            </svg>
          </div>
          <div>
            <p style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 3 }}>
              إحصائيات تيك توك · مباشر
            </p>
            <p style={{ fontSize: 13, fontWeight: 700, color: TIKTOK_CYAN }}>
             المتحف الدولي للسيرة النبوية
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
          {[
            { icon: Video, label: 'إجمالي الفيديوهات', value: stats.totalVideos, color: TIKTOK_CYAN },
            { icon: Eye, label: 'إجمالي المشاهدات', value: fmt(stats.totalViews), color: TIKTOK_PINK },
            { icon: Heart, label: 'إجمالي الإعجابات', value: fmt(stats.totalLikes), color: '#fe2c55' },
            { icon: Share2, label: 'إجمالي المشاركات', value: fmt(stats.totalShares), color: '#34d399' },
            { icon: MessageCircle, label: 'إجمالي التعليقات', value: fmt(stats.totalComments), color: '#fbbf24' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{ 
                width: 36, 
                height: 36, 
                borderRadius: 10, 
                background: `color-mix(in srgb, ${color} 12%, transparent)`,
                border: `1px solid color-mix(in srgb, ${color} 25%, transparent)`,
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <Icon size={16} style={{ color }} />
              </div>
              <span style={{ fontSize: 16, fontWeight: 900, color: 'var(--text-1)', lineHeight: 1 }}>
                {value}
              </span>
              <span style={{ fontSize: 10, color: 'var(--text-3)', textAlign: 'center' }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function TikTokPage() {
  const dispatch = useDispatch();
  const stats = useSelector(selectTikTokStats);
  const posts = useSelector(selectTikTokPosts);
  const analytics = useSelector(selectTikTokAnalytics);
  const status = useSelector(selectTikTokStatus);
  const error = useSelector(selectTikTokError);

  const [filterYear, setFilterYear] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (status === 'idle') dispatch(loadTikTok());
  }, [status, dispatch]);

  useEffect(() => {
    setPage(1);
  }, [filterYear, filterMonth]);

  const loading = status === 'loading' || status === 'idle';

  const { years, months } = useMemo(() => {
    const ys = [...new Set(posts.map(p => p.create_date?.slice(0, 4)).filter(Boolean))].sort((a, b) => b - a);
    const ms = filterYear
      ? [...new Set(posts.filter(p => p.create_date?.startsWith(filterYear)).map(p => p.create_date?.slice(0, 7)).filter(Boolean))].sort()
      : [];
    return { years: ys, months: ms };
  }, [posts, filterYear]);

  const filteredPosts = useMemo(() => {
    return [...posts].filter(p => {
      if (filterYear && !p.create_date?.startsWith(filterYear)) return false;
      if (filterMonth && !p.create_date?.startsWith(filterMonth)) return false;
      return true;
    }).sort((a, b) => (b.create_date || '').localeCompare(a.create_date || ''));
  }, [posts, filterYear, filterMonth]);

  const totalPages = Math.ceil(filteredPosts.length / PAGE_SIZE);
  const pagedPosts = filteredPosts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const hasFilters = filterYear;
  const clearFilters = () => { setFilterYear(''); setFilterMonth(''); };

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', direction: 'rtl' }}>
      {/* Header */}
      <div className="fade-up" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ 
            width: 52, 
            height: 52, 
            borderRadius: 16, 
            background: 'linear-gradient(135deg, #25f4ee, #fe2c55)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            boxShadow: '0 8px 24px rgba(37,244,238,.4)' 
          }}>
            <svg width={26} height={26} viewBox="0 0 24 24" fill="white">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 15.64a6.33 6.33 0 0 0 10.48 4.48 6.32 6.32 0 0 0 1.94-4.48V9.66a7.74 7.74 0 0 0 4.05 1.08V7.56a4.83 4.83 0 0 1-1.88-.87z"/>
            </svg>
          </div>
          <div>
            <h1 className="page-title" style={{ margin: 0 }}>تحليلات تيك توك</h1>
            <p style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 4 }}>
              {posts.length > 0
                ? `${filteredPosts.length} فيديو${filteredPosts.length !== posts.length ? ` من ${posts.length}` : ' محلَّل'}`
                : 'بيانات الفيديوهات والإحصائيات'}
            </p>
          </div>
        </div>
        <button 
          onClick={() => dispatch(loadTikTok())} 
          disabled={loading} 
          className="btn-outline"
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 8, 
            opacity: loading ? 0.5 : 1, 
            cursor: loading ? 'not-allowed' : 'pointer' 
          }}
        >
          <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          <span>تحديث</span>
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-3)', fontSize: 14 }}>
          <div style={{ 
            width: 40, 
            height: 40, 
            border: '3px solid var(--border)', 
            borderTopColor: TIKTOK_CYAN, 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite', 
            margin: '0 auto 16px' 
          }} />
          جاري تحميل البيانات...
        </div>
      )}

      {/* Error */}
      {status === 'failed' && !loading && (
        <div style={{ 
          background: 'color-mix(in srgb, var(--neg) 10%, transparent)', 
          border: '1px solid color-mix(in srgb, var(--neg) 30%, transparent)', 
          borderRadius: 12, 
          padding: '20px 24px', 
          color: 'var(--neg)', 
          fontSize: 13 
        }}>
          ⚠️ خطأ في تحميل البيانات: {error}
        </div>
      )}

      {status === 'succeeded' && (
        <>
          {/* Stats Header */}
          <TikTokStatsHeader stats={stats} />

          {/* Filters */}
          {posts.length > 0 && (
            <div className="card fade-up" style={{ 
              padding: '16px 20px', 
              marginBottom: 24, 
              display: 'flex', 
              alignItems: 'center', 
              gap: 12, 
              flexWrap: 'wrap' 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-3)', flexShrink: 0 }}>
                <Filter size={14}/>
                <span style={{ fontSize: 12, fontWeight: 700 }}>تصفية الفيديوهات</span>
              </div>

              <select 
                value={filterYear} 
                onChange={e => { setFilterYear(e.target.value); setFilterMonth(''); }}
                style={{ 
                  fontSize: 12, 
                  fontWeight: 600, 
                  padding: '6px 10px', 
                  borderRadius: 8, 
                  border: '1px solid var(--border)', 
                  background: 'var(--bg-base)', 
                  color: 'var(--text-1)', 
                  cursor: 'pointer', 
                  direction: 'rtl' 
                }}
              >
                <option value="">كل السنوات</option>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>

              {filterYear && months.length > 0 && (
                <select 
                  value={filterMonth} 
                  onChange={e => setFilterMonth(e.target.value)}
                  style={{ 
                    fontSize: 12, 
                    fontWeight: 600, 
                    padding: '6px 10px', 
                    borderRadius: 8, 
                    border: '1px solid var(--border)', 
                    background: 'var(--bg-base)', 
                    color: 'var(--text-1)', 
                    cursor: 'pointer', 
                    direction: 'rtl' 
                  }}
                >
                  <option value="">كل الأشهر</option>
                  {months.map(m => {
                    const [, mo] = m.split('-');
                    return <option key={m} value={m}>{MONTH_NAMES[mo] || mo}</option>;
                  })}
                </select>
              )}

              {hasFilters && (
                <button 
                  onClick={clearFilters}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 5, 
                    fontSize: 11, 
                    fontWeight: 600, 
                    color: 'var(--neg)', 
                    background: 'transparent', 
                    border: 'none', 
                    cursor: 'pointer', 
                    marginRight: 'auto', 
                    padding: '4px 8px' 
                  }}
                >
                  <X size={12}/>
                  مسح الفلاتر
                </button>
              )}
            </div>
          )}

          {analytics && (
            <>
              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style={{ gap: 16, marginBottom: 28 }}>
                <TikTokKPICard 
                  icon={Video} 
                  label="إجمالي الفيديوهات" 
                  value={analytics.total} 
                  iconColor={TIKTOK_CYAN} 
                  delay={0} 
                  large 
                />
                <TikTokKPICard 
                  icon={Eye} 
                  label="إجمالي المشاهدات" 
                  value={fmt(analytics.totalViews)} 
                  iconColor={TIKTOK_PINK} 
                  delay={0.05} 
                />
                <TikTokKPICard 
                  icon={Heart} 
                  label="إجمالي الإعجابات" 
                  value={fmt(analytics.totalLikes)} 
                  iconColor="#fe2c55" 
                  delay={0.1} 
                />
                <TikTokKPICard 
                  icon={Share2} 
                  label="إجمالي المشاركات" 
                  value={fmt(analytics.totalShares)} 
                  iconColor="#34d399" 
                  delay={0.15} 
                />
                <TikTokKPICard 
                  icon={MessageCircle} 
                  label="إجمالي التعليقات" 
                  value={fmt(analytics.totalComments)} 
                  iconColor="#fbbf24" 
                  delay={0.2} 
                />
                <TikTokKPICard 
                  icon={TrendingUp} 
                  label="معدل التفاعل" 
                  value={`${analytics.engagementRate}%`} 
                  iconColor={TIKTOK_CYAN} 
                  delay={0.25}
                  sub="نسبة التفاعل لكل مشاهدة" 
                />
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5 mb-7">
                <TikTokEngagementChart data={analytics.timeline} />
                <TikTokViewsChart data={analytics.timeline} />
              </div>

              {/* Top 5 Videos */}
              {analytics.topPosts?.length > 0 && (
                <div style={{ marginBottom: 28 }}>
                  <h2 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-1)', marginBottom: 16 }}>
                    🏆 أعلى الفيديوهات تفاعلاً
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
                    {analytics.topPosts.map((p, i) => (
                      <TikTokVideoCard key={p.id || i} video={p} rank={i + 1} />
                    ))}
                  </div>
                </div>
              )}

              {/* All Videos */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <h2 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-1)', margin: 0 }}>
                    📋 جميع الفيديوهات ({filteredPosts.length})
                  </h2>
                  {totalPages > 1 && (
                    <span style={{ fontSize: 12, color: 'var(--text-3)' }}>
                      صفحة {page} من {totalPages}
                    </span>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16, marginBottom: 24 }}>
                  {pagedPosts.map((p, i) => (
                    <TikTokVideoCard key={p.id || i} video={p} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <button 
                      onClick={() => setPage(p => Math.max(1, p - 1))} 
                      disabled={page === 1} 
                      className="btn-outline"
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 4, 
                        padding: '7px 14px',
                        opacity: page === 1 ? 0.5 : 1,
                        cursor: page === 1 ? 'not-allowed' : 'pointer' 
                      }}
                    >
                      <ChevronRight size={14}/>
                      <span style={{ fontSize: 12 }}>السابق</span>
                    </button>
                    
                    <div style={{ display: 'flex', gap: 6 }}>
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                        .reduce((acc, p, idx, arr) => {
                          if (idx > 0 && p - arr[idx - 1] > 1) acc.push('…');
                          acc.push(p);
                          return acc;
                        }, [])
                        .map((p, i) => p === '…' ? (
                          <span key={`e${i}`} style={{ padding: '6px 4px', color: 'var(--text-3)', fontSize: 12 }}>…</span>
                        ) : (
                          <button 
                            key={p} 
                            onClick={() => setPage(p)}
                            style={{ 
                              width: 34, 
                              height: 34, 
                              borderRadius: 8, 
                              fontSize: 12, 
                              fontWeight: p === page ? 800 : 500,
                              border: p === page ? `1px solid ${TIKTOK_CYAN}` : '1px solid var(--border)',
                              background: p === page ? `color-mix(in srgb, ${TIKTOK_CYAN} 15%, transparent)` : 'transparent',
                              color: p === page ? TIKTOK_CYAN : 'var(--text-2)',
                              cursor: 'pointer',
                              transition: 'all .15s' 
                            }}
                          >
                            {p}
                          </button>
                        ))}
                    </div>

                    <button 
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
                      disabled={page === totalPages} 
                      className="btn-outline"
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 4, 
                        padding: '7px 14px',
                        opacity: page === totalPages ? 0.5 : 1,
                        cursor: page === totalPages ? 'not-allowed' : 'pointer' 
                      }}
                    >
                      <span style={{ fontSize: 12 }}>التالي</span>
                      <ChevronLeft size={14}/>
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Empty posts */}
          {posts.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-3)' }}>
              <Video size={48} style={{ opacity: 0.2, margin: '0 auto 16px', display: 'block', color: TIKTOK_CYAN }} />
              <p style={{ fontSize: 15 }}>لا توجد فيديوهات في ورقة TikTok</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}