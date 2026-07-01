import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Facebook, Heart, Share2, MessageCircle, Users, Eye, TrendingUp, Activity, RefreshCw, Filter, X, ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import { loadFacebook } from '../store/slices/facebookSlice';
import { selectPageStats, selectFBPosts, selectFBStatus, selectFBError, selectFBAnalytics } from '../store/slices/facebookSlice';
import IGKPICard        from '../components/instagram/IGKPICard';
import FBEngagementChart from '../components/facebook/FBEngagementChart';
import PostsCountChart  from '../components/facebook/PostsCountChart';
import FBPostCard       from '../components/facebook/FBPostCard';

const PAGE_SIZE = 12;
const MONTH_NAMES = { '01':'يناير','02':'فبراير','03':'مارس','04':'أبريل','05':'مايو','06':'يونيو','07':'يوليو','08':'أغسطس','09':'سبتمبر','10':'أكتوبر','11':'نوفمبر','12':'ديسمبر' };
const FB_BLUE = '#1877f2';

function fmt(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000)    return (n / 1000).toFixed(1) + 'K';
  return n?.toLocaleString() ?? '0';
}

// Page stats header card
function PageStatsCard({ stats }) {
  if (!stats) return null;
  return (
    <div className="card fade-up" style={{ padding:'24px 28px', marginBottom:28, background:'linear-gradient(135deg, color-mix(in srgb, #1877f2 8%, var(--bg-card)), var(--bg-card))', border:'1px solid color-mix(in srgb, #1877f2 20%, var(--border))', position:'relative', overflow:'hidden' }}>
      {/* decorative circle */}
      <div style={{ position:'absolute', top:-40, left:-40, width:180, height:180, borderRadius:'50%', background:'color-mix(in srgb, #1877f2 6%, transparent)', pointerEvents:'none' }} />
      <div style={{ position:'relative', display:'flex', alignItems:'center', justifyContent:'space-between', gap:16, flexWrap:'wrap' }}>
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <div style={{ width:52, height:52, borderRadius:16, background:'#1877f2', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 8px 20px rgba(24,119,242,.4)' }}>
            <svg width={26} height={26} viewBox="0 0 24 24" fill="white">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
            </svg>
          </div>
          <div>
            <p style={{ fontSize:11, color:'var(--text-3)', marginBottom:3 }}>إحصائيات الصفحة · مباشر</p>
            <p style={{ fontSize:13, fontWeight:700, color:FB_BLUE }}>المتحف الدولي للسيرة النبوية</p>
          </div>
        </div>

        <div style={{ display:'flex', gap:28, flexWrap:'wrap' }}>
          {[
            { icon: Users,    label:'المتابعون',    value: fmt(stats.totalFollowers),    color:'#1877f2' },
            { icon: Heart,    label:'الإعجابات',    value: fmt(stats.totalLikes),        color:'#e1306c' },
            { icon: Eye,      label:'الوصول الشهري',value: fmt(stats.monthlyReach),      color:'#34d399' },
            { icon: Activity, label:'التفاعل الشهري',value: fmt(stats.monthlyEngagement),color:'#fbbf24' },
            { icon: Zap,      label:'النشطون الآن', value: stats.activeNow,              color:'#818cf8' },
            { icon: TrendingUp,label:'تقييم الصفحة',value: `${stats.pageRate}★`,        color:'#f59e0b' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
              <div style={{ width:36, height:36, borderRadius:10, background:`color-mix(in srgb, ${color} 12%, transparent)`, border:`1px solid color-mix(in srgb, ${color} 25%, transparent)`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Icon size={16} style={{ color }} />
              </div>
              <span style={{ fontSize:16, fontWeight:900, color:'var(--text-1)', lineHeight:1 }}>{value}</span>
              <span style={{ fontSize:10, color:'var(--text-3)', textAlign:'center' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function computeAnalytics(posts) {
  if (!posts.length) return null;
  const total       = posts.length;
  const totalReact  = posts.reduce((a,p) => a + p.reactions, 0);
  const totalShares = posts.reduce((a,p) => a + p.shares,    0);
  const totalCom    = posts.reduce((a,p) => a + p.comments,  0);
  const avgReact    = total ? Math.round(totalReact  / total) : 0;
  const avgEng      = total ? Math.round((totalReact + totalShares + totalCom) / total) : 0;
  const withLink    = posts.filter(p => p.link).length;

  const monthMap = {};
  posts.forEach(p => {
    const key = p.date?.slice(0,7);
    if (!key) return;
    if (!monthMap[key]) monthMap[key] = { key, count:0, reactions:0, shares:0, comments:0 };
    monthMap[key].count++;
    monthMap[key].reactions += p.reactions;
    monthMap[key].shares    += p.shares;
    monthMap[key].comments  += p.comments;
  });
  const timeline = Object.values(monthMap).sort((a,b)=>a.key.localeCompare(b.key)).map(m=>({
    ...m, label: new Date(m.key+'-01').toLocaleDateString('ar-EG',{month:'short',year:'2-digit'}),
  }));

  const topPosts = [...posts].sort((a,b) => (b.reactions+b.shares+b.comments)-(a.reactions+a.shares+a.comments)).slice(0,5);
  return { total, totalReact, totalShares, totalCom, avgReact, avgEng, timeline, topPosts, withLink };
}

export default function FacebookPage() {
  const dispatch   = useDispatch();
  const pageStats  = useSelector(selectPageStats);
  const posts      = useSelector(selectFBPosts);
  const status     = useSelector(selectFBStatus);
  const error      = useSelector(selectFBError);

  const [filterYear,  setFilterYear]  = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => { if (status === 'idle') dispatch(loadFacebook()); }, [status, dispatch]);
  useEffect(() => { setPage(1); }, [filterYear, filterMonth]);

  const loading = status === 'loading' || status === 'idle';

  const { years, months } = useMemo(() => {
    const ys = [...new Set(posts.map(p => p.date?.slice(0,4)).filter(Boolean))].sort((a,b)=>b-a);
    const ms = filterYear
      ? [...new Set(posts.filter(p=>p.date?.startsWith(filterYear)).map(p=>p.date?.slice(0,7)).filter(Boolean))].sort()
      : [];
    return { years:ys, months:ms };
  }, [posts, filterYear]);

  const filteredPosts = useMemo(() => {
    return [...posts].filter(p => {
      if (filterYear  && !p.date?.startsWith(filterYear))  return false;
      if (filterMonth && !p.date?.startsWith(filterMonth)) return false;
      return true;
    }).sort((a,b) => (b.date||'').localeCompare(a.date||''));
  }, [posts, filterYear, filterMonth]);

  const analytics  = useMemo(() => computeAnalytics(filteredPosts), [filteredPosts]);
  const totalPages = Math.ceil(filteredPosts.length / PAGE_SIZE);
  const pagedPosts = filteredPosts.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);
  const hasFilters = filterYear;
  const clearFilters = () => { setFilterYear(''); setFilterMonth(''); };

  return (
    <div style={{ maxWidth:1400, margin:'0 auto', direction:'rtl' }}>

      {/* Header */}
      <div className="fade-up" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24, flexWrap:'wrap', gap:12 }}>
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
          <div style={{ width:52, height:52, borderRadius:16, background:'#1877f2', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 8px 24px rgba(24,119,242,.4)' }}>
            <svg width={26} height={26} viewBox="0 0 24 24" fill="white">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
            </svg>
          </div>
          <div>
            <h1 className="page-title" style={{ margin:0 }}>تحليلات فيسبوك</h1>
            <p style={{ fontSize:13, color:'var(--text-3)', marginTop:4 }}>
              {posts.length > 0
                ? `${filteredPosts.length} منشور${filteredPosts.length !== posts.length ? ` من ${posts.length}` : ' محلَّل'}`
                : 'بيانات الصفحة والمنشورات'}
            </p>
          </div>
        </div>
        <button onClick={() => dispatch(loadFacebook())} disabled={loading} className="btn-outline"
          style={{ display:'flex', alignItems:'center', gap:8, opacity:loading?.5:1, cursor:loading?'not-allowed':'pointer' }}>
          <RefreshCw size={14} style={{ animation:loading?'spin 1s linear infinite':'none' }} />
          <span>تحديث</span>
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign:'center', padding:'80px 0', color:'var(--text-3)', fontSize:14 }}>
          <div style={{ width:40, height:40, border:'3px solid var(--border)', borderTopColor:FB_BLUE, borderRadius:'50%', animation:'spin 1s linear infinite', margin:'0 auto 16px' }} />
          جاري تحميل البيانات...
        </div>
      )}

      {/* Error */}
      {status === 'failed' && !loading && (
        <div style={{ background:'color-mix(in srgb, var(--neg) 10%, transparent)', border:'1px solid color-mix(in srgb, var(--neg) 30%, transparent)', borderRadius:12, padding:'20px 24px', color:'var(--neg)', fontSize:13 }}>
          ⚠️ خطأ في تحميل البيانات: {error}
        </div>
      )}

      {status === 'succeeded' && (
        <>
          {/* Page stats hero */}
          <PageStatsCard stats={pageStats} />

          {/* Filters */}
          {posts.length > 0 && (
            <div className="card fade-up" style={{ padding:'16px 20px', marginBottom:24, display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, color:'var(--text-3)', flexShrink:0 }}>
                <Filter size={14}/><span style={{ fontSize:12, fontWeight:700 }}>تصفية المنشورات</span>
              </div>

              <select value={filterYear} onChange={e=>{setFilterYear(e.target.value);setFilterMonth('');}}
                style={{ fontSize:12, fontWeight:600, padding:'6px 10px', borderRadius:8, border:'1px solid var(--border)', background:'var(--bg-base)', color:'var(--text-1)', cursor:'pointer', direction:'rtl' }}>
                <option value="">كل السنوات</option>
                {years.map(y=><option key={y} value={y}>{y}</option>)}
              </select>

              {filterYear && months.length > 0 && (
                <select value={filterMonth} onChange={e=>setFilterMonth(e.target.value)}
                  style={{ fontSize:12, fontWeight:600, padding:'6px 10px', borderRadius:8, border:'1px solid var(--border)', background:'var(--bg-base)', color:'var(--text-1)', cursor:'pointer', direction:'rtl' }}>
                  <option value="">كل الأشهر</option>
                  {months.map(m=>{const[,mo]=m.split('-');return<option key={m} value={m}>{MONTH_NAMES[mo]||mo}</option>;})}
                </select>
              )}

              {hasFilters && (
                <button onClick={clearFilters}
                  style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, fontWeight:600, color:'var(--neg)', background:'transparent', border:'none', cursor:'pointer', marginRight:'auto', padding:'4px 8px' }}>
                  <X size={12}/>مسح الفلاتر
                </button>
              )}
            </div>
          )}

          {analytics && (
            <>
              {/* KPI Cards */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(190px, 1fr))', gap:16, marginBottom:28 }}>
                <IGKPICard icon={Facebook}       label="إجمالي المنشورات"    value={analytics.total}              iconColor={FB_BLUE} delay={0}    large />
                <IGKPICard icon={Heart}          label="إجمالي التفاعلات"    value={fmt(analytics.totalReact)}    iconColor="#e1306c" delay={0.05} />
                <IGKPICard icon={Share2}         label="إجمالي المشاركات"    value={fmt(analytics.totalShares)}   iconColor="#34d399" delay={0.1}  />
                <IGKPICard icon={MessageCircle}  label="إجمالي التعليقات"    value={fmt(analytics.totalCom)}      iconColor="#fbbf24" delay={0.15} />
                <IGKPICard icon={TrendingUp}     label="متوسط التفاعل/منشور" value={analytics.avgReact}           iconColor={FB_BLUE} delay={0.2}  />
                <IGKPICard icon={Activity}       label="متوسط التفاعل الكلي" value={analytics.avgEng}             iconColor="#818cf8" delay={0.25}
                  sub="تفاعلات + مشاركات + تعليقات" />
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5 mb-7">
                <FBEngagementChart data={analytics.timeline} />
                <PostsCountChart   data={analytics.timeline} />
              </div>

              {/* Top 5 posts */}
              {analytics.topPosts?.length > 0 && (
                <div style={{ marginBottom:28 }}>
                  <h2 style={{ fontSize:16, fontWeight:800, color:'var(--text-1)', marginBottom:16 }}>🏆 أعلى المنشورات تفاعلاً</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {analytics.topPosts.map((p,i) => <FBPostCard key={p.id||i} post={p} rank={i+1} />)}
                  </div>
                </div>
              )}

              {/* All posts */}
              <div>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
                  <h2 style={{ fontSize:16, fontWeight:800, color:'var(--text-1)', margin:0 }}>
                    📋 جميع المنشورات ({filteredPosts.length})
                  </h2>
                  {totalPages > 1 && <span style={{ fontSize:12, color:'var(--text-3)' }}>صفحة {page} من {totalPages}</span>}
                </div>

                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(340px, 1fr))', gap:16, marginBottom:24 }}>
                  {pagedPosts.map((p,i) => <FBPostCard key={p.id||i} post={p} />)}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                    <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} className="btn-outline"
                      style={{ display:'flex', alignItems:'center', gap:4, padding:'7px 14px', opacity:page===1?.5:1, cursor:page===1?'not-allowed':'pointer' }}>
                      <ChevronRight size={14}/><span style={{ fontSize:12 }}>السابق</span>
                    </button>
                    <div style={{ display:'flex', gap:6 }}>
                      {Array.from({length:totalPages},(_,i)=>i+1)
                        .filter(p=>p===1||p===totalPages||Math.abs(p-page)<=1)
                        .reduce((acc,p,idx,arr)=>{ if(idx>0&&p-arr[idx-1]>1)acc.push('…'); acc.push(p); return acc; },[])
                        .map((p,i)=>p==='…'
                          ?<span key={`e${i}`} style={{ padding:'6px 4px',color:'var(--text-3)',fontSize:12 }}>…</span>
                          :<button key={p} onClick={()=>setPage(p)}
                            style={{ width:34,height:34,borderRadius:8,fontSize:12,fontWeight:p===page?800:500,border:p===page?`1px solid ${FB_BLUE}`:'1px solid var(--border)',background:p===page?`color-mix(in srgb, ${FB_BLUE} 15%, transparent)`:'transparent',color:p===page?FB_BLUE:'var(--text-2)',cursor:'pointer',transition:'all .15s' }}>{p}</button>
                        )}
                    </div>
                    <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages} className="btn-outline"
                      style={{ display:'flex', alignItems:'center', gap:4, padding:'7px 14px', opacity:page===totalPages?.5:1, cursor:page===totalPages?'not-allowed':'pointer' }}>
                      <span style={{ fontSize:12 }}>التالي</span><ChevronLeft size={14}/>
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Empty posts */}
          {posts.length === 0 && (
            <div style={{ textAlign:'center', padding:'60px 0', color:'var(--text-3)' }}>
              <Facebook size={48} style={{ opacity:.2, margin:'0 auto 16px', display:'block', color:FB_BLUE }} />
              <p style={{ fontSize:15 }}>لا توجد منشورات في ورقة facebook_posts</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
