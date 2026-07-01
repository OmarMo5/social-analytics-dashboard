import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Instagram, Eye, Heart, MessageCircle, Share2, TrendingUp, BarChart2, RefreshCw, Filter, X, Film, Image, LayoutGrid, Video, Calendar } from 'lucide-react';
import { loadInstagram } from '../store/slices/instagramSlice';
import { selectPosts, selectIGStatus, selectIGError } from '../store/slices/instagramSlice';
import IGKPICard       from '../components/instagram/IGKPICard';
import EngagementChart from '../components/instagram/EngagementChart';
import MediaTypeChart  from '../components/instagram/MediaTypeChart';
import PostCard        from '../components/instagram/PostCard';

function fmt(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000)    return (n / 1000).toFixed(1) + 'K';
  return n?.toLocaleString() ?? '0';
}

const TYPE_META = {
  ALL:            { label:'كل الأنواع',  icon: Filter,     color:'var(--accent)' },
  VIDEO:          { label:'فيديو',       icon: Film,       color:'#e1306c' },
  IMAGE:          { label:'صورة',        icon: Image,      color:'#818cf8' },
  CAROUSEL_ALBUM: { label:'ألبوم',       icon: LayoutGrid, color:'#34d399' },
  REEL:           { label:'ريلز',        icon: Video,      color:'#f59e0b' },
};

function computeAnalytics(posts) {
  if (!posts.length) return null;
  const total      = posts.length;
  const totalLikes = posts.reduce((a,p) => a + p.likes, 0);
  const totalCom   = posts.reduce((a,p) => a + p.comments, 0);
  const totalReach = posts.reduce((a,p) => a + p.reach, 0);
  const totalShare = posts.reduce((a,p) => a + p.shares, 0);
  const avgReach   = total ? Math.round(totalReach / total) : 0;
  const engRate    = totalReach ? +((( totalLikes + totalCom + totalShare) / totalReach) * 100).toFixed(2) : 0;

  const typeMap = {};
  posts.forEach(p => { const t = p.mediaType||'OTHER'; typeMap[t] = (typeMap[t]||0)+1; });
  const mediaTypes = Object.entries(typeMap).map(([name,value]) => ({ name, value, pct: Math.round((value/total)*100) })).sort((a,b)=>b.value-a.value);

  const timeline = [...posts]
    .filter(p => p.date)
    .sort((a,b) => a.date.localeCompare(b.date))
    .map(p => ({
      label:    new Date(p.date).toLocaleDateString('ar-EG', { month:'short', day:'numeric' }),
      date:     p.date,
      reach:    p.reach,
      likes:    p.likes,
      comments: p.comments,
      shares:   p.shares,
    }));

  const topPosts = [...posts].sort((a,b) => b.reach - a.reach).slice(0,5);
  return { total, totalLikes, totalCom, totalReach, totalShare, avgReach, engRate, mediaTypes, timeline, topPosts };
}

export default function InstagramPage() {
  const dispatch = useDispatch();
  const posts    = useSelector(selectPosts);
  const status   = useSelector(selectIGStatus);
  const error    = useSelector(selectIGError);

  // Filters
  const [filterYear,  setFilterYear]  = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [filterType,  setFilterType]  = useState('ALL');

  useEffect(() => { if (status === 'idle') dispatch(loadInstagram()); }, [status, dispatch]);

  const loading = status === 'loading' || status === 'idle';

  // Derive available years & months from data
  const { years, months } = useMemo(() => {
    const ys = [...new Set(posts.map(p => p.date?.slice(0,4)).filter(Boolean))].sort((a,b)=>b-a);
    const ms = filterYear
      ? [...new Set(posts.filter(p=>p.date?.startsWith(filterYear)).map(p=>p.date?.slice(0,7)).filter(Boolean))].sort()
      : [];
    return { years: ys, months: ms };
  }, [posts, filterYear]);

  // Available media types
  const availableTypes = useMemo(() => {
    const ts = [...new Set(posts.map(p => p.mediaType).filter(Boolean))];
    return ts;
  }, [posts]);

  // Filtered posts
  const filteredPosts = useMemo(() => {
    return posts.filter(p => {
      if (filterYear  && !p.date?.startsWith(filterYear))        return false;
      if (filterMonth && !p.date?.startsWith(filterMonth))       return false;
      if (filterType !== 'ALL' && p.mediaType !== filterType)    return false;
      return true;
    });
  }, [posts, filterYear, filterMonth, filterType]);

  const analytics = useMemo(() => computeAnalytics(filteredPosts), [filteredPosts]);

  const hasFilters = filterYear || filterType !== 'ALL';

  const clearFilters = () => { setFilterYear(''); setFilterMonth(''); setFilterType('ALL'); };

  const MONTH_NAMES = { '01':'يناير','02':'فبراير','03':'مارس','04':'أبريل','05':'مايو','06':'يونيو','07':'يوليو','08':'أغسطس','09':'سبتمبر','10':'أكتوبر','11':'نوفمبر','12':'ديسمبر' };

  return (
    <div style={{ maxWidth:1400, margin:'0 auto', direction:'rtl' }}>

      {/* Page Header */}
      <div className="fade-up" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24, flexWrap:'wrap', gap:12 }}>
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
          <div style={{ width:52, height:52, borderRadius:16, background:'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 8px 24px rgba(225,48,108,.35)' }}>
            <Instagram size={26} color="#fff" />
          </div>
          <div>
            <h1 className="page-title" style={{ margin:0 }}>تحليلات إنستجرام</h1>
            <p style={{ fontSize:13, color:'var(--text-3)', marginTop:4 }}>
              {posts.length > 0
                ? `${filteredPosts.length} منشور${filteredPosts.length !== posts.length ? ` من ${posts.length}` : ' محلَّل'}`
                : 'بيانات الأداء والتفاعل'}
            </p>
          </div>
        </div>

        <button
          onClick={() => dispatch(loadInstagram())}
          disabled={loading}
          className="btn-outline"
          style={{ display:'flex', alignItems:'center', gap:8, opacity: loading ? .5 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          <span>تحديث</span>
        </button>
      </div>

      {/* ── Filters Bar ── */}
      {status === 'succeeded' && posts.length > 0 && (
        <div className="card fade-up" style={{ padding:'16px 20px', marginBottom:24, display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, color:'var(--text-3)', flexShrink:0 }}>
            <Filter size={14} />
            <span style={{ fontSize:12, fontWeight:700 }}>تصفية</span>
          </div>

          {/* Year */}
          <select
            value={filterYear}
            onChange={e => { setFilterYear(e.target.value); setFilterMonth(''); }}
            style={{ fontSize:12, fontWeight:600, padding:'6px 10px', borderRadius:8, border:'1px solid var(--border)', background:'var(--bg-base)', color:'var(--text-1)', cursor:'pointer', direction:'rtl' }}
          >
            <option value="">كل السنوات</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>

          {/* Month — only if year selected */}
          {filterYear && months.length > 0 && (
            <select
              value={filterMonth}
              onChange={e => setFilterMonth(e.target.value)}
              style={{ fontSize:12, fontWeight:600, padding:'6px 10px', borderRadius:8, border:'1px solid var(--border)', background:'var(--bg-base)', color:'var(--text-1)', cursor:'pointer', direction:'rtl' }}
            >
              <option value="">كل الأشهر</option>
              {months.map(m => {
                const [, mo] = m.split('-');
                return <option key={m} value={m}>{MONTH_NAMES[mo] || mo}</option>;
              })}
            </select>
          )}

          {/* Divider */}
          <div style={{ width:1, height:24, background:'var(--border)', flexShrink:0 }} />

          {/* Media type chips */}
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            {['ALL', ...availableTypes].map(t => {
              const meta = TYPE_META[t] || { label: t, icon: Film, color:'#64748b' };
              const Icon = meta.icon;
              const active = filterType === t;
              return (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  style={{
                    display:'flex', alignItems:'center', gap:6,
                    fontSize:12, fontWeight: active ? 700 : 500,
                    padding:'5px 12px', borderRadius:20,
                    border: active ? `1px solid ${meta.color}` : '1px solid var(--border)',
                    background: active ? `color-mix(in srgb, ${meta.color} 15%, transparent)` : 'transparent',
                    color: active ? meta.color : 'var(--text-2)',
                    cursor:'pointer', transition:'all .15s',
                  }}
                >
                  <Icon size={11} />
                  <span>{meta.label}</span>
                </button>
              );
            })}
          </div>

          {/* Clear */}
          {hasFilters && (
            <button
              onClick={clearFilters}
              style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, fontWeight:600, color:'var(--neg)', background:'transparent', border:'none', cursor:'pointer', marginRight:'auto', padding:'4px 8px' }}
            >
              <X size={12} />
              مسح الفلاتر
            </button>
          )}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ textAlign:'center', padding:'80px 0', color:'var(--text-3)', fontSize:14 }}>
          <div style={{ width:40, height:40, border:'3px solid var(--border)', borderTopColor:'#e1306c', borderRadius:'50%', animation:'spin 1s linear infinite', margin:'0 auto 16px' }} />
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
          {/* KPI Grid */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:12, marginBottom:28 }}>
            <IGKPICard icon={Instagram}     label="إجمالي المنشورات"  value={analytics.total}           iconColor="#e1306c" delay={0}    large />
            <IGKPICard icon={Eye}           label="إجمالي الوصول"     value={fmt(analytics.totalReach)} iconColor="#e1306c" delay={0.05} />
            <IGKPICard icon={Heart}         label="إجمالي الإعجابات"  value={fmt(analytics.totalLikes)} iconColor="#f59e0b" delay={0.1}  />
            <IGKPICard icon={MessageCircle} label="إجمالي التعليقات"  value={fmt(analytics.totalCom)}   iconColor="#818cf8" delay={0.15} />
            <IGKPICard icon={Share2}        label="إجمالي المشاركات"  value={fmt(analytics.totalShare)} iconColor="#34d399" delay={0.2}  />
            <IGKPICard icon={TrendingUp}    label="متوسط الوصول"      value={fmt(analytics.avgReach)}   iconColor="#e1306c" delay={0.25} />
            {/* <IGKPICard icon={BarChart2}     label="معدل التفاعل"      value={`${analytics.engRate}%`}   iconColor="#818cf8" delay={0.3}
              sub="(إعجابات + تعليقات + مشاركات) ÷ وصول" /> */}
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5 mb-7">
            <EngagementChart data={analytics.timeline} />
            <MediaTypeChart  data={analytics.mediaTypes} />
          </div>

          {/* Top Posts by Reach */}
          {analytics.topPosts?.length > 0 && (
            <div style={{ marginBottom:28 }}>
              <h2 style={{ fontSize:16, fontWeight:800, color:'var(--text-1)', marginBottom:16 }}>
                🏆 أفضل المنشورات وصولاً
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {analytics.topPosts.map((post, i) => (
                  <PostCard key={post.id || i} post={post} rank={i + 1} />
                ))}
              </div>
            </div>
          )}

          {/* All Posts */}
          <div>
            <h2 style={{ fontSize:16, fontWeight:800, color:'var(--text-1)', marginBottom:16 }}>
              📋 جميع المنشورات ({filteredPosts.length})
            </h2>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:16 }}>
              {[...filteredPosts]
                .sort((a, b) => (b.date||'').localeCompare(a.date||''))
                .map((post, i) => (
                  <PostCard key={post.id || i} post={post} />
                ))}
            </div>
          </div>
        </>
      )}

      {/* No results after filter */}
      {status === 'succeeded' && posts.length > 0 && !analytics && (
        <div style={{ textAlign:'center', padding:'60px 0', color:'var(--text-3)' }}>
          <Filter size={40} style={{ opacity:.2, margin:'0 auto 14px', display:'block' }} />
          <p style={{ fontSize:15, fontWeight:600 }}>لا توجد منشورات تطابق الفلتر</p>
          <button onClick={clearFilters} className="btn-outline" style={{ marginTop:14, fontSize:12 }}>مسح الفلاتر</button>
        </div>
      )}

      {/* Empty state */}
      {status === 'succeeded' && posts.length === 0 && (
        <div style={{ textAlign:'center', padding:'80px 0', color:'var(--text-3)' }}>
          <Instagram size={48} style={{ opacity:.2, margin:'0 auto 16px', display:'block' }} />
          <p style={{ fontSize:15 }}>لا توجد بيانات في ورقة instagram</p>
        </div>
      )}
    </div>
  );
}
