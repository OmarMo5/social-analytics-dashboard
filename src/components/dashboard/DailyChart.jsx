import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: 'var(--bg-card)',
        padding: '10px 14px',
        borderRadius: 8,
        border: '1px solid rgba(251,191,36,.3)',
      }}
    >
      <p style={{ fontSize: 12, color: 'var(--text-2)', margin: 0 }}>{label}</p>
      <p
        style={{
          fontSize: 18,
          fontWeight: 900,
          color: 'var(--gold)',
          margin: '4px 0 0',
        }}
      >
        {payload[0].value}
      </p>
      <p style={{ fontSize: 10, color: 'var(--text-3)', margin: '2px 0 0' }}>
        خبر
      </p>
    </div>
  );
};

export default function DailyChart({ data }) {
  if (!data?.length) return null;

  const maxVal = Math.max(...data.map((d) => d.count));
  const formatted = data.map((d) => ({
    ...d,
    label: new Date(d.date).toLocaleDateString('ar-EG', {
      month: 'short',
      day: 'numeric',
    }),
  }));

  return (
    <div
      className="daily-chart"
      style={{
        background: 'var(--bg-card)',
        borderRadius: 12,
        border: '1px solid var(--border)',
        padding: '20px 20px 16px',
        minHeight: 260,
        width: '100%',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: 16,
          flexWrap: 'wrap',
          gap: 8,
        }}
      >
        <div>
          <h3
            className="chart-title"
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: 'var(--text-1)',
              margin: 0,
            }}
          >
            تطوّر حجم التغطية
          </h3>
          <p
            className="chart-sub"
            style={{
              fontSize: 12,
              color: 'var(--text-3)',
              margin: '4px 0 0',
            }}
          >
            الأخبار اليومية خلال آخر 14 يومًا
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span
            className="chart-max"
            style={{
              fontSize: 28,
              fontWeight: 900,
              color: 'var(--gold)',
              lineHeight: 1,
            }}
          >
            {maxVal}
          </span>
          <span style={{ fontSize: 11, color: 'var(--text-3)' }}>أعلى يوم</span>
        </div>
      </div>

      <div className="chart-container" style={{ width: '100%', height: 190 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={formatted}
            margin={{ top: 8, right: 8, bottom: 0, left: -12 }}
          >
            <defs>
              <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--gold)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="var(--gold)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="4 4"
              stroke="var(--chart-grid)"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tick={{
                fill: 'var(--text-3)',
                fontSize: 10,
                fontFamily: 'Cairo',
              }}
              tickLine={false}
              axisLine={false}
              dy={5}
            />
            <YAxis
              allowDecimals={false}
              tick={{
                fill: 'var(--text-3)',
                fontSize: 10,
                fontFamily: 'Cairo',
              }}
              tickLine={false}
              axisLine={false}
              width={30}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              y={maxVal}
              stroke="rgba(251,191,36,.2)"
              strokeDasharray="5 4"
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="var(--gold)"
              strokeWidth={2.5}
              fill="url(#goldGrad)"
              dot={{ fill: 'var(--gold)', r: 3, strokeWidth: 0 }}
              activeDot={{
                r: 6,
                fill: '#fff',
                stroke: 'var(--gold)',
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .daily-chart {
            padding: 16px 16px 12px !important;
            min-height: 220px !important;
          }
          .daily-chart .chart-title {
            font-size: 14px !important;
          }
          .daily-chart .chart-sub {
            font-size: 11px !important;
          }
          .daily-chart .chart-max {
            font-size: 22px !important;
          }
          .daily-chart .chart-container {
            height: 160px !important;
          }
        }

        @media (max-width: 480px) {
          .daily-chart {
            padding: 12px 12px 10px !important;
            min-height: 180px !important;
          }
          .daily-chart .chart-title {
            font-size: 13px !important;
          }
          .daily-chart .chart-sub {
            font-size: 10px !important;
          }
          .daily-chart .chart-max {
            font-size: 18px !important;
          }
          .daily-chart .chart-container {
            height: 130px !important;
          }
        }
      `}</style>
    </div>
  );
}