import { useState } from 'react';
import { Heart, Share2, MessageCircle, Eye, Clock, ExternalLink, ChevronDown, ChevronUp, Play } from 'lucide-react';

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

export default function TikTokVideoCard({ video, rank }) {
  const [expanded, setExpanded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const {
    title,
    video_description,
    duration,
    create_date,
    create_time,
    cover_image_url,
    like_count = 0,
    share_count = 0,
    view_count = 0,
    comment_count = 0,
    share_url,
  } = video;

  const isLong = video_description?.length > 150;
  const display = isLong && !expanded 
    ? video_description?.slice(0, 150) + '…' 
    : video_description || '';

  const dateStr = create_date 
    ? new Date(create_date).toLocaleDateString('ar-EG', { 
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
      {/* TikTok gradient accent */}
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        right: 0, 
        left: 0, 
        height: 3, 
        background: 'linear-gradient(90deg, #25f4ee, #fe2c55)',
        borderRadius: '12px 12px 0 0' 
      }} />

      {/* ========== القسم العلوي: العنوان + التاريخ ========== */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginTop: 4 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ 
            fontSize: 13, 
            fontWeight: 700, 
            color: 'var(--text-1)', 
            lineHeight: 1.4,
            margin: 0,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {title || 'فيديو بدون عنوان'}
          </p>
          <p style={{ 
            fontSize: 10, 
            color: 'var(--text-3)', 
            marginTop: 4,
            marginBottom: 0
          }}>
            {dateStr}{create_time ? ` · ${create_time}` : ''}
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
            <span style={{ fontSize: 11, fontWeight: 800, color: '#fbbf24' }}>#{rank}</span>
          </div>
        )}
      </div>

      {/* ========== القسم الأوسط: الصورة + الوصف ========== */}
      <div style={{ flex: 1, minHeight: 0, marginTop: 10 }}>
        {/* Cover Image - بحجم ثابت */}
        {cover_image_url && !imageError && (
          <div style={{ 
            position: 'relative', 
            borderRadius: 8, 
            overflow: 'hidden',
            background: 'var(--bg-base)',
            aspectRatio: '16/9',
            maxHeight: 140,
            marginBottom: 10
          }}>
            <img 
              src={cover_image_url} 
              alt={title}
              onError={() => setImageError(true)}
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                borderRadius: 8
              }}
            />
            <div style={{
              position: 'absolute',
              bottom: 6,
              right: 6,
              background: 'rgba(0,0,0,.75)',
              padding: '2px 8px',
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              gap: 3,
              backdropFilter: 'blur(4px)'
            }}>
              <Clock size={10} style={{ color: '#fff' }} />
              <span style={{ fontSize: 10, color: '#fff', fontWeight: 600 }}>
                {duration || '0:00'}
              </span>
            </div>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'rgba(0,0,0,.5)',
              borderRadius: '50%',
              padding: 8,
              backdropFilter: 'blur(4px)'
            }}>
              <Play size={18} style={{ color: '#fff' }} />
            </div>
          </div>
        )}

        {/* الوصف - ثابت حتى لو فاضي */}
        <div style={{ minHeight: 50 }}>
          {video_description ? (
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
                    color: '#25f4ee',
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
              لا يوجد وصف
            </p>
          )}
        </div>
      </div>

      {/* ========== القسم السفلي: المتريكات + الرابط ========== */}
      <div style={{ marginTop: 12 }}>
        {/* Metrics - ثابتة دائماً */}
        <div style={{ 
          display: 'flex', 
          borderTop: '1px solid var(--border)', 
          paddingTop: 12,
          gap: 4
        }}>
          <Metric icon={Eye} value={view_count} color="#25f4ee" label="مشاهدة" />
          <Metric icon={Heart} value={like_count} color="#fe2c55" label="إعجاب" />
          <Metric icon={Share2} value={share_count} color="#34d399" label="مشاركة" />
          <Metric icon={MessageCircle} value={comment_count} color="#fbbf24" label="تعليق" />
        </div>

        {/* Engagement bar + Link */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginTop: 8 }}>
          <div style={{ flex: 1, height: 3, borderRadius: 99, background: 'var(--border)', overflow: 'hidden' }}>
            <div style={{ 
              height: '100%', 
              width: '100%', 
              borderRadius: 99, 
              background: 'linear-gradient(90deg, #25f4ee, #fe2c55)',
              opacity: (view_count + like_count + share_count + comment_count) > 0 ? 1 : 0.2
            }} />
          </div>
          {share_url ? (
            <a 
              href={share_url} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 4, 
                fontSize: 10, 
                fontWeight: 600, 
                color: '#25f4ee',
                textDecoration: 'none', 
                flexShrink: 0,
                whiteSpace: 'nowrap'
              }}
            >
              <ExternalLink size={11}/>
              <span>عرض الفيديو</span>
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