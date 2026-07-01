import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

const FB_BLUE   = '#1877f2';
const FB_GREEN  = '#34d399';
const FB_AMBER  = '#fbbf24';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="card" style={{ padding:'12px 16px', border:'1px solid rgba(24,119,242,.3)' }}>
      <p style={{ color:'var(--text-2)', fontSize:11, marginBottom:8 }}>{label}</p>
      {payload.map(p => (
        <div key={p.name} style={{ display:'flex', justifyContent:'space-between', gap:16, marginBottom:4 }}>
          <span style={{ fontSize:12, color:p.fill }}>{p.name}</span>
          <span style={{ fontSize:13, fontWeight:800, color:p.fill }}>{p.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
};

export default function FBEngagementChart({ data }) {
  if (!data?.length) return null;
  return (
    <div className="card" style={{ padding:'24px 24px 18px' }}>
      <div style={{ marginBottom:20 }}>
        <h3 style={{ fontSize:15, fontWeight:800, color:'var(--text-1)' }}>التفاعل الشهري</h3>
        <p style={{ fontSize:12, color:'var(--text-3)', marginTop:4 }}>التفاعلات والمشاركات والتعليقات شهرياً</p>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top:8, right:8, bottom:0, left:-10 }} barGap={2} barCategoryGap="30%">
          <CartesianGrid strokeDasharray="4 4" stroke="var(--chart-grid)" vertical={false} />
          <XAxis dataKey="label" tick={{ fill:'var(--text-3)', fontSize:10, fontFamily:'Cairo' }} tickLine={false} axisLine={false} dy={5} />
          <YAxis tick={{ fill:'var(--text-3)', fontSize:10, fontFamily:'Cairo' }} tickLine={false} axisLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill:'rgba(24,119,242,.05)' }} />
          <Bar dataKey="reactions" name="التفاعلات"  fill={FB_BLUE}  radius={[4,4,0,0]} maxBarSize={20} />
          <Bar dataKey="shares"    name="المشاركات"  fill={FB_GREEN} radius={[4,4,0,0]} maxBarSize={20} />
          <Bar dataKey="comments"  name="التعليقات"  fill={FB_AMBER} radius={[4,4,0,0]} maxBarSize={20} />
        </BarChart>
      </ResponsiveContainer>
      <div style={{ display:'flex', gap:18, justifyContent:'center', marginTop:14, flexWrap:'wrap' }}>
        {[['التفاعلات',FB_BLUE],['المشاركات',FB_GREEN],['التعليقات',FB_AMBER]].map(([n,c]) => (
          <div key={n} style={{ display:'flex', alignItems:'center', gap:6 }}>
            <div style={{ width:10, height:10, borderRadius:3, background:c }} />
            <span style={{ fontSize:11, color:'var(--text-2)' }}>{n}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
