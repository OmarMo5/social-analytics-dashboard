import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const X_BLUE = '#1d9bf0';
const X_PINK = '#f91880';
const X_GREEN = '#00ba7c';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="card" style={{ padding: '12px 16px', border: '1px solid rgba(29,155,240,.3)' }}>
      <p style={{ color: 'var(--text-2)', fontSize: 11, marginBottom: 8 }}>{label}</p>
      {payload.map(p => (
        <div key={p.name} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginBottom: 4 }}>
          <span style={{ fontSize: 12, color: p.fill }}>{p.name}</span>
          <span style={{ fontSize: 13, fontWeight: 800, color: p.fill }}>
            {p.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function XEngagementChart({ data }) {
  if (!data?.length) return null;

  return (
    <div className="card" style={{ padding: '24px 24px 18px' }}>
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-1)' }}>
          التفاعل الشهري
        </h3>
        <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>
          الإعجابات وإعادة النشر والردود شهرياً
        </p>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart
          data={data}
          margin={{ top: 8, right: 8, bottom: 0, left: -10 }}
          barGap={2}
          barCategoryGap="30%"
        >
          <CartesianGrid strokeDasharray="4 4" stroke="var(--chart-grid)" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: 'var(--text-3)', fontSize: 10, fontFamily: 'Cairo' }}
            tickLine={false}
            axisLine={false}
            dy={5}
          />
          <YAxis
            tick={{ fill: 'var(--text-3)', fontSize: 10, fontFamily: 'Cairo' }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(29,155,240,.05)' }} />
          <Bar dataKey="likes" name="الإعجابات" fill={X_PINK} radius={[4, 4, 0, 0]} maxBarSize={20} />
          <Bar dataKey="retweets" name="إعادة النشر" fill={X_GREEN} radius={[4, 4, 0, 0]} maxBarSize={20} />
          <Bar dataKey="replies" name="الردود" fill={X_BLUE} radius={[4, 4, 0, 0]} maxBarSize={20} />
        </BarChart>
      </ResponsiveContainer>
      <div style={{ display: 'flex', gap: 18, justifyContent: 'center', marginTop: 14, flexWrap: 'wrap' }}>
        {[
          ['الإعجابات', X_PINK],
          ['إعادة النشر', X_GREEN],
          ['الردود', X_BLUE]
        ].map(([n, c]) => (
          <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: c }} />
            <span style={{ fontSize: 11, color: 'var(--text-2)' }}>{n}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
