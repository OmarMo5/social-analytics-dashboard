import React from 'react';

export default function SummaryMetricCard({ label, value, footer, badge, badgeColor }) {
  return (
    <div
      className="card fade-up"
      style={{
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '110px',
        flex: '1 1 200px',
      }}
    >
      {/* Top Header Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-2)' }}>
          {label}
        </span>
        {badge && (
          <span
            style={{
              fontSize: '10px',
              fontWeight: '700',
              padding: '2px 8px',
              borderRadius: '6px',
              background: badgeColor ? `color-mix(in srgb, ${badgeColor} 12%, transparent)` : 'var(--border)',
              border: `1px solid ${badgeColor || 'var(--border)'}`,
              color: badgeColor || 'var(--text-3)',
            }}
          >
            {badge}
          </span>
        )}
      </div>

      {/* Middle Value Row */}
      <div style={{ margin: '8px 0', textAlign: 'center' }}>
        <span
          style={{
            fontSize: '28px',
            fontWeight: '900',
            color: 'var(--text-1)',
            letterSpacing: '-0.5px',
          }}
        >
          {value}
        </span>
      </div>

      {/* Footer Subtext */}
      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
        <span style={{ fontSize: '11px', color: 'var(--text-3)', fontWeight: '500' }}>
          {footer}
        </span>
      </div>
    </div>
  );
}
