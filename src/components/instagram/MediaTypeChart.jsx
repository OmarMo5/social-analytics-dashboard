import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const TYPE_META = {
  VIDEO:     { color:'#e1306c', label:'فيديو',   icon:'🎬' },
  IMAGE:     { color:'#818cf8', label:'صورة',    icon:'🖼️' },
  CAROUSEL_ALBUM: { color:'#34d399', label:'ألبوم', icon:'📷' },
  REEL:      { color:'#f59e0b', label:'ريلز',    icon:'🎥' },
  OTHER:     { color:'#64748b', label:'أخرى',    icon:'📄' },
};
const getMeta = t => TYPE_META[t] || TYPE_META.OTHER;

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const m = getMeta(d.name);
  return (
    <div className="card" style={{ padding:'10px 14px' }}>
      <p style={{ color:m.color, fontWeight:800, fontSize:13 }}>{m.icon} {m.label}</p>
      <p style={{ color:'var(--text-2)', fontSize:12, marginTop:3 }}>{d.value} منشور · {d.pct}%</p>
    </div>
  );
};

export default function MediaTypeChart({ data }) {
  if (!data?.length) return null;
  const top = [...data].sort((a,b)=>b.value-a.value)[0];

  return (
    <div className="card" style={{ padding:'24px 24px 20px' }}>
      <div style={{ marginBottom:20 }}>
        <h3 style={{ fontSize:15, fontWeight:800, color:'var(--text-1)' }}>توزيع أنواع المحتوى</h3>
        <p style={{ fontSize:12, color:'var(--text-3)', marginTop:4 }}>نسبة كل نوع من المنشورات</p>
      </div>

      <div style={{ display:'flex', alignItems:'center', gap:20 }}>
        <div style={{ position:'relative', width:150, height:150, flexShrink:0 }}>
          <ResponsiveContainer width={150} height={150}>
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name"
                cx="50%" cy="50%" innerRadius={48} outerRadius={68}
                paddingAngle={3} startAngle={90} endAngle={-270} strokeWidth={0}>
                {data.map(e => <Cell key={e.name} fill={getMeta(e.name).color} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {top && (
            <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', pointerEvents:'none' }}>
              <span style={{ fontSize:22, fontWeight:900, color:getMeta(top.name).color, lineHeight:1 }}>{top.pct}%</span>
              <span style={{ fontSize:10, color:'var(--text-3)', marginTop:4 }}>{getMeta(top.name).label}</span>
            </div>
          )}
        </div>

        <div style={{ flex:1, display:'flex', flexDirection:'column', gap:12 }}>
          {data.map(e => {
            const m = getMeta(e.name);
            return (
              <div key={e.name}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:6 }}>
                  <span style={{ fontSize:12, fontWeight:700, color:'var(--text-1)' }}>{m.icon} {m.label}</span>
                  <span style={{ fontSize:14, fontWeight:900, color:m.color }}>{e.pct}%</span>
                </div>
                <div style={{ height:6, borderRadius:99, background:'var(--border)', overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${e.pct}%`, borderRadius:99, background:m.color, transition:'width .8s ease', boxShadow:`0 0 8px ${m.color}50` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
