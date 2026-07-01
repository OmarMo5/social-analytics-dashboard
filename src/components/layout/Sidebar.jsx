import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Newspaper, Instagram, Youtube, Map, Facebook, 
  ChevronLeft, ChevronRight, Music, // <--- أضف Music هنا
} from 'lucide-react';
import CONFIG from '../../config/config';

const links = [
  { to: '/',           icon: LayoutDashboard, label: 'لوحة المؤشرات الرئيسية' },
  { to: '/news',       icon: Newspaper,       label: 'آخر الأخبار والتغطيات' },
  { to: '/instagram',  icon: Instagram,       label: 'تحليلات إنستجرام' },
  { to: '/youtube',    icon: Youtube,         label: 'تحليلات يوتيوب' },
  { to: '/maps',       icon: Map,             label: 'تقييمات Google Maps' },
  { to: '/facebook',   icon: Facebook,        label: 'تحليلات فيسبوك' },
  { to: '/tiktok',     icon: Music,           label: 'تحليلات تيكتوك' }, // <--- Music بدل Facebook
];

export default function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen, isMobile }) {
  const location = useLocation();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const closeMobile = () => {
    setMobileOpen(false);
  };

  // تحديد المظهر والقياسات برمجياً بناءً على وضع التصفح (موبايل أم ديسكتوب)
  const getSidebarStyle = () => {
    if (isMobile) {
      return {
        width: 280,
        right: mobileOpen ? 0 : -280,
        boxShadow: mobileOpen ? '0 0 40px rgba(0,0,0,.3)' : 'none',
      };
    } else {
      return {
        width: collapsed ? 72 : 248,
        right: 0,
        boxShadow: 'none',
      };
    }
  };

  const sidebarStyle = getSidebarStyle();

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          onClick={closeMobile}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,.5)',
            zIndex: 999,
            backdropFilter: 'blur(4px)',
          }}
        />
      )}

      <aside 
        className="sidebar"
        style={{
          position: 'fixed',
          top: 0,
          height: '100vh',
          background: 'var(--bg-surface)',
          borderLeft: '1px solid var(--border)',
          transition: 'width 0.3s ease, right 0.3s ease, box-shadow 0.3s ease',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          ...sidebarStyle,
        }}
      >
        {/* Header - Brand + Toggle */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'space-between',
            padding: collapsed ? '16px 0' : '16px 20px',
            borderBottom: '1px solid var(--border)',
            minHeight: 72,
            flexShrink: 0,
            gap: 8,
          }}
        >
          {!collapsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: 'linear-gradient(135deg, var(--gold-dk), var(--gold))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <span style={{ fontSize: 14, fontWeight: 900, color: '#fff' }}>م</span>
              </div>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--gold)', lineHeight: 1.2, margin: 0 }}>
                  {CONFIG.DASHBOARD_TITLE}
                </p>
                <p style={{ fontSize: 9, color: 'var(--text-3)', margin: 0, lineHeight: 1.3 }}>
                  {CONFIG.DASHBOARD_SUBTITLE}
                </p>
              </div>
            </div>
          )}

          <button
            onClick={toggleSidebar}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 32,
              height: 32,
              borderRadius: 8,
              border: '1px solid var(--border)',
              background: 'transparent',
              color: 'var(--text-2)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--hover-bg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            {collapsed ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>

        {/* Live Status */}
        {!collapsed && (
          <div
            style={{
              margin: '10px 14px',
              padding: '6px 12px',
              borderRadius: 8,
              background: 'var(--pos-bg)',
              border: '1px solid var(--pos-border)',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              flexShrink: 0,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#22c55e',
                display: 'inline-block',
              }}
            />
            <span style={{ fontSize: 10, color: 'var(--text-2)' }}>بث مباشر</span>
          </div>
        )}

        {/* Navigation */}
        <nav
          style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            padding: collapsed ? '8px 4px' : '8px 10px',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {links.map(({ to, icon: Icon, label }) => {
            const isActive = location.pathname === to;
            return (
              <NavLink
                key={to}
                to={to}
                onClick={() => {
                  if (window.innerWidth <= 768) {
                    closeMobile();
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  gap: collapsed ? 0 : 12,
                  padding: collapsed ? '10px' : '10px 14px',
                  borderRadius: 8,
                  textDecoration: 'none',
                  color: isActive ? 'var(--gold)' : 'var(--text-2)',
                  background: isActive ? 'color-mix(in srgb, var(--gold) 10%, transparent)' : 'transparent',
                  transition: 'all 0.2s',
                  minHeight: 40,
                  position: 'relative',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'var(--hover-bg)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <Icon size={18} style={{ flexShrink: 0 }} />
                {!collapsed && (
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? 'var(--text-1)' : 'var(--text-2)',
                    }}
                  >
                    {label}
                  </span>
                )}
                {isActive && !collapsed && (
                  <div
                    style={{
                      position: 'absolute',
                      right: -8,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: 3,
                      height: 20,
                      borderRadius: 99,
                      background: 'var(--gold)',
                    }}
                  />
                )}
                {isActive && collapsed && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: 3,
                      height: 20,
                      borderRadius: 99,
                      background: 'var(--gold)',
                    }}
                  />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        {!collapsed && (
          <div
            style={{
              padding: '12px 20px',
              borderTop: '1px solid var(--border)',
              textAlign: 'center',
              flexShrink: 0,
            }}
          >
            <p style={{ fontSize: 9, color: 'var(--text-3)', margin: 0 }}>v1.0 · منصة الرصد الإعلامي</p>
          </div>
        )}
      </aside>
    </>
  );
}