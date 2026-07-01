import { useState } from 'react';
import { Heart, MessageCircle, Share2, ExternalLink, ChevronDown, ChevronUp, Trophy } from 'lucide-react';

function fmt(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000)    return (n / 1000).toFixed(1) + 'K';
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

export default function FBPostCard({ post, rank }) {
  const [expanded, setExpanded] = useState(false);
  const { message, date, time, link, shares = 0, reactions = 0, comments = 0 } = post;

  const isLong   = message?.length > 150;
  const display  = isLong && !expanded ? message?.slice(0, 150) + '…' : message || '';

  const dateStr = date
    ? new Date(date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })
    : '';

  return (
    <div 
      className="card fade-up" 
      style={{ 
        display: 'flex', 
        flexDirection: 'column',
        height: '100%',
        minHeight: 260,
        padding: '18px 20px', 
        position: 'relative', 
        overflow: 'hidden',
        justifyContent: 'space-between'
      }}
    >
      {/* top accent line */}
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        right: 0, 
        left: 0, 
        height: 3, 
        background: 'linear-gradient(90deg, #1877f2, #42a5f5)', 
        borderRadius: '12px 12px 0 0' 
      }} />

      {/* ========== القسم العلوي: العنوان/المصدر + التاريخ ========== */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginTop: 4 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ 
              width: 28, 
              height: 28, 
              borderRadius: 8, 
              background: '#1877f2', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              flexShrink: 0,
              boxShadow: '0 4px 10px rgba(24,119,242,.3)'
            }}>
              <svg width={14} height={14} viewBox="0 0 24 24" fill="white">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </div>
            <p style={{ 
              fontSize: 13, 
              fontWeight: 700, 
              color: 'var(--text-1)', 
              lineHeight: 1.3,
              margin: 0,
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              متحف السيرة النبوية
            </p>
          </div>
          <p style={{ 
            fontSize: 10, 
            color: 'var(--text-3)', 
            marginTop: 4,
            marginBottom: 0,
            marginRight: 36
          }}>
            {dateStr}{time ? ` · ${time}` : ''}
          </p>
        </div>

        {rank !== undefined && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 4, 
            background: 'color-mix(in srgb, #fbbf24 12%, transparent)',
            border: '1px solid color-mix(in srgb, #fbbf24 30%, transparent)',
            borderRadius: 20, 
            padding: '2px 10px', 
            flexShrink: 0,
            height: 24
          }}>
            <Trophy size={11} style={{ color: '#fbbf24' }} />
            <span style={{ fontSize: 11, fontWeight: 800, color: '#fbbf24' }}>#{rank}</span>
          </div>
        )}
      </div>

      {/* ========== القسم الأوسط: المحتوى/الوصف ========== */}
      <div style={{ flex: 1, minHeight: 0, marginTop: 10 }}>
        <div style={{ minHeight: 50 }}>
          {message ? (
            <>
              <p style={{ 
                fontSize: 12, 
                color: 'var(--text-2)', 
                lineHeight: 1.6, 
                margin: 0, 
                direction: 'rtl', 
                whiteSpace: 'pre-line',
                display: '-webkit-box',
                WebkitLineClamp: expanded ? 'none' : 2,
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
                    color: '#1877f2',
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer', 
                    marginTop: 4, 
                    padding: 0 
                  }}
                >
                  {expanded ? <><ChevronUp size={12}/> أقل</> : <><ChevronDown size={12}/> المزيد</>}
                </button>
              )}
            </>
          ) : (
            <p style={{ 
              fontSize: 12, 
              color: 'var(--text-3)', 
              fontStyle: 'italic',
              margin: 0,
              opacity: 0.6
            }}>
              لا يوجد محتوى
            </p>
          )}
        </div>
      </div>

      {/* ========== القسم السفلي: المتريكات + الرابط ========== */}
      <div style={{ marginTop: 12 }}>
        <div style={{ 
          display: 'flex', 
          borderTop: '1px solid var(--border)', 
          paddingTop: 12,
          gap: 4
        }}>
          <Metric icon={Heart}         value={reactions} color="#1877f2" label="تفاعل" />
          <Metric icon={Share2}        value={shares}    color="#34d399" label="مشاركة" />
          <Metric icon={MessageCircle} value={comments}  color="#fbbf24" label="تعليق" />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginTop: 8 }}>
          <div style={{ flex: 1, height: 3, borderRadius: 99, background: 'var(--border)', overflow: 'hidden' }}>
            <div style={{ 
              height: '100%', 
              width: '100%', 
              borderRadius: 99, 
              background: 'linear-gradient(90deg, #1877f2, #42a5f5)',
              opacity: (reactions + shares + comments) > 0 ? 1 : 0.2
            }} />
          </div>
          {link ? (
            <a 
              href={link} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 4, 
                fontSize: 10, 
                fontWeight: 600, 
                color: '#1877f2',
                textDecoration: 'none', 
                flexShrink: 0,
                whiteSpace: 'nowrap'
              }}
            >
              <ExternalLink size={11}/>
              <span>عرض المنشور</span>
            </a>
          ) : (
            <span style={{ 
              fontSize: 10, 
              color: 'var(--text-3)', 
              opacity: 0.4,
              flexShrink: 0
            }}>
              لا يوجد رابط
            </span>
          )}
        </div>
      </div>
    </div>
  );
}