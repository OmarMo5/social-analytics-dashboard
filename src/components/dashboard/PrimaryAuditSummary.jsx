import React from 'react';

export default function PrimaryAuditSummary() {
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
        {/* Title */}
        <h2
          style={{
            fontSize: '18px',
            fontWeight: '800',
            color: 'var(--text-1)',
            marginBottom: '20px',
            borderBottom: '1px solid var(--border)',
            paddingBottom: '12px',
          }}
        >
          ملخص المحقق الأولي
        </h2>

        {/* Section 1: الهوية الرسمية */}
        <div style={{ marginBottom: '20px' }}>
          <h3
            style={{
              fontSize: '14px',
              fontWeight: '700',
              color: 'var(--text-1)',
              marginBottom: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            الهوية الرسمية
          </h3>
          <p
            style={{
              fontSize: '12px',
              color: 'var(--text-2)',
              margin: '0',
              lineHeight: '1.6',
            }}
          >
            الموقع وصفحات المعلومات تؤكد الاسم والحسابات والفروع في مكة والمدينة والرباط وداكار ونواكشوط.
          </p>
        </div>

        {/* Section 2: المنصات الاجتماعية */}
        <div style={{ marginBottom: '20px' }}>
          <h3
            style={{
              fontSize: '14px',
              fontWeight: '700',
              color: 'var(--text-1)',
              marginBottom: '6px',
            }}
          >
            المنصات الاجتماعية
          </h3>
          <p
            style={{
              fontSize: '12px',
              color: 'var(--text-2)',
              margin: '0',
              lineHeight: '1.6',
            }}
          >
            تم إدراج كل الروابط الرسمية وتفعيل لوحات المؤشرات لكل من فيسبوك وإنستجرام وتيك توك ويوتيوب.
          </p>
        </div>

        {/* Section 3: المتابعة المستمرة */}
        <div style={{ marginBottom: '10px' }}>
          <h3
            style={{
              fontSize: '14px',
              fontWeight: '700',
              color: 'var(--text-1)',
              marginBottom: '6px',
            }}
          >
            المتابعة المستمرة
          </h3>
          <p
            style={{
              fontSize: '12px',
              color: 'var(--text-2)',
              margin: '0',
              lineHeight: '1.6',
            }}
          >
            نعمل على رصد ما ينشر في الإنترنت والمواقع الإخبارية الإلكترونية لحظة بلحظة مع التحقق التلقائي للبيانات.
          </p>
        </div>
      </div>

      {/* Pulse Dot Status */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '6px', opacity: 0.7 }}>
        <div
          className="live-dot"
          style={{
            width: '6px',
            height: '6px',
            backgroundColor: 'var(--accent)',
            animation: 'ripple 3s infinite',
          }}
        />
        <span style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-3)', letterSpacing: '0.5px' }}>
          .listening
        </span>
      </div>
    </div>
  );
}
