import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="card" style={{ padding:'12px 16px', border:'1px solid rgba(225,48,108,.3)' }}>
      <p style={{ color:'var(--text-2)', fontSize:12, marginBottom:8 }}>{label}</p>
      {payload.map(p => (
        <div key={p.name} style={{ display:'flex', justifyContent:'space-between', gap:16, marginBottom:4 }}>
          <span style={{ fontSize:12, color:p.color }}>{p.name}</span>
          <span style={{ fontSize:13, fontWeight:800, color:p.color }}>{p.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
};

const SERIES = [
  { key:'reach',    name:'الوصول',     color:'#e1306c' },
  { key:'likes',    name:'الإعجابات',  color:'#f59e0b' },
  { key:'comments', name:'التعليقات',  color:'#818cf8' },
  { key:'shares',   name:'المشاركات',  color:'#34d399' },
];

export default function EngagementChart({ data, activeKeys = ['reach','likes'] }) {
  if (!data?.length) return null;

  return (
    <div className="card" style={{ padding:'24px 24px 18px' }}>
      <div style={{ marginBottom:20 }}>
        <h3 style={{ fontSize:15, fontWeight:800, color:'var(--text-1)' }}>تطور التفاعل عبر الزمن</h3>
        <p style={{ fontSize:12, color:'var(--text-3)', marginTop:4 }}>الوصول والتفاعل لكل منشور بالترتيب الزمني</p>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ top:8, right:8, bottom:0, left:-10 }}>
          <defs>
            {SERIES.map(s => (
              <linearGradient key={s.key} id={`grad_${s.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor={s.color} stopOpacity={0.3} />
                <stop offset="100%" stopColor={s.color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="4 4" stroke="var(--chart-grid)" vertical={false} />
          <XAxis dataKey="label" tick={{ fill:'var(--text-3)', fontSize:11, fontFamily:'Cairo' }} tickLine={false} axisLine={false} dy={5} />
          <YAxis tick={{ fill:'var(--text-3)', fontSize:11, fontFamily:'Cairo' }} tickLine={false} axisLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke:'rgba(225,48,108,.1)', strokeWidth:1 }} />
          {SERIES.map(s => (
            <Area key={s.key} type="monotone" dataKey={s.key} name={s.name}
              stroke={s.color} strokeWidth={2} fill={`url(#grad_${s.key})`}
              dot={{ fill:s.color, r:3, strokeWidth:0 }}
              activeDot={{ r:6, fill:'#fff', stroke:s.color, strokeWidth:2 }}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div style={{ display:'flex', gap:16, justifyContent:'center', marginTop:14, flexWrap:'wrap' }}>
        {SERIES.map(s => (
          <div key={s.key} style={{ display:'flex', alignItems:'center', gap:6 }}>
            <div style={{ width:10, height:3, borderRadius:2, background:s.color }} />
            <span style={{ fontSize:11, color:'var(--text-2)' }}>{s.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
