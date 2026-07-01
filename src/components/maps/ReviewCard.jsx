import { useState } from 'react';
import { ThumbsUp, ExternalLink, MapPin, Bot, Image as ImageIcon, ChevronDown, ChevronUp } from 'lucide-react';
import { StarRating } from './StarsBar';

const AI_COLORS = {
  'إيجابي':   { bg:'#22c55e', label:'إيجابي'   },
  'positive': { bg:'#22c55e', label:'إيجابي'   },
  'Positive': { bg:'#22c55e', label:'إيجابي'   },
  'سلبي':     { bg:'#ef4444', label:'سلبي'     },
  'negative': { bg:'#ef4444', label:'سلبي'     },
  'Negative': { bg:'#ef4444', label:'سلبي'     },
  'محايد':    { bg:'#94a3b8', label:'محايد'    },
  'neutral':  { bg:'#94a3b8', label:'محايد'    },
  'Neutral':  { bg:'#94a3b8', label:'محايد'    },
};
const getAI = v => AI_COLORS[v] || { bg:'#818cf8', label: v || 'غير محدد' };

const STAR_COLOR = s => s >= 4 ? '#22c55e' : s >= 3 ? '#eab308' : '#ef4444';

export default function ReviewCard({ review }) {
  const [expanded, setExpanded] = useState(false);
  const [imgModal, setImgModal] = useState(null);
  const { name, museum, branch, text, date, time, likes, reviewUrl, stars, images, aiCheck } = review;
  const ai = getAI(aiCheck);
  const isLong = text.length > 200;
  const displayText = isLong && !expanded ? text.slice(0, 200) + '...' : text;

  const dateStr = date
    ? new Date(date).toLocaleDateString('ar-EG', { year:'numeric', month:'long', day:'numeric' })
    : '';

  return (
    <>
      <div className="card fade-up" style={{ padding:'18px 20px', display:'flex', flexDirection:'column', gap:12 }}>

        {/* Header: name + stars + AI */}
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:10 }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
              {/* Avatar */}
              <div style={{ width:34, height:34, borderRadius:'50%', background:`color-mix(in srgb, ${STAR_COLOR(stars)} 20%, var(--bg-base))`, border:`1.5px solid ${STAR_COLOR(stars)}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <span style={{ fontSize:14, fontWeight:800, color:STAR_COLOR(stars) }}>{name.charAt(0)}</span>
              </div>
              <div>
                <p style={{ fontSize:13, fontWeight:700, color:'var(--text-1)', lineHeight:1.2 }}>{name}</p>
                <p style={{ fontSize:10, color:'var(--text-3)', marginTop:2 }}>{dateStr}{time ? ` · ${time}` : ''}</p>
              </div>
            </div>
            <StarRating value={stars} size={13} />
          </div>

          {/* AI Badge */}
          {aiCheck && (
            <div style={{ display:'flex', alignItems:'center', gap:5, background:`color-mix(in srgb, ${ai.bg} 12%, transparent)`, border:`1px solid color-mix(in srgb, ${ai.bg} 30%, transparent)`, borderRadius:20, padding:'4px 10px', flexShrink:0 }}>
              <Bot size={11} style={{ color:ai.bg }} />
              <span style={{ fontSize:11, fontWeight:700, color:ai.bg }}>{ai.label}</span>
            </div>
          )}
        </div>

        {/* Branch tag */}
        {(branch || museum) && (
          <div style={{ display:'flex', alignItems:'center', gap:5 }}>
            <MapPin size={11} style={{ color:'var(--text-3)' }} />
            <span style={{ fontSize:11, color:'var(--text-3)' }}>{[museum, branch].filter(Boolean).join(' · ')}</span>
          </div>
        )}

        {/* Review text */}
        {text && (
          <div>
            <p style={{ fontSize:13, color:'var(--text-2)', lineHeight:1.75, margin:0, direction:'rtl' }}>{displayText}</p>
            {isLong && (
              <button onClick={() => setExpanded(e=>!e)}
                style={{ display:'flex', alignItems:'center', gap:4, fontSize:11, fontWeight:600, color:'var(--accent)', background:'none', border:'none', cursor:'pointer', marginTop:6, padding:0 }}>
                {expanded ? <><ChevronUp size={12}/> أقل</> : <><ChevronDown size={12}/> المزيد</>}
              </button>
            )}
          </div>
        )}

        {/* Images strip */}
        {images.length > 0 && (
          <div style={{ display:'flex', gap:8, overflowX:'auto', paddingBottom:4 }}>
            {images.map((src, i) => (
              <div key={i} onClick={() => setImgModal(src)}
                style={{ width:72, height:72, borderRadius:8, overflow:'hidden', flexShrink:0, cursor:'pointer', background:'var(--border)', border:'1px solid var(--border)' }}>
                <img src={src} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }}
                  onError={e => { e.currentTarget.style.display='none'; }} />
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', borderTop:'1px solid var(--border)', paddingTop:10 }}>
          <div style={{ display:'flex', alignItems:'center', gap:5 }}>
            <ThumbsUp size={12} style={{ color:'var(--text-3)' }} />
            <span style={{ fontSize:11, color:'var(--text-3)' }}>{likes > 0 ? `${likes} إعجاب` : 'لا إعجابات'}</span>
            {images.length > 0 && (
              <>
                <span style={{ color:'var(--border)', margin:'0 4px' }}>·</span>
                <ImageIcon size={12} style={{ color:'var(--text-3)' }} />
                <span style={{ fontSize:11, color:'var(--text-3)' }}>{images.length} صورة</span>
              </>
            )}
          </div>
          {reviewUrl && (
            <a href={reviewUrl} target="_blank" rel="noopener noreferrer"
              style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, fontWeight:600, color:'#4285f4', textDecoration:'none' }}>
              <ExternalLink size={11} />
              <span>عرض في Maps</span>
            </a>
          )}
        </div>
      </div>

      {/* Image lightbox */}
      {imgModal && (
        <div onClick={() => setImgModal(null)}
          style={{ position:'fixed', inset:0, zIndex:9999, background:'rgba(0,0,0,.85)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'zoom-out' }}>
          <img src={imgModal} alt="" style={{ maxWidth:'90vw', maxHeight:'90vh', borderRadius:12, objectFit:'contain' }} />
        </div>
      )}
    </>
  );
}
