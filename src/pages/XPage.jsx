import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Heart, Repeat2, MessageCircle, Quote, Bookmark, TrendingUp,
  RefreshCw, Filter, X as XIcon, ChevronLeft, ChevronRight, MessageSquareText
} from 'lucide-react';
import { loadX } from '../store/slices/xSlice';
import {
  selectXStats,
  selectXTweets,
  selectXAnalytics,
  selectXStatus,
  selectXError
} from '../store/slices/xSlice';
import XKPICard from '../components/x/XKPICard';
import XPostCard from '../components/x/XPostCard';
import XEngagementChart from '../components/x/XEngagementChart';
import XVolumeChart from '../components/x/XVolumeChart';
import XLanguageDonut from '../components/x/XLanguageDonut';

const PAGE_SIZE = 12;
const MONTH_NAMES = {
  '01': 'يناير', '02': 'فبراير', '03': 'مارس', '04': 'أبريل',
  '05': 'مايو', '06': 'يونيو', '07': 'يوليو', '08': 'أغسطس',
  '09': 'سبتمبر', '10': 'أكتوبر', '11': 'نوفمبر', '12': 'ديسمبر'
};
const X_BLUE = '#1d9bf0';

function fmt(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n?.toLocaleString() ?? '0';
}

const X_LOGO_PATH = 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z';

function XStatsHeader({ stats }) {
  if (!stats) return null;

  return (
    <div className="card fade-up" style={{
      padding: '24px 28px',
      marginBottom: 28,
      background: 'linear-gradient(135deg, color-mix(in srgb, #1d9bf0 8%, var(--bg-card)), var(--bg-card))',
      border: '1px solid color-mix(in srgb, #1d9bf0 20%, var(--border))',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute', top: -40, left: -40, width: 180, height: 180,
        borderRadius: '50%', background: 'color-mix(in srgb, #1d9bf0 6%, transparent)', pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', bottom: -60, right: -60, width: 200, height: 200,
        borderRadius: '50%', background: 'color-mix(in srgb, #e7e9ea 4%, transparent)', pointerEvents: 'none'
      }} />

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 16, background: '#000',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 20px rgba(29,155,240,.35)', border: '1px solid rgba(255,255,255,.08)'
          }}>
            <svg width={24} height={24} viewBox="0 0 24 24" fill="white">
              <path d={X_LOGO_PATH} />
            </svg>
          </div>
          <div>
            <p style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 3 }}>
              إحصائيات منصة X · مباشر
            </p>
            <p style={{ fontSize: 13, fontWeight: 700, color: X_BLUE }}>
              المتحف الدولي للسيرة النبوية
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
          {[
            { icon: MessageSquareText, label: 'إجمالي التغريدات', value: stats.totalTweets, color: X_BLUE },
            { icon: Heart, label: 'إجمالي الإعجابات', value: fmt(stats.totalLikes), color: '#f91880' },
            { icon: Repeat2, label: 'إجمالي إعادة النشر', value: fmt(stats.totalRetweets), color: '#00ba7c' },
            { icon: MessageCircle, label: 'إجمالي الردود', value: fmt(stats.totalReplies), color: X_BLUE },
            { icon: Bookmark, label: 'إجمالي الحفظ', value: fmt(stats.totalBookmarks), color: '#a78bfa' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: `color-mix(in srgb, ${color} 12%, transparent)`,
                border: `1px solid color-mix(in srgb, ${color} 25%, transparent)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
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

export default function XPage() {
  const dispatch = useDispatch();
  const stats = useSelector(selectXStats);
  const tweets = useSelector(selectXTweets);
  const analytics = useSelector(selectXAnalytics);
  const status = useSelector(selectXStatus);
  const error = useSelector(selectXError);

  const [filterYear, setFilterYear] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [filterLang, setFilterLang] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (status === 'idle') dispatch(loadX());
  }, [status, dispatch]);

  useEffect(() => {
    setPage(1);
  }, [filterYear, filterMonth, filterLang]);

  const loading = status === 'loading' || status === 'idle';

  const { years, months, languages } = useMemo(() => {
    const ys = [...new Set(tweets.map(t => t.created_date?.slice(0, 4)).filter(Boolean))].sort((a, b) => b - a);
    const ms = filterYear
      ? [...new Set(tweets.filter(t => t.created_date?.startsWith(filterYear)).map(t => t.created_date?.slice(0, 7)).filter(Boolean))].sort()
      : [];
    const langs = [...new Set(tweets.map(t => t.language).filter(Boolean))].sort();
    return { years: ys, months: ms, languages: langs };
  }, [tweets, filterYear]);

  const filteredTweets = useMemo(() => {
    return [...tweets].filter(t => {
      if (filterYear && !t.created_date?.startsWith(filterYear)) return false;
      if (filterMonth && !t.created_date?.startsWith(filterMonth)) return false;
      if (filterLang && t.language !== filterLang) return false;
      return true;
    }).sort((a, b) => (b.created_date + (b.created_time || '')).localeCompare(a.created_date + (a.created_time || '')));
  }, [tweets, filterYear, filterMonth, filterLang]);

  const totalPages = Math.ceil(filteredTweets.length / PAGE_SIZE);
  const pagedTweets = filteredTweets.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const hasFilters = filterYear || filterLang;
  const clearFilters = () => { setFilterYear(''); setFilterMonth(''); setFilterLang(''); };

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', direction: 'rtl' }}>
      {/* Header */}
      <div className="fade-up" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 16, background: '#000',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(29,155,240,.35)', border: '1px solid rgba(255,255,255,.08)'
          }}>
            <svg width={24} height={24} viewBox="0 0 24 24" fill="white">
              <path d={X_LOGO_PATH} />
            </svg>
          </div>
          <div>
            <h1 className="page-title" style={{ margin: 0 }}>تحليلات منصة X</h1>
            <p style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 4 }}>
              {tweets.length > 0
                ? `${filteredTweets.length} تغريدة${filteredTweets.length !== tweets.length ? ` من ${tweets.length}` : ' محلَّلة'}`
                : 'بيانات التغريدات والإحصائيات'}
            </p>
          </div>
        </div>
        <button
          onClick={() => dispatch(loadX())}
          disabled={loading}
          className="btn-outline"
          style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: loading ? 0.5 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          <span>تحديث</span>
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-3)', fontSize: 14 }}>
          <div style={{
            width: 40, height: 40, border: '3px solid var(--border)', borderTopColor: X_BLUE,
            borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px'
          }} />
          جاري تحميل البيانات...
        </div>
      )}

      {/* Error */}
      {status === 'failed' && !loading && (
        <div style={{
          background: 'color-mix(in srgb, var(--neg) 10%, transparent)',
          border: '1px solid color-mix(in srgb, var(--neg) 30%, transparent)',
          borderRadius: 12, padding: '20px 24px', color: 'var(--neg)', fontSize: 13
        }}>
          ⚠️ خطأ في تحميل البيانات: {error}
        </div>
      )}

      {status === 'succeeded' && (
        <>
          <XStatsHeader stats={stats} />

          {/* Filters */}
          {tweets.length > 0 && (
            <div className="card fade-up" style={{ padding: '16px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-3)', flexShrink: 0 }}>
                <Filter size={14} />
                <span style={{ fontSize: 12, fontWeight: 700 }}>تصفية التغريدات</span>
              </div>

              <select
                value={filterYear}
                onChange={e => { setFilterYear(e.target.value); setFilterMonth(''); }}
                style={{ fontSize: 12, fontWeight: 600, padding: '6px 10px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-base)', color: 'var(--text-1)', cursor: 'pointer', direction: 'rtl' }}
              >
                <option value="">كل السنوات</option>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>

              {filterYear && months.length > 0 && (
                <select
                  value={filterMonth}
                  onChange={e => setFilterMonth(e.target.value)}
                  style={{ fontSize: 12, fontWeight: 600, padding: '6px 10px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-base)', color: 'var(--text-1)', cursor: 'pointer', direction: 'rtl' }}
                >
                  <option value="">كل الأشهر</option>
                  {months.map(m => {
                    const [, mo] = m.split('-');
                    return <option key={m} value={m}>{MONTH_NAMES[mo] || mo}</option>;
                  })}
                </select>
              )}

              {languages.length > 0 && (
                <select
                  value={filterLang}
                  onChange={e => setFilterLang(e.target.value)}
                  style={{ fontSize: 12, fontWeight: 600, padding: '6px 10px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-base)', color: 'var(--text-1)', cursor: 'pointer', direction: 'rtl' }}
                >
                  <option value="">كل اللغات</option>
                  {languages.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              )}

              {hasFilters && (
                <button
                  onClick={clearFilters}
                  style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600, color: 'var(--neg)', background: 'transparent', border: 'none', cursor: 'pointer', marginRight: 'auto', padding: '4px 8px' }}
                >
                  <XIcon size={12} />
                  مسح الفلاتر
                </button>
              )}
            </div>
          )}

          {analytics && (
            <>
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4" style={{ gap: 16, marginBottom: 28 }}>
                <XKPICard icon={MessageSquareText} label="إجمالي التغريدات" value={analytics.total} iconColor={X_BLUE} delay={0} large />
                <XKPICard icon={Heart} label="إجمالي الإعجابات" value={fmt(analytics.totalLikes)} iconColor="#f91880" delay={0.05} />
                <XKPICard icon={Repeat2} label="إجمالي إعادة النشر" value={fmt(analytics.totalRetweets)} iconColor="#00ba7c" delay={0.1} />
                <XKPICard icon={MessageCircle} label="إجمالي الردود" value={fmt(analytics.totalReplies)} iconColor={X_BLUE} delay={0.15} />
                <XKPICard icon={Quote} label="إجمالي الاقتباسات" value={fmt(analytics.totalQuotes)} iconColor="#fbbf24" delay={0.2} />
                <XKPICard icon={Bookmark} label="إجمالي الحفظ" value={fmt(analytics.totalBookmarks)} iconColor="#a78bfa" delay={0.25} />
                <XKPICard
                  icon={TrendingUp}
                  label="متوسط التفاعل"
                  value={fmt(analytics.avgEngagement)}
                  iconColor={X_BLUE}
                  delay={0.3}
                  sub="لكل تغريدة"
                />
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
                <div className="lg:col-span-2">
                  <XEngagementChart data={analytics.timeline} />
                </div>
                <XLanguageDonut data={analytics.languages} />
              </div>
              <div className="mb-7">
                <XVolumeChart data={analytics.timeline} />
              </div>

              {/* Top 5 Tweets */}
              {analytics.topTweets?.length > 0 && (
                <div style={{ marginBottom: 28 }}>
                  <h2 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-1)', marginBottom: 16 }}>
                    🏆 أعلى التغريدات تفاعلاً
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
                    {analytics.topTweets.map((t, i) => (
                      <XPostCard key={t.id || i} tweet={t} rank={i + 1} />
                    ))}
                  </div>
                </div>
              )}

              {/* All Tweets */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <h2 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-1)', margin: 0 }}>
                    📋 جميع التغريدات ({filteredTweets.length})
                  </h2>
                  {totalPages > 1 && (
                    <span style={{ fontSize: 12, color: 'var(--text-3)' }}>
                      صفحة {page} من {totalPages}
                    </span>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16, marginBottom: 24 }}>
                  {pagedTweets.map((t, i) => (
                    <XPostCard key={t.id || i} tweet={t} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="btn-outline"
                      style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '7px 14px', opacity: page === 1 ? 0.5 : 1, cursor: page === 1 ? 'not-allowed' : 'pointer' }}
                    >
                      <ChevronRight size={14} />
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
                              width: 34, height: 34, borderRadius: 8, fontSize: 12, fontWeight: p === page ? 800 : 500,
                              border: p === page ? `1px solid ${X_BLUE}` : '1px solid var(--border)',
                              background: p === page ? `color-mix(in srgb, ${X_BLUE} 15%, transparent)` : 'transparent',
                              color: p === page ? X_BLUE : 'var(--text-2)',
                              cursor: 'pointer', transition: 'all .15s'
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
                      style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '7px 14px', opacity: page === totalPages ? 0.5 : 1, cursor: page === totalPages ? 'not-allowed' : 'pointer' }}
                    >
                      <span style={{ fontSize: 12 }}>التالي</span>
                      <ChevronLeft size={14} />
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Empty tweets */}
          {tweets.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-3)' }}>
              <MessageSquareText size={48} style={{ opacity: 0.2, margin: '0 auto 16px', display: 'block', color: X_BLUE }} />
              <p style={{ fontSize: 15 }}>لا توجد تغريدات في ورقة X</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
