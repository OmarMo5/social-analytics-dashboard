import { Heart, MessageCircle, Eye, Share2, ExternalLink, Film, Image, LayoutGrid, Video } from 'lucide-react';

const TYPE_META = {
  VIDEO:          { color:'#e1306c', label:'فيديو',   Icon: Film },
  IMAGE:          { color:'#818cf8', label:'صورة',    Icon: Image },
  CAROUSEL_ALBUM: { color:'#34d399', label:'ألبوم',   Icon: LayoutGrid },
  REEL:           { color:'#f59e0b', label:'ريلز',    Icon: Video },
};
const getMeta = t => TYPE_META[t] || { color:'#64748b', label: t || 'منشور', Icon: Film };

function Metric({ Icon, value, color }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:5 }}>
      <Icon size={13} style={{ color }} />
      <span style={{ fontSize:13, fontWeight:700, color:'var(--text-1)' }}>{value?.toLocaleString() ?? 0}</span>
    </div>
  );
}

export default function PostCard({ post, rank }) {
  const { date, time, caption, mediaType, link, likes, comments, reach, shares } = post;
  const m = getMeta(mediaType);
  const TypeIcon = m.Icon;

  const dateStr = date
    ? new Date(date).toLocaleDateString('ar-EG', { year:'numeric', month:'long', day:'numeric' })
    : '';

  return (
    <div className="card fade-up" style={{ padding:'18px 20px', display:'flex', flexDirection:'column', gap:14, position:'relative', overflow:'hidden' }}>
      {/* Rank badge */}
      {rank !== undefined && (
        <div style={{ position:'absolute', top:14, left:16, width:24, height:24, borderRadius:'50%', background:`color-mix(in srgb, ${m.color} 20%, transparent)`, border:`1px solid ${m.color}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <span style={{ fontSize:11, fontWeight:900, color:m.color }}>#{rank}</span>
        </div>
      )}

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:8, paddingLeft: rank !== undefined ? 32 : 0 }}>
        <div>
          <span style={{ fontSize:11, color:'var(--text-3)' }}>{dateStr}</span>
          {time && <span style={{ fontSize:11, color:'var(--text-3)', marginRight:8 }}> · {time}</span>}
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:6, background:`color-mix(in srgb, ${m.color} 12%, transparent)`, border:`1px solid color-mix(in srgb, ${m.color} 25%, transparent)`, borderRadius:20, padding:'3px 10px' }}>
          <TypeIcon size={11} style={{ color:m.color }} />
          <span style={{ fontSize:11, fontWeight:700, color:m.color }}>{m.label}</span>
        </div>
      </div>

      {/* Caption */}
      {caption && (
        <p style={{ fontSize:13, color:'var(--text-2)', lineHeight:1.7, display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical', overflow:'hidden', direction:'rtl' }}>
          {caption}
        </p>
      )}

      {/* Metrics */}
      <div style={{ display:'flex', flexWrap:'wrap', gap:16, borderTop:'1px solid var(--border)', paddingTop:12 }}>
        <Metric Icon={Eye}           value={reach}    color="#e1306c" />
        <Metric Icon={Heart}         value={likes}    color="#f59e0b" />
        <Metric Icon={MessageCircle} value={comments} color="#818cf8" />
        <Metric Icon={Share2}        value={shares}   color="#34d399" />
      </div>

      {/* Link */}
      {link && (
        <a href={link} target="_blank" rel="noopener noreferrer"
          style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, fontWeight:600, color:'#e1306c', textDecoration:'none', alignSelf:'flex-start' }}>
          <ExternalLink size={13} />
          <span>عرض المنشور</span>
        </a>
      )}
    </div>
  );
}
