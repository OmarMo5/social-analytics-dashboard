import { TrendingUp, Hash } from 'lucide-react';

export default function TrendingCard({ articles }) {
  const top = articles[0];

  // تحليل الكلمات الأكثر تكراراً
  const stopwords = new Set([
    'التي',
    'على',
    'في',
    'من',
    'عن',
    'مع',
    'الذي',
    'هذا',
    'وهو',
    'وقد',
    'الى',
    'إلى',
    'كما',
    'لم',
    'قد',
    'ما',
    'هذه',
    'كان',
    'له',
    'بين',
    'بما',
    'لا',
    'الا',
    'أو',
    'أن',
    'إن',
    'كل',
    'أي',
    'إذ',
    'حتى',
    'عند',
    'منذ',
    'غير',
    'يكون',
    'وهي',
    'فقد',
    'وما',
    'وكان',
    'ولا',
    'هو',
    'هي',
    'هم',
    'وفي',
    'وعن',
    'عن',
  ]);

  const freq = {};
  articles.forEach((a) => {
    a.title
      .split(/\s+/)
      .filter((w) => w.length > 3 && !stopwords.has(w))
      .forEach((w) => {
        const k = w.replace(/[^؀-ۿ]/g, '');
        if (k.length > 2) freq[k] = (freq[k] || 0) + 1;
      });
  });

  const topWord = Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0] || '';

  return (
    <div
      className="trending-card"
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
          <TrendingUp size={16} style={{ color: 'var(--pos)' }} />
          <span
            className="trend-title"
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: 'var(--text-1)',
            }}
          >
            الأكثر تداولًا
          </span>
        </div>
        <span style={{ fontSize: 11, color: 'var(--text-3)' }}>
          الموضوع الأبرز
        </span>
      </div>

      {top && (
        <div
          className="trend-content"
          style={{
            padding: '12px 16px',
            borderRadius: 10,
            background: 'var(--bg-input)',
            border: '1px solid var(--border)',
            flex: 1,
          }}
        >
          <p
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--text-1)',
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            «{top.title.length > 100 ? top.title.slice(0, 100) + '...' : top.title}»
          </p>
        </div>
      )}

      {topWord && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            flexWrap: 'wrap',
          }}
        >
          <span
            className="trend-word"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              fontSize: 12,
              fontWeight: 700,
              padding: '4px 14px',
              borderRadius: 99,
              color: 'var(--pos)',
              background: 'var(--pos-bg)',
              border: '1px solid var(--pos-border)',
            }}
          >
            <Hash size={12} />
            {topWord}
          </span>
          <span className="trend-count" style={{ fontSize: 11, color: 'var(--text-3)' }}>
            {freq[topWord]} تكرار في {articles.length} خبر
          </span>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .trending-card {
            padding: 16px 16px 14px !important;
            min-height: 180px !important;
          }
          .trending-card .trend-title {
            font-size: 14px !important;
          }
          .trending-card .trend-content {
            font-size: 12px !important;
            padding: 10px 14px !important;
          }
        }

        @media (max-width: 480px) {
          .trending-card {
            padding: 12px 12px 10px !important;
            min-height: 150px !important;
          }
          .trending-card .trend-title {
            font-size: 13px !important;
          }
          .trending-card .trend-content {
            font-size: 11px !important;
            padding: 8px 12px !important;
          }
          .trending-card .trend-word {
            font-size: 11px !important;
            padding: 3px 10px !important;
          }
          .trending-card .trend-count {
            font-size: 10px !important;
          }
        }
      `}</style>
    </div>
  );
}