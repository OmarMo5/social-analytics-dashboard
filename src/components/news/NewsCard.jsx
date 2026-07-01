import { ExternalLink, Globe, CalendarDays } from 'lucide-react';
import SentimentBadge from './SentimentBadge';

const PLATFORM_COLORS = {
  'X (تويتر)':       '#94a3b8',
  'Instagram':        '#e1306c',
  'TikTok':           '#2dd4bf',
  'YouTube':          '#f87171',
  'Facebook':         '#60a5fa',
  'LinkedIn':         '#38bdf8',
  'أخبار إلكترونية': '#818cf8',
  'مواقع إلكترونية': '#a78bfa',
  'بودكاست':         '#fbbf24',
};
const getColor = n => PLATFORM_COLORS[n] || 'var(--accent)';

function sentimentClass(val) {
  if (!val)              return 'news-card-und';
  if (val === 'إيجابي') return 'news-card-pos';
  if (val === 'سلبي')   return 'news-card-neg';
  if (val === 'محايد')  return 'news-card-neu';
  return 'news-card-und';
}

function fmtDate(iso) {
  if (!iso) return '—';
  try { return new Date(iso).toLocaleDateString('ar-EG',{year:'numeric',month:'short',day:'numeric'}); }
  catch { return iso; }
}

export default function NewsCard({ article, idx = 0 }) {
  const { title, source, platform, date, link, sentiment } = article;
  const c = getColor(platform);

  return (
    <article className={`card fade-up ${sentimentClass(sentiment)}`} style={{ display:'flex', flexDirection:'column', animationDelay:`${Math.min(idx*0.04,0.4)}s` }}>
      {/* Top bar */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px 10px' }}>
        <SentimentBadge value={sentiment} />
        <span style={{ fontSize:10, fontWeight:700, padding:'3px 9px', borderRadius:7, color:c, background:`color-mix(in srgb, ${c} 12%, var(--bg-card))`, border:`1px solid color-mix(in srgb, ${c} 28%, transparent)` }}>
          {platform}
        </span>
      </div>

      <hr className="divider" style={{ margin:'0 16px' }} />

      {/* Title */}
      <div style={{ padding:'12px 16px', flex:1 }}>
        <p style={{ fontSize:13, fontWeight:600, color:'var(--text-1)', lineHeight:1.75 }} title={title}>
          {title}
        </p>
      </div>

      {/* Meta */}
      {(source || date) && (
        <div style={{ padding:'0 16px 12px', display:'flex', flexWrap:'wrap', gap:'4px 14px', fontSize:11, color:'var(--text-3)' }}>
          {source && (
            <span style={{ display:'flex', alignItems:'center', gap:4 }}>
              <Globe size={10} />
              {source.length>38 ? source.slice(0,38)+'…' : source}
            </span>
          )}
          {date && (
            <span style={{ display:'flex', alignItems:'center', gap:4 }}>
              <CalendarDays size={10} />{fmtDate(date)}
            </span>
          )}
        </div>
      )}

      {/* Link */}
      {link && (
        <>
          <hr className="divider" style={{ margin:'0 16px' }} />
          <div style={{ padding:'10px 16px' }}>
            <a href={link} target="_blank" rel="noopener noreferrer" className="link-btn">
              <ExternalLink size={11} />عرض الخبر كاملًا
            </a>
          </div>
        </>
      )}
    </article>
  );
}
