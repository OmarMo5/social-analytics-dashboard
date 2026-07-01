import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="card" style={{ padding: '10px 14px', border: '1px solid rgba(29,155,240,.3)' }}>
      <p style={{ color: 'var(--text-2)', fontSize: 11, marginBottom: 6 }}>{label}</p>
      <p style={{ fontSize: 13, fontWeight: 800, color: '#1d9bf0' }}>
        {payload[0].value.toLocaleString()} تغريدة
      </p>
    </div>
  );
};

export default function XVolumeChart({ data }) {
  if (!data?.length) return null;

  return (
    <div className="card" style={{ padding: '24px 24px 18px' }}>
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-1)' }}>
          حجم التغريدات الشهري
        </h3>
        <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>
          عدد التغريدات المنشورة في كل شهر
        </p>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -10 }}>
          <defs>
            <linearGradient id="xVolumeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1d9bf0" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#1d9bf0" stopOpacity={0} />
            </linearGradient>
          </defs>
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
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(29,155,240,.15)', strokeWidth: 1 }} />
          <Area
            type="monotone"
            dataKey="count"
            name="التغريدات"
            stroke="#1d9bf0"
            strokeWidth={2}
            fill="url(#xVolumeGrad)"
            dot={{ fill: '#1d9bf0', r: 3, strokeWidth: 0 }}
            activeDot={{ r: 6, fill: '#fff', stroke: '#1d9bf0', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
