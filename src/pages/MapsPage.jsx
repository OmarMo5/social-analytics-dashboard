import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Map, Star, ThumbsUp, MessageSquare, Image, Bot, RefreshCw, Filter, X, ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';
import { loadMaps } from '../store/slices/mapsSlice';
import { selectReviews, selectMapsStatus, selectMapsError, selectMapsAnalytics } from '../store/slices/mapsSlice';
import IGKPICard           from '../components/instagram/IGKPICard';
import StarsBar            from '../components/maps/StarsBar';
import ReviewsTimelineChart from '../components/maps/ReviewsTimelineChart';
import BranchesTable       from '../components/maps/BranchesTable';
import ReviewCard          from '../components/maps/ReviewCard';

const PAGE_SIZE = 12;
const MONTH_NAMES = { '01':'يناير','02':'فبراير','03':'مارس','04':'أبريل','05':'مايو','06':'يونيو','07':'يوليو','08':'أغسطس','09':'سبتمبر','10':'أكتوبر','11':'نوفمبر','12':'ديسمبر' };

function StarKPI({ avg }) {
  const color = avg >= 4 ? '#22c55e' : avg >= 3 ? '#eab308' : '#ef4444';
  return (
    <div className="card fade-up" style={{ padding:'20px 22px', display:'flex', flexDirection:'column', justifyContent:'space-between', minHeight:136 }}>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
        <p style={{ fontSize:12, fontWeight:600, color:'var(--text-2)' }}>متوسط التقييم</p>
        <div style={{ width:40, height:40, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', background:`color-mix(in srgb, #fbbf24 15%, transparent)`, border:'1px solid color-mix(in srgb, #fbbf24 25%, transparent)' }}>
          <Star size={18} style={{ color:'#fbbf24' }} fill="#fbbf24" />
        </div>
      </div>
      <div>
        <div style={{ display:'flex', alignItems:'baseline', gap:8 }}>
          <span style={{ fontSize:'2.2rem', fontWeight:900, color, lineHeight:1 }}>{avg}</span>
          <span style={{ fontSize:13, color:'var(--text-3)' }}>/ 5</span>
        </div>
        <div style={{ display:'flex', gap:3, marginTop:8 }}>
          {[1,2,3,4,5].map(i => (
            <svg key={i} width={14} height={14} viewBox="0 0 24 24">
              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
                fill={avg >= i ? '#fbbf24' : avg >= i-0.5 ? 'url(#hf)' : 'var(--border)'} />
            </svg>
          ))}
        </div>
      </div>
    </div>
  );
}

function computeAnalytics(reviews) {
  if (!reviews.length) return null;
  const total      = reviews.length;
  const avgStars   = +(reviews.reduce((a,r) => a + r.stars, 0) / total).toFixed(2);
  const totalLikes = reviews.reduce((a,r) => a + r.likes, 0);
  const withImages = reviews.filter(r => r.images.length > 0).length;
  const withText   = reviews.filter(r => r.text).length;

  const starDist = [5,4,3,2,1].map(s => ({
    stars: s,
    count: reviews.filter(r => Math.round(r.stars) === s).length,
    pct:   Math.round((reviews.filter(r => Math.round(r.stars) === s).length / total) * 100),
  }));

  const monthMap = {};
  reviews.forEach(r => {
    const key = r.date?.slice(0,7);
    if (!key) return;
    if (!monthMap[key]) monthMap[key] = { label: key, count: 0, totalStars: 0 };
    monthMap[key].count++;
    monthMap[key].totalStars += r.stars;
  });
  const timeline = Object.values(monthMap)
    .sort((a,b) => a.label.localeCompare(b.label))
    .map(m => ({ ...m, label: new Date(m.label+'-01').toLocaleDateString('ar-EG',{month:'short',year:'2-digit'}), avgStars: +(m.totalStars/m.count).toFixed(1) }));

  const branchMap = {};
  reviews.forEach(r => {
    const b = r.branch || 'غير محدد';
    if (!branchMap[b]) branchMap[b] = { name:b, count:0, totalStars:0 };
    branchMap[b].count++;
    branchMap[b].totalStars += r.stars;
  });
  const branches = Object.values(branchMap).map(b=>({...b, avgStars:+(b.totalStars/b.count).toFixed(1)})).sort((a,b)=>b.count-a.count);

  const aiMap = {};
  reviews.forEach(r => { const k=r.aiCheck||'غير محدد'; aiMap[k]=(aiMap[k]||0)+1; });
  const aiDist = Object.entries(aiMap).map(([label,count])=>({label,count,pct:Math.round((count/total)*100)})).sort((a,b)=>b.count-a.count);

  return { total, avgStars, totalLikes, withImages, withText, starDist, timeline, branches, aiDist };
}

const AI_COLORS = { 'إيجابي':'#22c55e','positive':'#22c55e','Positive':'#22c55e','سلبي':'#ef4444','negative':'#ef4444','Negative':'#ef4444','محايد':'#94a3b8','neutral':'#94a3b8','Neutral':'#94a3b8' };
const getAIColor = v => AI_COLORS[v] || '#818cf8';

export default function MapsPage() {
  const dispatch = useDispatch();
  const reviews  = useSelector(selectReviews);
  const status   = useSelector(selectMapsStatus);
  const error    = useSelector(selectMapsError);

  const [filterYear,   setFilterYear]   = useState('');
  const [filterMonth,  setFilterMonth]  = useState('');
  const [filterStars,  setFilterStars]  = useState('');
  const [filterBranch, setFilterBranch] = useState('');
  const [filterAI,     setFilterAI]     = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => { if (status === 'idle') dispatch(loadMaps()); }, [status, dispatch]);
  useEffect(() => { setPage(1); }, [filterYear, filterMonth, filterStars, filterBranch, filterAI]);

  const loading = status === 'loading' || status === 'idle';

  const { years, months, allBranches, allAI } = useMemo(() => {
    const ys = [...new Set(reviews.map(r => r.date?.slice(0,4)).filter(Boolean))].sort((a,b)=>b-a);
    const ms = filterYear ? [...new Set(reviews.filter(r=>r.date?.startsWith(filterYear)).map(r=>r.date?.slice(0,7)).filter(Boolean))].sort() : [];
    const bs = [...new Set(reviews.map(r=>r.branch).filter(Boolean))].sort();
    const ai = [...new Set(reviews.map(r=>r.aiCheck).filter(Boolean))].sort();
    return { years:ys, months:ms, allBranches:bs, allAI:ai };
  }, [reviews, filterYear]);

  const filteredReviews = useMemo(() => {
    return [...reviews].filter(r => {
      if (filterYear   && !r.date?.startsWith(filterYear))              return false;
      if (filterMonth  && !r.date?.startsWith(filterMonth))             return false;
      if (filterStars  && Math.round(r.stars) !== Number(filterStars))  return false;
      if (filterBranch && r.branch !== filterBranch)                    return false;
      if (filterAI     && r.aiCheck !== filterAI)                       return false;
      return true;
    }).sort((a,b) => (b.date||'').localeCompare(a.date||''));
  }, [reviews, filterYear, filterMonth, filterStars, filterBranch, filterAI]);

  const analytics   = useMemo(() => computeAnalytics(filteredReviews), [filteredReviews]);
  const totalPages  = Math.ceil(filteredReviews.length / PAGE_SIZE);
  const pagedReviews = filteredReviews.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);
  const hasFilters  = filterYear || filterStars || filterBranch || filterAI;

  const clearFilters = () => { setFilterYear(''); setFilterMonth(''); setFilterStars(''); setFilterBranch(''); setFilterAI(''); };

  return (
    <div style={{ maxWidth:1400, margin:'0 auto', direction:'rtl' }}>

      {/* Header */}
      <div className="fade-up" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24, flexWrap:'wrap', gap:12 }}>
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
          <div style={{ width:52, height:52, borderRadius:16, background:'linear-gradient(135deg, #4285f4, #34a853)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 8px 24px rgba(66,133,244,.35)' }}>
            <Map size={26} color="#fff" />
          </div>
          <div>
            <h1 className="page-title" style={{ margin:0 }}>تقييمات Google Maps</h1>
            <p style={{ fontSize:13, color:'var(--text-3)', marginTop:4 }}>
              {reviews.length > 0
                ? `${filteredReviews.length} تقييم${filteredReviews.length !== reviews.length ? ` من ${reviews.length}` : ''}`
                : 'آراء الزوار وتحليل المشاعر'}
            </p>
          </div>
        </div>
        <button onClick={() => dispatch(loadMaps())} disabled={loading} className="btn-outline"
          style={{ display:'flex', alignItems:'center', gap:8, opacity:loading?.5:1, cursor:loading?'not-allowed':'pointer' }}>
          <RefreshCw size={14} style={{ animation:loading?'spin 1s linear infinite':'none' }} />
          <span>تحديث</span>
        </button>
      </div>

      {/* Filters */}
      {status === 'succeeded' && reviews.length > 0 && (
        <div className="card fade-up" style={{ padding:'16px 20px', marginBottom:24, display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, color:'var(--text-3)', flexShrink:0 }}>
            <Filter size={14}/><span style={{ fontSize:12, fontWeight:700 }}>تصفية</span>
          </div>

          {/* Year */}
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

          <div style={{ width:1, height:24, background:'var(--border)', flexShrink:0 }} />

          {/* Stars chips */}
          <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
            {['',...[5,4,3,2,1]].map(s => {
              const active = filterStars === String(s);
              const color = s===5?'#22c55e':s===4?'#84cc16':s===3?'#eab308':s===2?'#f97316':'#ef4444';
              return (
                <button key={s} onClick={()=>setFilterStars(String(s))}
                  style={{ display:'flex', alignItems:'center', gap:4, fontSize:12, fontWeight:active?700:500, padding:'5px 11px', borderRadius:20, border:`1px solid ${active&&s?(color):( 'var(--border)')}`, background:active&&s?`color-mix(in srgb, ${color} 14%, transparent)`:'transparent', color:active&&s?color:'var(--text-2)', cursor:'pointer', transition:'all .15s' }}>
                  {s ? <><span>{s}</span><svg width={11} height={11} viewBox="0 0 24 24"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" fill="#fbbf24"/></svg></> : <span>كل النجوم</span>}
                </button>
              );
            })}
          </div>

          <div style={{ width:1, height:24, background:'var(--border)', flexShrink:0 }} />

          {/* Branch */}
          {allBranches.length > 1 && (
            <select value={filterBranch} onChange={e=>setFilterBranch(e.target.value)}
              style={{ fontSize:12, fontWeight:600, padding:'6px 10px', borderRadius:8, border:'1px solid var(--border)', background:'var(--bg-base)', color:'var(--text-1)', cursor:'pointer', direction:'rtl' }}>
              <option value="">كل الفروع</option>
              {allBranches.map(b=><option key={b} value={b}>{b}</option>)}
            </select>
          )}

          {/* AI Filter */}
          {allAI.length > 0 && (
            <select value={filterAI} onChange={e=>setFilterAI(e.target.value)}
              style={{ fontSize:12, fontWeight:600, padding:'6px 10px', borderRadius:8, border:'1px solid var(--border)', background:'var(--bg-base)', color:'var(--text-1)', cursor:'pointer', direction:'rtl' }}>
              <option value="">كل المشاعر</option>
              {allAI.map(a=><option key={a} value={a}>{a}</option>)}
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

      {/* Loading */}
      {loading && (
        <div style={{ textAlign:'center', padding:'80px 0', color:'var(--text-3)', fontSize:14 }}>
          <div style={{ width:40, height:40, border:'3px solid var(--border)', borderTopColor:'#4285f4', borderRadius:'50%', animation:'spin 1s linear infinite', margin:'0 auto 16px' }} />
          جاري تحميل التقييمات...
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
          {/* KPI Row */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(190px, 1fr))', gap:16, marginBottom:28 }}>
            <IGKPICard icon={MessageSquare} label="إجمالي التقييمات"  value={analytics.total}                    iconColor="#4285f4" delay={0}    large />
            <StarKPI avg={analytics.avgStars} />
            <IGKPICard icon={ThumbsUp}      label="إجمالي الإعجابات"  value={analytics.totalLikes.toLocaleString()} iconColor="#fbbf24" delay={0.1}  />
            <IGKPICard icon={Image}         label="تقييمات بصور"      value={analytics.withImages}                iconColor="#818cf8" delay={0.15}
              sub={`${Math.round((analytics.withImages/analytics.total)*100)}% من الإجمالي`} />
            <IGKPICard icon={Bot}           label="تقييمات محللة AI"  value={analytics.withText}                  iconColor="#34d399" delay={0.2}  />

            {/* AI Sentiment mini cards */}
            {/* {analytics.aiDist.slice(0,2).map((a,i) => (
              <IGKPICard key={a.label} icon={Bot} label={`تصنيف: ${a.label}`} value={a.count}
                sub={`${a.pct}% من التقييمات`} iconColor={getAIColor(a.label)} delay={0.25+i*0.05} />
            ))} */}
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[1fr_320px_280px] gap-5 mb-7">
            <ReviewsTimelineChart data={analytics.timeline} />
            <StarsBar data={analytics.starDist} total={analytics.total} />
            <BranchesTable branches={analytics.branches} total={analytics.total} />
          </div>

          {/* All Reviews */}
          <div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
              <h2 style={{ fontSize:16, fontWeight:800, color:'var(--text-1)', margin:0 }}>
                💬 التقييمات ({filteredReviews.length})
              </h2>
              {totalPages > 1 && <span style={{ fontSize:12, color:'var(--text-3)' }}>صفحة {page} من {totalPages}</span>}
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(340px, 1fr))', gap:16, marginBottom:24 }}>
              {pagedReviews.map((r, i) => <ReviewCard key={r.id || i} review={r} />)}
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
                      ?<span key={`e${i}`} style={{ padding:'6px 4px', color:'var(--text-3)', fontSize:12 }}>…</span>
                      :<button key={p} onClick={()=>setPage(p)}
                        style={{ width:34,height:34,borderRadius:8,fontSize:12,fontWeight:p===page?800:500,border:p===page?'1px solid #4285f4':'1px solid var(--border)',background:p===page?'color-mix(in srgb, #4285f4 15%, transparent)':'transparent',color:p===page?'#4285f4':'var(--text-2)',cursor:'pointer',transition:'all .15s' }}>{p}</button>
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

      {/* No results */}
      {status === 'succeeded' && reviews.length > 0 && !analytics && (
        <div style={{ textAlign:'center', padding:'60px 0', color:'var(--text-3)' }}>
          <Filter size={40} style={{ opacity:.2, margin:'0 auto 14px', display:'block' }} />
          <p style={{ fontSize:15, fontWeight:600 }}>لا توجد تقييمات تطابق الفلتر</p>
          <button onClick={clearFilters} className="btn-outline" style={{ marginTop:14, fontSize:12 }}>مسح الفلاتر</button>
        </div>
      )}

      {status === 'succeeded' && reviews.length === 0 && (
        <div style={{ textAlign:'center', padding:'80px 0', color:'var(--text-3)' }}>
          <Map size={48} style={{ opacity:.2, margin:'0 auto 16px', display:'block' }} />
          <p style={{ fontSize:15 }}>لا توجد بيانات في ورقة maps</p>
        </div>
      )}
    </div>
  );
}
