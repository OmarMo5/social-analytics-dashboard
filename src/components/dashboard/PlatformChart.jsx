const COLORS = {
  'X (تويتر)': '#94a3b8',
  Instagram: '#e1306c',
  TikTok: '#2dd4bf',
  YouTube: '#f87171',
  Facebook: '#60a5fa',
  LinkedIn: '#38bdf8',
  'أخبار إلكترونية': '#818cf8',
  'مواقع إلكترونية': '#a78bfa',
  بودكاست: '#fbbf24',
};

const getColor = (name) => COLORS[name] || 'var(--accent)';

export default function PlatformChart({ data }) {
  const top = data.slice(0, 7);
  const max = top[0]?.value || 1;

  return (
    <div
      className="platform-chart"
      style={{
        background: 'var(--bg-card)',
        borderRadius: 12,
        border: '1px solid var(--border)',
        padding: '20px 20px 18px',
        minHeight: 260,
        width: '100%',
      }}
    >
      <div style={{ marginBottom: 16 }}>
        <h3
          className="chart-title"
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: 'var(--text-1)',
            margin: 0,
          }}
        >
          توزيع النشاط على المنصات
        </h3>
        <p
          className="chart-sub"
          style={{
            fontSize: 12,
            color: 'var(--text-3)',
            margin: '4px 0 0',
          }}
        >
          نسبة كل منصة من إجمالي التغطية
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {top.map((item, i) => {
          const color = getColor(item.name);
          const width = Math.round((item.value / max) * 100);

          return (
            <div key={item.name}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 4,
                  gap: 8,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    minWidth: 0,
                  }}
                >
                  <div
                    className="item-dot"
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: color,
                      flexShrink: 0,
                    }}
                  />
                  <span
                    className="item-name"
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: 'var(--text-1)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {item.name}
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    flexShrink: 0,
                  }}
                >
                  <span
                    className="item-count"
                    style={{
                      fontSize: 10,
                      color: 'var(--text-3)',
                    }}
                  >
                    {item.value} خبر
                  </span>
                  <span
                    className="item-pct"
                    style={{
                      fontSize: 13,
                      fontWeight: 800,
                      color: color,
                      minWidth: 32,
                      textAlign: 'left',
                    }}
                  >
                    {item.pct}%
                  </span>
                </div>
              </div>
              <div
                className="item-bar"
                style={{
                  height: 6,
                  borderRadius: 99,
                  background: 'var(--border)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${width}%`,
                    borderRadius: 99,
                    background: `linear-gradient(90deg, ${color}, ${color}80)`,
                    transition: 'width 1s ease',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .platform-chart {
            padding: 16px 16px 14px !important;
            min-height: 220px !important;
          }
          .platform-chart .chart-title {
            font-size: 14px !important;
          }
          .platform-chart .chart-sub {
            font-size: 11px !important;
          }
          .platform-chart .item-name {
            font-size: 11px !important;
          }
          .platform-chart .item-count {
            font-size: 9px !important;
          }
          .platform-chart .item-pct {
            font-size: 12px !important;
            min-width: 28px !important;
          }
          .platform-chart .item-bar {
            height: 5px !important;
          }
        }

        @media (max-width: 480px) {
          .platform-chart {
            padding: 12px 12px 10px !important;
            min-height: 180px !important;
          }
          .platform-chart .chart-title {
            font-size: 13px !important;
          }
          .platform-chart .chart-sub {
            font-size: 10px !important;
          }
          .platform-chart .item-name {
            font-size: 10px !important;
          }
          .platform-chart .item-count {
            font-size: 8px !important;
          }
          .platform-chart .item-pct {
            font-size: 11px !important;
            min-width: 24px !important;
          }
          .platform-chart .item-bar {
            height: 4px !important;
          }
          .platform-chart .item-dot {
            width: 5px !important;
            height: 5px !important;
          }
        }
      `}</style>
    </div>
  );
}