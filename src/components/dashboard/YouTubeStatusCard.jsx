import React from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';

export default function YouTubeStatusCard({ youtubeData, status }) {
  const isConnected = status === 'succeeded' && youtubeData;
  const isFailed = status === 'failed';

  const formatNum = (num) => {
    if (!num && num !== 0) return '--';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString();
  };

  const videosCount = isConnected ? youtubeData.total : '--';
  const totalViews = isConnected ? formatNum(youtubeData.totalViews) : '--';

  return (
    <div
      className="card fade-up"
      style={{
        padding: '20px',
        marginBottom: '20px',
        width: '100%',
      }}
    >
      {/* Top Banner Status */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '16px',
          borderBottom: '1px solid var(--border)',
          paddingBottom: '14px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="live-dot" style={{ backgroundColor: 'var(--pos)' }} />
          <span style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-1)' }}>
            YouTube — متصل الآن
          </span>
        </div>

        {/* Dynamic Sync Banner */}
        {isConnected ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: '600',
              color: 'var(--pos)',
              background: 'var(--pos-bg)',
              padding: '4px 12px',
              borderRadius: '8px',
              border: '1px solid var(--pos-border)',
            }}
          >
            <CheckCircle size={14} />
            <span>تم مزامنة البيانات تلقائياً بنجاح</span>
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: '600',
              color: 'var(--gold-dk)',
              background: 'var(--gold-glow)',
              padding: '4px 12px',
              borderRadius: '8px',
              border: '1px solid rgba(251, 191, 36, 0.3)',
            }}
          >
            <AlertTriangle size={14} />
            <span>جاري محاولة الاتصال بالخادم الخلفي...</span>
          </div>
        )}
      </div>

      {/* Internal Subcards Grid */}
      <div
        className="grid grid-cols-1 sm:grid-cols-3"
        style={{
          gap: '16px',
        }}
      >
        {/* Card 1: المشتركون */}
        <div
          style={{
            background: 'var(--bg-base)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '16px',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '100px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-1)' }}>
              المشتركون
            </span>
            <span
              className="badge"
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                color: '#ef4444',
                borderColor: 'rgba(239, 68, 68, 0.2)',
                fontSize: '9px',
                padding: '2px 8px',
              }}
            >
              YouTube API
            </span>
          </div>
          <div style={{ margin: '12px 0 6px', textAlign: 'center' }}>
            <span style={{ fontSize: '26px', fontWeight: '900', color: 'var(--text-1)' }}>
              --
            </span>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-3)', fontWeight: '500' }}>
            مشترك في القناة الرسمية
          </span>
        </div>

        {/* Card 2: المشاهدات */}
        <div
          style={{
            background: 'var(--bg-base)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '16px',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '100px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-1)' }}>
              المشاهدات
            </span>
            <span
              className="badge"
              style={{
                background: 'rgba(59, 130, 246, 0.1)',
                color: '#3b82f6',
                borderColor: 'rgba(59, 130, 246, 0.2)',
                fontSize: '9px',
                padding: '2px 8px',
              }}
            >
              إجمالي
            </span>
          </div>
          <div style={{ margin: '12px 0 6px', textAlign: 'center' }}>
            <span style={{ fontSize: '26px', fontWeight: '900', color: 'var(--text-1)' }}>
              {totalViews}
            </span>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-3)', fontWeight: '500' }}>
            إجمالي مشاهدات القناة
          </span>
        </div>

        {/* Card 3: الفيديوهات */}
        <div
          style={{
            background: 'var(--bg-base)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '16px',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '100px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-1)' }}>
              الفيديوهات
            </span>
            <span
              className="badge"
              style={{
                background: 'rgba(16, 185, 129, 0.1)',
                color: '#10b981',
                borderColor: 'rgba(16, 185, 129, 0.2)',
                fontSize: '9px',
                padding: '2px 8px',
              }}
            >
              قناة
            </span>
          </div>
          <div style={{ margin: '12px 0 6px', textAlign: 'center' }}>
            <span style={{ fontSize: '26px', fontWeight: '900', color: 'var(--text-1)' }}>
              {videosCount}
            </span>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-3)', fontWeight: '500' }}>
            آخر فيديو يظهر تلقائياً
          </span>
        </div>
      </div>
    </div>
  );
}
