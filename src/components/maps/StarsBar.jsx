const STAR_COLORS = { 5:'#22c55e', 4:'#84cc16', 3:'#eab308', 2:'#f97316', 1:'#ef4444' };

function Star({ filled, half, size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {half ? (
        <>
          <defs>
            <linearGradient id="hg">
              <stop offset="50%" stopColor="#fbbf24"/>
              <stop offset="50%" stopColor="#374151"/>
            </linearGradient>
          </defs>
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" fill="url(#hg)" stroke="none"/>
        </>
      ) : (
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
          fill={filled ? '#fbbf24' : '#374151'} stroke="none"/>
      )}
    </svg>
  );
}

export function StarRating({ value, size = 14 }) {
  return (
    <div style={{ display:'flex', gap:2 }}>
      {[1,2,3,4,5].map(i => (
        <Star key={i} filled={value >= i} half={value >= i-0.5 && value < i} size={size} />
      ))}
    </div>
  );
}

export default function StarsBar({ data, total }) {
  return (
    <div className="card" style={{ padding:'24px' }}>
      <h3 style={{ fontSize:15, fontWeight:800, color:'var(--text-1)', marginBottom:20 }}>توزيع التقييمات</h3>
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {data.map(d => (
          <div key={d.stars} style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ display:'flex', alignItems:'center', gap:4, width:80, flexShrink:0 }}>
              <span style={{ fontSize:13, fontWeight:700, color:'var(--text-1)' }}>{d.stars}</span>
              <svg width={13} height={13} viewBox="0 0 24 24">
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" fill="#fbbf24"/>
              </svg>
            </div>
            <div style={{ flex:1, height:10, borderRadius:99, background:'var(--border)', overflow:'hidden' }}>
              <div style={{ height:'100%', width:`${d.pct}%`, borderRadius:99, background:STAR_COLORS[d.stars], transition:'width .8s ease', boxShadow:`0 0 8px ${STAR_COLORS[d.stars]}50` }} />
            </div>
            <div style={{ width:70, textAlign:'left', flexShrink:0 }}>
              <span style={{ fontSize:12, fontWeight:700, color:STAR_COLORS[d.stars] }}>{d.count}</span>
              <span style={{ fontSize:11, color:'var(--text-3)', marginRight:4 }}>({d.pct}%)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
