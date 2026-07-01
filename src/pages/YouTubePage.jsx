import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Youtube, Eye, ThumbsUp, MessageCircle, Star, TrendingUp, BarChart2, RefreshCw, Filter, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { loadYouTube } from '../store/slices/youtubeSlice';
import { selectVideos, selectYTStatus, selectYTError, selectYTAnalytics } from '../store/slices/youtubeSlice';
import IGKPICard    from '../components/instagram/IGKPICard';
import YTViewsChart from '../components/youtube/YTViewsChart';
import VideoCard    from '../components/youtube/VideoCard';

const PAGE_SIZE = 12;

function fmt(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000)    return (n / 1000).toFixed(1) + 'K';
  return n?.toLocaleString() ?? '0';
}

function computeAnalytics(videos) {
  if (!videos.length) return null;
  const total      = videos.length;
  const totalViews = videos.reduce((a,v) => a + v.views,    0);
  const totalLikes = videos.reduce((a,v) => a + v.likes,    0);
  const totalCom   = videos.reduce((a,v) => a + v.comments, 0);
  const totalFav   = videos.reduce((a,v) => a + v.favorites,0);
  const avgViews   = total ? Math.round(totalViews / total) : 0;
  const engRate    = totalViews ? +((( totalLikes + totalCom) / totalViews) * 100).toFixed(2) : 0;

  const timeline = [...videos]
    .filter(v => v.publishedAt)
    .sort((a,b) => a.publishedAt.localeCompare(b.publishedAt))
    .map(v => ({
      label:    new Date(v.publishedAt).toLocaleDateString('ar-EG', { month:'short', day:'numeric', year:'2-digit' }),
      date:     v.publishedAt,
      views:    v.views,
      likes:    v.likes,
      comments: v.comments,
    }));

  const topVideos = [...videos].sort((a,b) => b.views - a.views).slice(0,5);
  return { total, totalViews, totalLikes, totalCom, totalFav, avgViews, engRate, timeline, topVideos };
}

const MONTH_NAMES = { '01':'يناير','02':'فبراير','03':'مارس','04':'أبريل','05':'مايو','06':'يونيو','07':'يوليو','08':'أغسطس','09':'سبتمبر','10':'أكتوبر','11':'نوفمبر','12':'ديسمبر' };

export default function YouTubePage() {
  const dispatch = useDispatch();
  const videos   = useSelector(selectVideos);
  const status   = useSelector(selectYTStatus);
  const error    = useSelector(selectYTError);
  const allAnalytics = useSelector(selectYTAnalytics);

  const [filterYear,  setFilterYear]  = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => { if (status === 'idle') dispatch(loadYouTube()); }, [status, dispatch]);
  // Reset page when filters change
  useEffect(() => { setPage(1); }, [filterYear, filterMonth]);

  const loading = status === 'loading' || status === 'idle';

  const { years, months } = useMemo(() => {
    const ys = [...new Set(videos.map(v => v.publishedAt?.slice(0,4)).filter(Boolean))].sort((a,b)=>b-a);
    const ms = filterYear
      ? [...new Set(videos.filter(v=>v.publishedAt?.startsWith(filterYear)).map(v=>v.publishedAt?.slice(0,7)).filter(Boolean))].sort()
      : [];
    return { years: ys, months: ms };
  }, [videos, filterYear]);

  const filteredVideos = useMemo(() => {
    return [...videos]
      .filter(v => {
        if (filterYear  && !v.publishedAt?.startsWith(filterYear))  return false;
        if (filterMonth && !v.publishedAt?.startsWith(filterMonth)) return false;
        return true;
      })
      .sort((a,b) => (b.publishedAt||'').localeCompare(a.publishedAt||''));
  }, [videos, filterYear, filterMonth]);

  const analytics   = useMemo(() => computeAnalytics(filteredVideos), [filteredVideos]);
  const totalPages  = Math.ceil(filteredVideos.length / PAGE_SIZE);
  const pagedVideos = filteredVideos.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);
  const hasFilters  = filterYear;
  const clearFilters = () => { setFilterYear(''); setFilterMonth(''); };

  return (
    <div style={{ maxWidth:1400, margin:'0 auto', direction:'rtl' }}>

      {/* Header */}
      <div className="fade-up" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24, flexWrap:'wrap', gap:12 }}>
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
          <div style={{ width:52, height:52, borderRadius:16, background:'linear-gradient(135deg, #ff0000, #cc0000)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 8px 24px rgba(248,113,113,.35)' }}>
            <Youtube size={26} color="#fff" />
          </div>
          <div>
            <h1 className="page-title" style={{ margin:0 }}>تحليلات يوتيوب</h1>
            <p style={{ fontSize:13, color:'var(--text-3)', marginTop:4 }}>
              {videos.length > 0
                ? `${filteredVideos.length} فيديو${filteredVideos.length !== videos.length ? ` من ${videos.length}` : ' محلَّل'}`
                : 'بيانات الأداء والمشاهدات'}
            </p>
          </div>
        </div>
        <button
          onClick={() => dispatch(loadYouTube())}
          disabled={loading}
          className="btn-outline"
          style={{ display:'flex', alignItems:'center', gap:8, opacity: loading ? .5 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          <span>تحديث</span>
        </button>
      </div>

      {/* Filters */}
      {status === 'succeeded' && videos.length > 0 && (
        <div className="card fade-up" style={{ padding:'16px 20px', marginBottom:24, display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, color:'var(--text-3)', flexShrink:0 }}>
            <Filter size={14} />
            <span style={{ fontSize:12, fontWeight:700 }}>تصفية</span>
          </div>

          <select value={filterYear} onChange={e => { setFilterYear(e.target.value); setFilterMonth(''); }}
            style={{ fontSize:12, fontWeight:600, padding:'6px 10px', borderRadius:8, border:'1px solid var(--border)', background:'var(--bg-base)', color:'var(--text-1)', cursor:'pointer', direction:'rtl' }}>
            <option value="">كل السنوات</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>

          {filterYear && months.length > 0 && (
            <select value={filterMonth} onChange={e => setFilterMonth(e.target.value)}
              style={{ fontSize:12, fontWeight:600, padding:'6px 10px', borderRadius:8, border:'1px solid var(--border)', background:'var(--bg-base)', color:'var(--text-1)', cursor:'pointer', direction:'rtl' }}>
              <option value="">كل الأشهر</option>
              {months.map(m => {
                const [,mo] = m.split('-');
                return <option key={m} value={m}>{MONTH_NAMES[mo] || mo}</option>;
              })}
            </select>
          )}

          {hasFilters && (
            <button onClick={clearFilters}
              style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, fontWeight:600, color:'var(--neg)', background:'transparent', border:'none', cursor:'pointer', marginRight:'auto', padding:'4px 8px' }}>
              <X size={12} />مسح الفلاتر
            </button>
          )}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ textAlign:'center', padding:'80px 0', color:'var(--text-3)', fontSize:14 }}>
          <div style={{ width:40, height:40, border:'3px solid var(--border)', borderTopColor:'#f87171', borderRadius:'50%', animation:'spin 1s linear infinite', margin:'0 auto 16px' }} />
          جاري تحميل البيانات...
        </div>
      )}

      {/* Error */}
      {status === 'failed' && !loading && (
        <div style={{ background:'color-mix(in srgb, var(--neg) 10%, transparent)', border:'1px solid color-mix(in srgb, var(--neg) 30%, transparent)', borderRadius:12, padding:'20px 24px', color:'var(--neg)', fontSize:13 }}>
          ⚠️ خطأ في تحميل البيانات: {error}
        </div>
      )}

      {/* Content */}
      {status === 'succeeded' && analytics && (
        <>
          {/* KPI Cards */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:16, marginBottom:28 }}>
            <IGKPICard icon={Youtube}        label="إجمالي الفيديوهات"  value={analytics.total}           iconColor="#f87171" delay={0}    large />
            <IGKPICard icon={Eye}            label="إجمالي المشاهدات"   value={fmt(analytics.totalViews)} iconColor="#f87171" delay={0.05} />
            <IGKPICard icon={ThumbsUp}       label="إجمالي الإعجابات"   value={fmt(analytics.totalLikes)} iconColor="#fbbf24" delay={0.1}  />
            <IGKPICard icon={MessageCircle}  label="إجمالي التعليقات"   value={fmt(analytics.totalCom)}   iconColor="#818cf8" delay={0.15} />
            <IGKPICard icon={Star}           label="إجمالي المفضلة"     value={fmt(analytics.totalFav)}   iconColor="#34d399" delay={0.2}  />
            <IGKPICard icon={TrendingUp}     label="متوسط المشاهدات"    value={fmt(analytics.avgViews)}   iconColor="#f87171" delay={0.25} />
            {/* <IGKPICard icon={BarChart2}      label="معدل التفاعل"        value={`${analytics.engRate}%`}  iconColor="#818cf8" delay={0.3}
              sub="(إعجابات + تعليقات) ÷ مشاهدات" /> */}
          </div>

          {/* Chart */}
          <div style={{ marginBottom:28 }}>
            <YTViewsChart data={analytics.timeline} />
          </div>

          {/* Top 5 */}
          {analytics.topVideos?.length > 0 && (
            <div style={{ marginBottom:32 }}>
              <h2 style={{ fontSize:16, fontWeight:800, color:'var(--text-1)', marginBottom:16 }}>🏆 أكثر الفيديوهات مشاهدةً</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {analytics.topVideos.map((v, i) => (
                  <VideoCard key={v.id || i} video={v} rank={i + 1} />
                ))}
              </div>
            </div>
          )}

          {/* All Videos with pagination */}
          <div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
              <h2 style={{ fontSize:16, fontWeight:800, color:'var(--text-1)', margin:0 }}>
                📋 جميع الفيديوهات ({filteredVideos.length})
              </h2>
              {totalPages > 1 && (
                <span style={{ fontSize:12, color:'var(--text-3)' }}>
                  صفحة {page} من {totalPages}
                </span>
              )}
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:16, marginBottom:24 }}>
              {pagedVideos.map((v, i) => (
                <VideoCard key={v.id || i} video={v} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                <button
                  onClick={() => setPage(p => Math.max(1, p-1))}
                  disabled={page === 1}
                  className="btn-outline"
                  style={{ display:'flex', alignItems:'center', gap:4, padding:'7px 14px', opacity: page===1?.5:1, cursor: page===1?'not-allowed':'pointer' }}
                >
                  <ChevronRight size={14} />
                  <span style={{ fontSize:12 }}>السابق</span>
                </button>

                {/* Page numbers */}
                <div style={{ display:'flex', gap:6 }}>
                  {Array.from({ length: totalPages }, (_, i) => i+1)
                    .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                    .reduce((acc, p, idx, arr) => {
                      if (idx > 0 && p - arr[idx-1] > 1) acc.push('…');
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((p, i) =>
                      p === '…' ? (
                        <span key={`ellipsis-${i}`} style={{ padding:'6px 4px', color:'var(--text-3)', fontSize:12 }}>…</span>
                      ) : (
                        <button key={p} onClick={() => setPage(p)}
                          style={{ width:34, height:34, borderRadius:8, fontSize:12, fontWeight: p===page?800:500, border: p===page?'1px solid #f87171':'1px solid var(--border)', background: p===page?'color-mix(in srgb, #f87171 15%, transparent)':'transparent', color: p===page?'#f87171':'var(--text-2)', cursor:'pointer', transition:'all .15s' }}>
                          {p}
                        </button>
                      )
                    )
                  }
                </div>

                <button
                  onClick={() => setPage(p => Math.min(totalPages, p+1))}
                  disabled={page === totalPages}
                  className="btn-outline"
                  style={{ display:'flex', alignItems:'center', gap:4, padding:'7px 14px', opacity: page===totalPages?.5:1, cursor: page===totalPages?'not-allowed':'pointer' }}
                >
                  <span style={{ fontSize:12 }}>التالي</span>
                  <ChevronLeft size={14} />
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* No results */}
      {status === 'succeeded' && videos.length > 0 && !analytics && (
        <div style={{ textAlign:'center', padding:'60px 0', color:'var(--text-3)' }}>
          <Filter size={40} style={{ opacity:.2, margin:'0 auto 14px', display:'block' }} />
          <p style={{ fontSize:15, fontWeight:600 }}>لا توجد فيديوهات تطابق الفلتر</p>
          <button onClick={clearFilters} className="btn-outline" style={{ marginTop:14, fontSize:12 }}>مسح الفلاتر</button>
        </div>
      )}

      {/* Empty */}
      {status === 'succeeded' && videos.length === 0 && (
        <div style={{ textAlign:'center', padding:'80px 0', color:'var(--text-3)' }}>
          <Youtube size={48} style={{ opacity:.2, margin:'0 auto 16px', display:'block' }} />
          <p style={{ fontSize:15 }}>لا توجد بيانات في ورقة Youtube</p>
        </div>
      )}
    </div>
  );
}
