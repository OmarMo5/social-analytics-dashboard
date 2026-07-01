export default function IGKPICard({ icon: Icon, label, value, sub, subColor, iconColor = '#e1306c', delay = 0, large = false }) {
  return (
    <div className="card fade-up" style={{ padding: large ? '24px 26px' : '20px 22px', display:'flex', flexDirection:'column', justifyContent:'space-between', minHeight: large ? 160 : 136, animationDelay:`${delay}s` }}>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:8 }}>
        <p style={{ fontSize:12, fontWeight:600, color:'var(--text-2)', lineHeight:1.5, maxWidth:140 }}>{label}</p>
        <div style={{ width:40, height:40, borderRadius:12, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', background:`color-mix(in srgb, ${iconColor} 15%, transparent)`, border:`1px solid color-mix(in srgb, ${iconColor} 25%, transparent)` }}>
          <Icon size={18} style={{ color:iconColor }} />
        </div>
      </div>
      <div style={{ marginTop:10 }}>
        <p style={{ fontSize: large ? '2.4rem' : '1.9rem', fontWeight:900, letterSpacing:'-0.02em', color:'var(--text-1)', lineHeight:1 }}>{value}</p>
        {sub && <p style={{ fontSize:11, fontWeight:500, marginTop:7, color:subColor||'var(--text-3)' }}>{sub}</p>}
      </div>
    </div>
  );
}
