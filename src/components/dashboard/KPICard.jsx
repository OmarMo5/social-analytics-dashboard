export default function KPICard({
  icon: Icon,
  label,
  value,
  sub,
  subColor,
  iconColor,
  trend,
}) {
  const ic = iconColor || 'var(--gold)';

  return (
    <div
      className="kpi-card"
      style={{
        background: 'var(--bg-card)',
        borderRadius: 12,
        border: '1px solid var(--border)',
        padding: '20px 22px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: 140,
        transition: 'all 0.2s',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 8,
        }}
      >
        <span
          className="kpi-label"
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--text-2)',
            lineHeight: 1.4,
            maxWidth: 120,
          }}
        >
          {label}
        </span>
        <div
          className="kpi-icon"
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: `color-mix(in srgb, ${ic} 12%, transparent)`,
            border: `1px solid color-mix(in srgb, ${ic} 20%, transparent)`,
            flexShrink: 0,
          }}
        >
          <Icon size={18} style={{ color: ic }} />
        </div>
      </div>

      <div>
        <p
          className="kpi-value"
          style={{
            fontSize: 28,
            fontWeight: 900,
            color: 'var(--text-1)',
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          {value}
        </p>
        {sub && (
          <p
            className="kpi-sub"
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: subColor || 'var(--text-3)',
              margin: '4px 0 0',
            }}
          >
            {sub}
          </p>
        )}
      </div>

      {trend && (
        <div style={{ marginTop: 8 }}>
          <span
            className="kpi-trend"
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: 'var(--pos)',
              background: 'var(--pos-bg)',
              padding: '2px 10px',
              borderRadius: 6,
              border: '1px solid var(--pos-border)',
            }}
          >
            ▲ {trend}%
          </span>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .kpi-card {
            padding: 14px 16px !important;
            min-height: 110px !important;
          }
          .kpi-card .kpi-label {
            font-size: 11px !important;
            max-width: 80px !important;
          }
          .kpi-card .kpi-icon {
            width: 32px !important;
            height: 32px !important;
          }
          .kpi-card .kpi-icon svg {
            width: 15px !important;
            height: 15px !important;
          }
          .kpi-card .kpi-value {
            font-size: 22px !important;
          }
          .kpi-card .kpi-sub {
            font-size: 10px !important;
          }
        }

        @media (max-width: 480px) {
          .kpi-card {
            padding: 10px 12px !important;
            min-height: 85px !important;
          }
          .kpi-card .kpi-label {
            font-size: 9px !important;
            max-width: 60px !important;
          }
          .kpi-card .kpi-icon {
            width: 26px !important;
            height: 26px !important;
          }
          .kpi-card .kpi-icon svg {
            width: 12px !important;
            height: 12px !important;
          }
          .kpi-card .kpi-value {
            font-size: 17px !important;
          }
          .kpi-card .kpi-sub {
            font-size: 8px !important;
          }
          .kpi-card .kpi-trend {
            font-size: 9px !important;
            padding: 1px 6px !important;
          }
        }
      `}</style>
    </div>
  );
}