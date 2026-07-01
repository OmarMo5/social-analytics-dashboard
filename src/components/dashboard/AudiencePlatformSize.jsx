import React from 'react';

export default function AudiencePlatformSize({ tiktokStats, facebookStats, xStats, xAnalytics }) {
  // Extract values from dynamic states
  const tiktokFollowers = tiktokStats?.followerCount || 29029;
  const tiktokLikes = tiktokStats?.totalLikes || 1054984;
  const tiktokVideos = tiktokStats?.totalVideos || 141;

  const fbFollowers = facebookStats?.totalFollowers || 43794;
  const fbLikes = facebookStats?.totalLikes || 43794;

  const igFollowers = 45000; // Instagram follower count (static baseline)

  const xEngagement = xAnalytics?.totalEngagement || 0;
  const xTweets = xStats?.totalTweets || 0;

  // Format helper
  const fmt = (n) => {
    if (!n && n !== 0) return '—';
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return n.toLocaleString();
  };

  // Create list of platforms with follower counts to sort them dynamically
  const platformList = [
    { name: 'Instagram', label: 'Instagram', count: igFollowers, color: '#c25e00' },
    { name: 'Facebook', label: 'Facebook', count: fbFollowers, color: '#1877f2' },
    { name: 'TikTok', label: 'TikTok', count: tiktokFollowers, color: '#0f766e' },
  ];

  // Sort descending by follower count
  platformList.sort((a, b) => b.count - a.count);

  const maxFollowers = platformList[0].count;

  // Determine strongest platform
  const strongest = platformList[0];

  return (
    <div
      className="card fade-up"
      style={{
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        minHeight: '440px',
      }}
    >
      <div>
        {/* Header Title */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-1)', margin: '0' }}>
            حجم الجمهور حسب المنصة
          </h2>
          <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-3)' }}>
            بيانات عامة مؤكدة
          </span>
        </div>

        {/* Horizontal Bars Chart */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '28px' }}>
          
          {/* Render sorted platforms */}
          {platformList.map((p) => {
            const pct = maxFollowers > 0 ? (p.count / maxFollowers) * 100 : 0;
            return (
              <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ width: '45px', fontSize: '12px', fontWeight: '700', color: 'var(--text-2)', textAlign: 'left' }}>
                  {fmt(p.count)}
                </span>
                <div style={{ flex: '1', height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: p.color, borderRadius: '4px', transition: 'width 0.8s ease-in-out' }} />
                </div>
                <span style={{ width: '70px', fontSize: '12px', fontWeight: '700', color: 'var(--text-1)', textAlign: 'right' }}>
                  {p.label}
                </span>
              </div>
            );
          })}

          {/* YouTube (Subscribers not available/empty) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ width: '45px', fontSize: '12px', fontWeight: '700', color: 'var(--text-3)', textAlign: 'left' }}>
              —
            </span>
            <div style={{ flex: '1', height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: '0%', height: '100%', background: '#ef4444', borderRadius: '4px' }} />
            </div>
            <span style={{ width: '70px', fontSize: '12px', fontWeight: '700', color: 'var(--text-1)', textAlign: 'right' }}>
              YouTube
            </span>
          </div>

          {/* X (لا يوجد عدد متابعين في الشيت، بيتعرض تفاعل بدل الجمهور) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ width: '45px', fontSize: '12px', fontWeight: '700', color: 'var(--text-3)', textAlign: 'left' }}>
              —
            </span>
            <div style={{ flex: '1', height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: '0%', height: '100%', background: '#1d9bf0', borderRadius: '4px' }} />
            </div>
            <span style={{ width: '70px', fontSize: '12px', fontWeight: '700', color: 'var(--text-1)', textAlign: 'right' }}>
              X
            </span>
          </div>

        </div>
      </div>

      {/* Grid of Highlight Panels */}
      <div className="grid grid-cols-2 lg:grid-cols-4" style={{ gap: '10px' }}>
        
        {/* Panel 1: Strongest Platform (أقوى جمهور) */}
        <div style={{ background: 'var(--bg-base)', border: '1px solid var(--border)', borderRadius: '10px', padding: '10px 12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '85px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-2)' }}>أقوى جمهور</span>
            <span style={{ fontSize: '9px', fontWeight: '700', padding: '1px 6px', borderRadius: '4px', background: `color-mix(in srgb, ${strongest.color} 12%, transparent)`, color: strongest.color, border: `1px solid color-mix(in srgb, ${strongest.color} 20%, transparent)` }}>
              {strongest.label}
            </span>
          </div>
          <span style={{ fontSize: '18px', fontWeight: '900', color: 'var(--text-1)', textAlign: 'center', margin: '4px 0' }}>
            {strongest.count.toLocaleString()}
          </span>
          <span style={{ fontSize: '9px', color: 'var(--text-3)', textAlign: 'center', fontWeight: '600' }}>
            المنصة ذات المتابعة الأكبر
          </span>
        </div>

        {/* Panel 2: TikTok (أعلى إعجابات) */}
        <div style={{ background: 'var(--bg-base)', border: '1px solid var(--border)', borderRadius: '10px', padding: '10px 12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '85px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-2)' }}>أعلى إعجابات</span>
            <span style={{ fontSize: '9px', fontWeight: '700', padding: '1px 6px', borderRadius: '4px', background: 'rgba(15, 118, 110, 0.1)', color: '#0f766e', border: '1px solid rgba(15, 118, 110, 0.2)' }}>TikTok</span>
          </div>
          <span style={{ fontSize: '18px', fontWeight: '900', color: 'var(--text-1)', textAlign: 'center', margin: '4px 0' }}>
            {fmt(tiktokLikes)}
          </span>
          <span style={{ fontSize: '9px', color: 'var(--text-3)', textAlign: 'center', fontWeight: '600' }}>
            {tiktokVideos} فيديو، {fmt(tiktokFollowers)} متابع
          </span>
        </div>

        {/* Panel 3: Facebook (فيسبوك نشط) */}
        <div style={{ background: 'var(--bg-base)', border: '1px solid var(--border)', borderRadius: '10px', padding: '10px 12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '85px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-2)' }}>فيسبوك</span>
            <span style={{ fontSize: '9px', fontWeight: '700', padding: '1px 6px', borderRadius: '4px', background: 'rgba(24, 119, 242, 0.1)', color: '#1877f2', border: '1px solid rgba(24, 119, 242, 0.2)' }}>Facebook</span>
          </div>
          <span style={{ fontSize: '18px', fontWeight: '900', color: 'var(--text-1)', textAlign: 'center', margin: '4px 0' }}>
            {fbFollowers.toLocaleString()}
          </span>
          <span style={{ fontSize: '9px', color: 'var(--text-3)', textAlign: 'center', fontWeight: '600' }}>
            صفحة رسمية، {fmt(fbLikes)} إعجاب
          </span>
        </div>

        {/* Panel 4: X (إجمالي التفاعل) */}
        <div style={{ background: 'var(--bg-base)', border: '1px solid var(--border)', borderRadius: '10px', padding: '10px 12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '85px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-2)' }}>إجمالي التفاعل</span>
            <span style={{ fontSize: '9px', fontWeight: '700', padding: '1px 6px', borderRadius: '4px', background: 'rgba(29, 155, 240, 0.1)', color: '#1d9bf0', border: '1px solid rgba(29, 155, 240, 0.2)' }}>X</span>
          </div>
          <span style={{ fontSize: '18px', fontWeight: '900', color: 'var(--text-1)', textAlign: 'center', margin: '4px 0' }}>
            {fmt(xEngagement)}
          </span>
          <span style={{ fontSize: '9px', color: 'var(--text-3)', textAlign: 'center', fontWeight: '600' }}>
            {xTweets} تغريدة، تفاعل مرصود
          </span>
        </div>

      </div>
    </div>
  );
}
