import React from 'react';

export default function CircularKPICard({ percentage, label, sub, color }) {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div
      className="card fade-up"
      style={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        justifyContent: 'space-between',
        minHeight: '210px',
        flex: '1 1 180px',
      }}
    >
      {/* SVG Circle Progress */}
      <div style={{ position: 'relative', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="80" height="80" viewBox="0 0 80 80">
          {/* Background circle */}
          <circle
            cx="40"
            cy="40"
            r={radius}
            stroke="var(--border)"
            strokeWidth="5"
            fill="transparent"
          />
          {/* Active progress circle */}
          <circle
            cx="40"
            cy="40"
            r={radius}
            stroke={color}
            strokeWidth="6"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90 40 40)"
            style={{
              transition: 'stroke-dashoffset 0.8s ease-in-out',
            }}
          />
        </svg>
        {/* Percentage Label */}
        <span
          style={{
            position: 'absolute',
            fontSize: '18px',
            fontWeight: '800',
            color: 'var(--text-1)',
          }}
        >
          {percentage}%
        </span>
      </div>

      {/* Label and Subtitle */}
      <div style={{ marginTop: '12px' }}>
        <h3
          style={{
            fontSize: '14px',
            fontWeight: '700',
            color: 'var(--text-1)',
            margin: '0 0 6px 0',
          }}
        >
          {label}
        </h3>
        <p
          style={{
            fontSize: '11px',
            color: 'var(--text-2)',
            margin: '0',
            lineHeight: '1.4',
            minHeight: '32px',
          }}
        >
          {sub}
        </p>
      </div>
    </div>
  );
}
