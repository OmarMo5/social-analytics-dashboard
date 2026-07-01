import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../../context/ThemeContext';

const DARK_COLORS = {
  إيجابي: '#34d399',
  سلبي: '#f87171',
  محايد: '#fbbf24',
  'غير محدد': '#475569',
};

const LIGHT_COLORS = {
  إيجابي: '#059669',
  سلبي: '#dc2626',
  محايد: '#d97706',
  'غير محدد': '#94a3b8',
};

export default function SentimentDonut({ data }) {
  const { theme } = useTheme();
  const COLORS = theme === 'dark' ? DARK_COLORS : LIGHT_COLORS;
  const total = data.reduce((s, d) => s + d.value, 0);
  const top = [...data].sort((a, b) => b.value - a.value)[0];

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    const c = COLORS[d.name] || 'var(--text-1)';
    return (
      <div
        style={{
          background: 'var(--bg-card)',
          padding: '10px 14px',
          borderRadius: 8,
          border: `1px solid color-mix(in srgb, ${c} 30%, transparent)`,
        }}
      >
        <p style={{ color: c, fontWeight: 700, fontSize: 13, margin: 0 }}>
          {d.name}
        </p>
        <p style={{ color: 'var(--text-2)', fontSize: 11, margin: '4px 0 0' }}>
          {d.value} خبر · {d.pct}%
        </p>
      </div>
    );
  };

  return (
    <div
      className="sentiment-card"
      style={{
        background: 'var(--bg-card)',
        borderRadius: 12,
        border: '1px solid var(--border)',
        padding: '20px 20px 18px',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 210,
        width: '100%',
      }}
    >
      <div style={{ marginBottom: 16 }}>
        <h3
          className="sentiment-title"
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: 'var(--text-1)',
            margin: 0,
          }}
        >
          المشاعر العامة
        </h3>
        <p
          className="sentiment-sub"
          style={{
            fontSize: 12,
            color: 'var(--text-3)',
            margin: '4px 0 0',
          }}
        >
          توزيع انطباعات {total} خبر
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          flex: 1,
        }}
      >
        <div
          className="chart-container"
          style={{
            position: 'relative',
            width: 140,
            height: 140,
            flexShrink: 0,
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={44}
                outerRadius={64}
                paddingAngle={3}
                startAngle={90}
                endAngle={-270}
                strokeWidth={0}
              >
                {data.map((e) => (
                  <Cell
                    key={e.name}
                    fill={COLORS[e.name] || '#64748b'}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {top && (
            <div
              className="chart-inner"
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
              }}
            >
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 900,
                  color: COLORS[top.name] || 'var(--text-1)',
                  lineHeight: 1,
                }}
              >
                {top.pct}%
              </span>
              <span
                style={{
                  fontSize: 10,
                  color: 'var(--text-3)',
                  marginTop: 2,
                  textAlign: 'center',
                }}
              >
                {top.name}
              </span>
            </div>
          )}
        </div>

        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            minWidth: 0,
          }}
        >
          {data.map((e) => {
            const c = COLORS[e.name] || '#64748b';
            return (
              <div key={e.name}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 3,
                    gap: 6,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      minWidth: 0,
                    }}
                  >
                    <div
                      className="legend-dot"
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: '50%',
                        background: c,
                        flexShrink: 0,
                      }}
                    />
                    <span
                      className="legend-text"
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: 'var(--text-1)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {e.name}
                    </span>
                  </div>
                  <span
                    className="legend-value"
                    style={{
                      fontSize: 13,
                      fontWeight: 800,
                      color: c,
                      flexShrink: 0,
                    }}
                  >
                    {e.pct}%
                  </span>
                </div>
                <div
                  className="legend-bar"
                  style={{
                    height: 5,
                    borderRadius: 99,
                    background: 'var(--border)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${e.pct}%`,
                      borderRadius: 99,
                      background: `linear-gradient(90deg, ${c}, ${c}80)`,
                      transition: 'width .8s ease',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .sentiment-card {
            padding: 16px 16px 14px !important;
            min-height: 180px !important;
          }
          .sentiment-card .sentiment-title {
            font-size: 14px !important;
          }
          .sentiment-card .sentiment-sub {
            font-size: 11px !important;
          }
          .sentiment-card .chart-container {
            width: 120px !important;
            height: 120px !important;
          }
          .sentiment-card .chart-inner {
            font-size: 16px !important;
          }
          .sentiment-card .legend-text {
            font-size: 11px !important;
          }
          .sentiment-card .legend-value {
            font-size: 12px !important;
          }
        }

        @media (max-width: 480px) {
          .sentiment-card {
            padding: 12px 12px 10px !important;
            min-height: 150px !important;
          }
          .sentiment-card .sentiment-title {
            font-size: 13px !important;
          }
          .sentiment-card .sentiment-sub {
            font-size: 10px !important;
          }
          .sentiment-card .chart-container {
            width: 100px !important;
            height: 100px !important;
          }
          .sentiment-card .chart-inner {
            font-size: 14px !important;
          }
          .sentiment-card .legend-text {
            font-size: 10px !important;
          }
          .sentiment-card .legend-value {
            font-size: 11px !important;
          }
          .sentiment-card .legend-bar {
            height: 4px !important;
          }
          .sentiment-card .legend-dot {
            width: 5px !important;
            height: 5px !important;
          }
        }
      `}</style>
    </div>
  );
}