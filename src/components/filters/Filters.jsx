import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SlidersHorizontal, X } from 'lucide-react';
import { setFilter, resetFilters, selectFilters, selectAllArticles } from '../../store/slices/newsSlice';

const MONTHS_AR = {'01':'يناير','02':'فبراير','03':'مارس','04':'أبريل','05':'مايو','06':'يونيو','07':'يوليو','08':'أغسطس','09':'سبتمبر','10':'أكتوبر','11':'نوفمبر','12':'ديسمبر'};
const uniq = arr => [...new Set(arr.filter(Boolean))].sort();

export default function Filters({ count }) {
  const dispatch = useDispatch();
  const filters  = useSelector(selectFilters);
  const articles = useSelector(selectAllArticles);

  const opts = useMemo(() => {
    const dates = articles.map(a=>a.date?new Date(a.date):null).filter(Boolean);
    return {
      years:     uniq(dates.map(d=>String(d.getFullYear()))),
      months:    uniq(dates.map(d=>String(d.getMonth()+1).padStart(2,'0'))),
      days:      uniq(dates.map(d=>String(d.getDate()).padStart(2,'0'))),
      platforms: uniq(articles.map(a=>a.platform)),
    };
  }, [articles]);

  const sel = (k,v) => dispatch(setFilter({ key:k, value:v }));
  const activeCount = Object.values(filters).filter(v=>v!=='').length;

  return (
    <div className="card" style={{ padding:'14px 18px', display:'flex', flexWrap:'wrap', alignItems:'center', gap:10 }}>
      <div style={{ display:'flex', alignItems:'center', gap:8, color:'var(--text-2)', flexShrink:0 }}>
        <SlidersHorizontal size={14} />
        <span style={{ fontSize:13, fontWeight:700 }}>تصفية</span>
        {activeCount > 0 && <span className="filter-count">{activeCount}</span>}
      </div>

      <Sel value={filters.year}      onChange={v=>sel('year',v)}      ph="السنة">
        {opts.years.map(y=><option key={y} value={y}>{y}</option>)}
      </Sel>
      <Sel value={filters.month}     onChange={v=>sel('month',v)}     ph="الشهر">
        {opts.months.map(m=><option key={m} value={m}>{MONTHS_AR[m]||m}</option>)}
      </Sel>
      <Sel value={filters.day}       onChange={v=>sel('day',v)}       ph="اليوم">
        {opts.days.map(d=><option key={d} value={d}>{d}</option>)}
      </Sel>
      <Sel value={filters.platform}  onChange={v=>sel('platform',v)}  ph="المنصة">
        {opts.platforms.map(p=><option key={p} value={p}>{p}</option>)}
      </Sel>
      <Sel value={filters.sentiment} onChange={v=>sel('sentiment',v)} ph="المشاعر">
        {['إيجابي','سلبي','محايد','غير محدد'].map(s=><option key={s} value={s}>{s}</option>)}
      </Sel>

      <div style={{ display:'flex', alignItems:'center', gap:14, marginRight:'auto' }}>
        <span style={{ fontSize:12, color:'var(--text-3)' }}>{count} نتيجة</span>
        {activeCount > 0 && (
          <button onClick={()=>dispatch(resetFilters())} style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, fontWeight:700, color:'var(--neg)', background:'none', border:'none', cursor:'pointer' }}>
            <X size={11} />إعادة تعيين
          </button>
        )}
      </div>
    </div>
  );
}

function Sel({ value, onChange, ph, children }) {
  return (
    <select value={value} onChange={e=>onChange(e.target.value)}
      style={{ fontSize:12, borderRadius:9, padding:'7px 12px', cursor:'pointer' }}>
      <option value="">{ph}</option>
      {children}
    </select>
  );
}
