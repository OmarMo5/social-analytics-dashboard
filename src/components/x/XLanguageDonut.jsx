import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const PALETTE = ['#1d9bf0', '#f91880', '#00ba7c', '#fbbf24', '#a78bfa', '#fb923c'];

export default function XLanguageDonut({ data }) {
  if (!data?.length) return null;

  const total = data.reduce((s, d) => s + d.value, 0);
  const top = data[0];
  const colorOf = (i) => PALETTE[i % PALETTE.length];

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const idx = data.findIndex(d => d.name === payload[0].payload.name);
    const c = colorOf(idx);
    const d = payload[0].payload;
    return (
      <div style={{
        background: 'var(--bg-card)',
        padding: '10px 14px',
        borderRadius: 8,
        border: `1px solid color-mix(in srgb, ${c} 30%, transparent)`,
      }}>
        <p style={{ color: c, fontWeight: 700, fontSize: 13, margin: 0 }}>{d.name}</p>
        <p style={{ color: 'var(--text-2)', fontSize: 11, margin: '4px 0 0' }}>
          {d.value} تغريدة · {d.pct}%
        </p>
      </div>
    );
  };

  return (
    <div className="card" style={{ padding: '20px 20px 18px', display: 'flex', flexDirection: 'column', minHeight: 240, width: '100%' }}>
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-1)', margin: 0 }}>
          توزيع اللغات
        </h3>
        <p style={{ fontSize: 12, color: 'var(--text-3)', margin: '4px 0 0' }}>
          لغات {total} تغريدة
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1 }}>
        <div style={{ position: 'relative', width: 120, height: 120, flexShrink: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={38}
                outerRadius={56}
                paddingAngle={3}
                startAngle={90}
                endAngle={-270}
                strokeWidth={0}
              >
                {data.map((e, i) => (
                  <Cell key={e.name} fill={colorOf(i)} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {top && (
            <div style={{
              position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', pointerEvents: 'none'
            }}>
              <span style={{ fontSize: 16, fontWeight: 900, color: colorOf(0), lineHeight: 1 }}>
                {top.pct}%
              </span>
              <span style={{ fontSize: 9, color: 'var(--text-3)', marginTop: 2, textAlign: 'center' }}>
                {top.name}
              </span>
            </div>
          )}
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 }}>
          {data.slice(0, 5).map((e, i) => {
            const c = colorOf(i);
            return (
              <div key={e.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3, gap: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: c, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {e.name}
                    </span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 800, color: c, flexShrink: 0 }}>{e.pct}%</span>
                </div>
                <div style={{ height: 5, borderRadius: 99, background: 'var(--border)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${e.pct}%`, borderRadius: 99, background: `linear-gradient(90deg, ${c}, ${c}80)`, transition: 'width .8s ease' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
