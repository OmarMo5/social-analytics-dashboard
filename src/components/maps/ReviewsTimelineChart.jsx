import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="card" style={{ padding:'10px 14px', border:'1px solid rgba(251,191,36,.3)' }}>
      <p style={{ color:'var(--text-2)', fontSize:11, marginBottom:6 }}>{label}</p>
      <p style={{ fontSize:13, fontWeight:800, color:'#fbbf24' }}>{payload[0].value} تقييم</p>
      {payload[1] && <p style={{ fontSize:12, color:'#34d399', marginTop:3 }}>متوسط ⭐ {payload[1].value}</p>}
    </div>
  );
};

export default function ReviewsTimelineChart({ data }) {
  if (!data?.length) return null;
  return (
    <div className="card" style={{ padding:'24px 24px 18px' }}>
      <div style={{ marginBottom:20 }}>
        <h3 style={{ fontSize:15, fontWeight:800, color:'var(--text-1)' }}>التقييمات عبر الزمن</h3>
        <p style={{ fontSize:12, color:'var(--text-3)', marginTop:4 }}>عدد التقييمات الشهرية ومتوسط النجوم</p>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top:8, right:8, bottom:0, left:-10 }} barGap={4}>
          <CartesianGrid strokeDasharray="4 4" stroke="var(--chart-grid)" vertical={false} />
          <XAxis dataKey="label" tick={{ fill:'var(--text-3)', fontSize:10, fontFamily:'Cairo' }} tickLine={false} axisLine={false} dy={5} />
          <YAxis tick={{ fill:'var(--text-3)', fontSize:10, fontFamily:'Cairo' }} tickLine={false} axisLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill:'rgba(251,191,36,.05)' }} />
          <Bar dataKey="count" name="عدد التقييمات" radius={[6,6,0,0]} maxBarSize={40}>
            {data.map((e,i) => (
              <Cell key={i} fill={`color-mix(in srgb, #fbbf24 ${60 + Math.round((e.avgStars/5)*40)}%, #818cf8)`} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
