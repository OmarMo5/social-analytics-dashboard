import { Zap } from 'lucide-react';

const COLORS = {
  'X (تويتر)': '#94a3b8',
  Instagram: '#e1306c',
  TikTok: '#2dd4bf',
  YouTube: '#f87171',
  Facebook: '#60a5fa',
  LinkedIn: '#38bdf8',
  'أخبار إلكترونية': '#818cf8',
  'مواقع إلكترونية': '#a78bfa',
};

const getColor = (name) => COLORS[name] || 'var(--gold)';

export default function TopPlatformCard({ platforms }) {
  const top = platforms?.[0];
  if (!top) return null;

  const color = getColor(top.name);

  return (
    <div
      className="top-platform"
      style={{
        background: 'var(--bg-card)',
        borderRadius: 12,
        border: '1px solid var(--border)',
        padding: '20px 20px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        minHeight: 210,
        width: '100%',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Zap size={16} style={{ color: 'var(--gold)' }} />
          <span
            className="platform-title"
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: 'var(--text-1)',
            }}
          >
            أكثر منصة نشاطًا
          </span>
        </div>
        <span style={{ fontSize: 11, color: 'var(--text-3)' }}>
          حسب الإشارات
        </span>
      </div>

      <div
        className="platform-box"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '12px 16px',
          borderRadius: 10,
          background: `color-mix(in srgb, ${color} 8%, var(--bg-card))`,
          border: `1px solid color-mix(in srgb, ${color} 20%, transparent)`,
          flexWrap: 'wrap',
        }}
      >
        <div
          className="platform-icon"
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: `color-mix(in srgb, ${color} 15%, transparent)`,
            border: `2px solid color-mix(in srgb, ${color} 30%, transparent)`,
            fontSize: 20,
            fontWeight: 900,
            color: color,
            flexShrink: 0,
          }}
        >
          {top.name[0]}
        </div>
        <div style={{ flex: 1, minWidth: 100 }}>
          <p
            className="platform-name"
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: color,
              margin: 0,
            }}
          >
            {top.name}
          </p>
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 8,
              marginTop: 2,
              flexWrap: 'wrap',
            }}
          >
            <span
              className="platform-value"
              style={{
                fontSize: 26,
                fontWeight: 900,
                color: 'var(--text-1)',
                lineHeight: 1,
              }}
            >
              {top.pct}%
            </span>
            <span style={{ fontSize: 11, color: 'var(--text-3)' }}>
              من الإشارات · {top.value} خبر
            </span>
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 6,
          flexWrap: 'wrap',
        }}
      >
        {platforms.slice(1, 4).map((p) => {
          const pc = getColor(p.name);
          return (
            <div
              key={p.name}
              className="platform-badge"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 12px',
                borderRadius: 8,
                background: `color-mix(in srgb, ${pc} 8%, var(--bg-card))`,
                border: `1px solid color-mix(in srgb, ${pc} 20%, transparent)`,
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: pc,
                }}
              />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: 'var(--text-2)',
                }}
              >
                {p.name}
              </span>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  color: pc,
                }}
              >
                {p.pct}%
              </span>
            </div>
          );
        })}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .top-platform {
            padding: 16px 16px 14px !important;
            min-height: 180px !important;
          }
          .top-platform .platform-title {
            font-size: 14px !important;
          }
          .top-platform .platform-box {
            padding: 10px 14px !important;
            gap: 12px !important;
          }
          .top-platform .platform-icon {
            width: 40px !important;
            height: 40px !important;
            font-size: 18px !important;
          }
          .top-platform .platform-name {
            font-size: 14px !important;
          }
          .top-platform .platform-value {
            font-size: 22px !important;
          }
        }

        @media (max-width: 480px) {
          .top-platform {
            padding: 12px 12px 10px !important;
            min-height: 150px !important;
          }
          .top-platform .platform-title {
            font-size: 13px !important;
          }
          .top-platform .platform-box {
            padding: 8px 12px !important;
            gap: 10px !important;
          }
          .top-platform .platform-icon {
            width: 34px !important;
            height: 34px !important;
            font-size: 16px !important;
          }
          .top-platform .platform-name {
            font-size: 13px !important;
          }
          .top-platform .platform-value {
            font-size: 18px !important;
          }
          .top-platform .platform-badge {
            font-size: 10px !important;
            padding: 3px 8px !important;
          }
        }
      `}</style>
    </div>
  );
}