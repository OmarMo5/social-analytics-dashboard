import { useState } from 'react';
import { Heart, Repeat2, MessageCircle, Quote, Bookmark, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

function fmt(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n?.toLocaleString() ?? '0';
}

function Metric({ icon: Icon, value, color, label }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 3,
      flex: 1,
      minWidth: 0
    }}>
      <Icon size={14} style={{ color }} />
      <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-1)', lineHeight: 1 }}>
        {fmt(value)}
      </span>
      <span style={{ fontSize: 10, color: 'var(--text-3)' }}>{label}</span>
    </div>
  );
}

function MediaGrid({ media }) {
  const [errored, setErrored] = useState({});
  const visible = media.filter((_, i) => !errored[i]);
  if (!visible.length) return null;

  const markError = (i) => setErrored(e => ({ ...e, [i]: true }));

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: media.length === 1 ? '1fr' : '1fr 1fr',
      gap: 4,
      borderRadius: 10,
      overflow: 'hidden',
      marginBottom: 10,
      maxHeight: media.length === 1 ? 200 : 160
    }}>
      {media.slice(0, 4).map((url, i) => (
        !errored[i] && (
          <div key={url + i} style={{ position: 'relative', background: 'var(--bg-base)', overflow: 'hidden' }}>
            <img
              src={url}
              alt=""
              onError={() => markError(i)}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', minHeight: 90, maxHeight: media.length === 1 ? 200 : 160 }}
            />
            {i === 3 && media.length > 4 && (
              <div style={{
                position: 'absolute', inset: 0, background: 'rgba(0,0,0,.55)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <span style={{ color: '#fff', fontSize: 15, fontWeight: 800 }}>+{media.length - 4}</span>
              </div>
            )}
          </div>
        )
      ))}
    </div>
  );
}

export default function XPostCard({ tweet, rank }) {
  const [expanded, setExpanded] = useState(false);

  const {
    text,
    language,
    created_date,
    created_time,
    likes = 0,
    retweets = 0,
    replies = 0,
    quotes = 0,
    bookmarks = 0,
    tweet_url,
    media = [],
  } = tweet;

  const isLong = text?.length > 160;
  const display = isLong && !expanded ? text.slice(0, 160) + '…' : text || '';

  const dateStr = created_date
    ? new Date(created_date).toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : '';

  return (
    <div
      className="card fade-up"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 280,
        padding: '18px 20px',
        position: 'relative',
        overflow: 'hidden',
        justifyContent: 'space-between'
      }}
    >
      {/* X gradient accent */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        height: 3,
        background: 'linear-gradient(90deg, #1d9bf0, #e7e9ea)',
        borderRadius: '12px 12px 0 0'
      }} />

      {/* ========== القسم العلوي: التاريخ + اللغة ========== */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginTop: 4 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 10, color: 'var(--text-3)', margin: 0 }}>
            {dateStr}{created_time ? ` · ${created_time}` : ''}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          {language && (
            <span style={{
              fontSize: 10,
              fontWeight: 700,
              color: '#1d9bf0',
              background: 'color-mix(in srgb, #1d9bf0 12%, transparent)',
              border: '1px solid color-mix(in srgb, #1d9bf0 25%, transparent)',
              borderRadius: 20,
              padding: '2px 9px',
              textTransform: 'uppercase'
            }}>
              {language}
            </span>
          )}
          {rank !== undefined && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              background: 'color-mix(in srgb, #fbbf24 12%, transparent)',
              border: '1px solid color-mix(in srgb, #fbbf24 30%, transparent)',
              borderRadius: 20,
              padding: '2px 10px',
              height: 24
            }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: '#fbbf24' }}>#{rank}</span>
            </div>
          )}
        </div>
      </div>

      {/* ========== القسم الأوسط: الصور + النص ========== */}
      <div style={{ flex: 1, minHeight: 0, marginTop: 10 }}>
        <MediaGrid media={media} />

        <div style={{ minHeight: 50 }}>
          {text ? (
            <>
              <p dir="auto" style={{
                fontSize: 12.5,
                color: 'var(--text-2)',
                lineHeight: 1.6,
                margin: 0,
                whiteSpace: 'pre-line',
                display: '-webkit-box',
                WebkitLineClamp: expanded ? 'none' : 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {display}
              </p>
              {isLong && (
                <button
                  onClick={() => setExpanded(e => !e)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 3,
                    fontSize: 11,
                    fontWeight: 600,
                    color: '#1d9bf0',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    marginTop: 4,
                    padding: 0
                  }}
                >
                  {expanded ? <><ChevronUp size={12} /> أقل</> : <><ChevronDown size={12} /> المزيد</>}
                </button>
              )}
            </>
          ) : (
            <p style={{ fontSize: 12, color: 'var(--text-3)', fontStyle: 'italic', margin: 0, opacity: 0.6 }}>
              لا يوجد نص
            </p>
          )}
        </div>
      </div>

      {/* ========== القسم السفلي: المتريكات + الرابط ========== */}
      <div style={{ marginTop: 12 }}>
        <div style={{ display: 'flex', borderTop: '1px solid var(--border)', paddingTop: 12, gap: 4 }}>
          <Metric icon={Heart} value={likes} color="#f91880" label="إعجاب" />
          <Metric icon={Repeat2} value={retweets} color="#00ba7c" label="إعادة نشر" />
          <Metric icon={MessageCircle} value={replies} color="#1d9bf0" label="رد" />
          <Metric icon={Quote} value={quotes} color="#fbbf24" label="اقتباس" />
          <Metric icon={Bookmark} value={bookmarks} color="#a78bfa" label="حفظ" />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginTop: 8 }}>
          <div style={{ flex: 1, height: 3, borderRadius: 99, background: 'var(--border)', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: '100%',
              borderRadius: 99,
              background: 'linear-gradient(90deg, #1d9bf0, #e7e9ea)',
              opacity: (likes + retweets + replies + quotes + bookmarks) > 0 ? 1 : 0.2
            }} />
          </div>
          {tweet_url ? (
            <a
              href={tweet_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 10,
                fontWeight: 600,
                color: '#1d9bf0',
                textDecoration: 'none',
                flexShrink: 0,
                whiteSpace: 'nowrap'
              }}
            >
              <ExternalLink size={11} />
              <span>عرض التغريدة</span>
            </a>
          ) : (
            <span style={{ fontSize: 10, color: 'var(--text-3)', opacity: 0.4, flexShrink: 0 }}>
              لا يوجد رابط
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
