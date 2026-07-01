import { useState } from 'react';
import { Eye, ThumbsUp, MessageCircle, Star, Clock, ExternalLink, Play } from 'lucide-react';

function fmt(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000)    return (n / 1000).toFixed(1) + 'K';
  return n?.toLocaleString() ?? '0';
}

function Metric({ Icon, value, color, label }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:3, flex:1 }}>
      <Icon size={13} style={{ color }} />
      <span style={{ fontSize:13, fontWeight:800, color:'var(--text-1)', lineHeight:1 }}>{fmt(value)}</span>
      <span style={{ fontSize:10, color:'var(--text-3)' }}>{label}</span>
    </div>
  );
}

export default function VideoCard({ video, rank }) {
  const [imgErr, setImgErr] = useState(false);
  const { title, description, cover, duration, views, likes, favorites, comments, publishedAt } = video;

  const dateStr = publishedAt
    ? new Date(publishedAt).toLocaleDateString('ar-EG', { year:'numeric', month:'long', day:'numeric' })
    : '';

  // Extract YouTube video ID from embedHtml or cover URL for a watch link
  const ytIdMatch = cover?.match(/\/vi\/([^/]+)\//);
  const watchUrl  = ytIdMatch ? `https://www.youtube.com/watch?v=${ytIdMatch[1]}` : null;

  return (
    <div className="card fade-up" style={{ display:'flex', flexDirection:'column', overflow:'hidden', position:'relative' }}>

      {/* Rank badge */}
      {rank !== undefined && (
        <div style={{ position:'absolute', top:10, right:10, zIndex:2, width:28, height:28, borderRadius:'50%', background:'rgba(248,113,113,.85)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 2px 8px rgba(248,113,113,.4)' }}>
          <span style={{ fontSize:11, fontWeight:900, color:'#fff' }}>#{rank}</span>
        </div>
      )}

      {/* Cover Image */}
      <div style={{ position:'relative', width:'100%', paddingTop:'56.25%', background:'var(--bg-base)', overflow:'hidden', flexShrink:0 }}>
        {cover && !imgErr ? (
          <img
            src={cover}
            alt={title}
            onError={() => setImgErr(true)}
            style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', transition:'transform .3s' }}
            onMouseOver={e => e.currentTarget.style.transform='scale(1.04)'}
            onMouseOut={e  => e.currentTarget.style.transform='scale(1)'}
          />
        ) : (
          <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', background:'color-mix(in srgb, #f87171 8%, var(--bg-base))' }}>
            <Play size={40} style={{ color:'#f87171', opacity:.3 }} />
          </div>
        )}
        {/* Duration badge */}
        {duration && (
          <div style={{ position:'absolute', bottom:8, left:8, background:'rgba(0,0,0,.75)', borderRadius:4, padding:'2px 7px', display:'flex', alignItems:'center', gap:4 }}>
            <Clock size={10} style={{ color:'#fff' }} />
            <span style={{ fontSize:11, fontWeight:700, color:'#fff', fontFamily:'monospace' }}>{duration}</span>
          </div>
        )}
        {/* Play overlay */}
        {watchUrl && (
          <a href={watchUrl} target="_blank" rel="noopener noreferrer"
            style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0)', transition:'background .2s', textDecoration:'none' }}
            onMouseOver={e => e.currentTarget.style.background='rgba(0,0,0,.35)'}
            onMouseOut={e  => e.currentTarget.style.background='rgba(0,0,0,0)'}
          >
            <div style={{ width:44, height:44, borderRadius:'50%', background:'rgba(255,255,255,.9)', display:'flex', alignItems:'center', justifyContent:'center', opacity:0, transition:'opacity .2s' }}
              onMouseOver={e => { e.currentTarget.style.opacity=1; }}
            >
              <Play size={20} style={{ color:'#f87171', marginRight:-2 }} fill="#f87171" />
            </div>
          </a>
        )}
      </div>

      {/* Content */}
      <div style={{ padding:'14px 16px', display:'flex', flexDirection:'column', gap:10, flex:1 }}>

        {/* Date */}
        <span style={{ fontSize:11, color:'var(--text-3)' }}>{dateStr}</span>

        {/* Title */}
        <h3 style={{ fontSize:13, fontWeight:700, color:'var(--text-1)', lineHeight:1.5, margin:0, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden', direction:'rtl' }}>
          {title || 'بدون عنوان'}
        </h3>

        {/* Description */}
        {description && (
          <p style={{ fontSize:11, color:'var(--text-3)', lineHeight:1.6, margin:0, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden', direction:'rtl' }}>
            {description}
          </p>
        )}

        {/* Metrics row */}
        <div style={{ display:'flex', borderTop:'1px solid var(--border)', paddingTop:10, marginTop:'auto' }}>
          <Metric Icon={Eye}          value={views}     color="#f87171" label="مشاهدة" />
          <Metric Icon={ThumbsUp}     value={likes}     color="#fbbf24" label="إعجاب"  />
          <Metric Icon={MessageCircle}value={comments}  color="#818cf8" label="تعليق"  />
          <Metric Icon={Star}         value={favorites} color="#34d399" label="مفضلة"  />
        </div>

        {/* Watch link */}
        {watchUrl && (
          <a href={watchUrl} target="_blank" rel="noopener noreferrer"
            style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, fontWeight:600, color:'#f87171', textDecoration:'none', alignSelf:'flex-start' }}>
            <ExternalLink size={12} />
            <span>مشاهدة الفيديو</span>
          </a>
        )}
      </div>
    </div>
  );
}
