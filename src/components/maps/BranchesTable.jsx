import { StarRating } from './StarsBar';
import { MapPin } from 'lucide-react';

const starColor = avg => avg >= 4.5 ? '#22c55e' : avg >= 3.5 ? '#eab308' : avg >= 2.5 ? '#f97316' : '#ef4444';

export default function BranchesTable({ branches, total }) {
  if (!branches?.length) return null;
  return (
    <div className="card" style={{ padding:'24px' }}>
      <h3 style={{ fontSize:15, fontWeight:800, color:'var(--text-1)', marginBottom:20 }}>أداء الفروع</h3>
      <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
        {branches.map((b, i) => {
          const pct = Math.round((b.count / total) * 100);
          const color = starColor(b.avgStars);
          return (
            <div key={b.name} style={{ display:'flex', alignItems:'center', gap:14, padding:'12px 0', borderBottom: i < branches.length-1 ? '1px solid var(--border)' : 'none' }}>
              {/* rank */}
              <div style={{ width:24, height:24, borderRadius:'50%', background:`color-mix(in srgb, ${color} 15%, transparent)`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <span style={{ fontSize:11, fontWeight:800, color }}>{i+1}</span>
              </div>
              {/* name */}
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:4 }}>
                  <MapPin size={11} style={{ color:'var(--text-3)', flexShrink:0 }} />
                  <span style={{ fontSize:13, fontWeight:700, color:'var(--text-1)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{b.name}</span>
                </div>
                <div style={{ height:5, borderRadius:99, background:'var(--border)', overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${pct}%`, background:color, borderRadius:99, transition:'width .8s' }} />
                </div>
              </div>
              {/* stats */}
              <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:3, flexShrink:0 }}>
                <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                  <span style={{ fontSize:13, fontWeight:800, color }}>{b.avgStars}</span>
                  <svg width={12} height={12} viewBox="0 0 24 24"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" fill="#fbbf24"/></svg>
                </div>
                <span style={{ fontSize:11, color:'var(--text-3)' }}>{b.count} تقييم</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
