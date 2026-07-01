import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, RefreshCw, Sun, Moon, Menu } from 'lucide-react';
import { setFilter, loadArticles, selectStatus } from '../../store/slices/newsSlice';
import { useTheme } from '../../context/ThemeContext';

const DAYS_AR = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

function Clock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const day = DAYS_AR[now.getDay()];
  const time = now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const date = now.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
  return (
    <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs text-[var(--text-2)] flex-wrap sm:flex-nowrap justify-center">
      <span style={{ color: 'var(--gold)', fontWeight: 700 }}>{day}</span>
      <span className="hidden sm:inline" style={{ color: 'var(--text-3)' }}>·</span>
      <span className="hidden sm:inline">
        {date}
      </span>
      <span style={{ color: 'var(--text-3)' }}>·</span>
      <span style={{ fontWeight: 700, color: 'var(--text-1)', fontVariantNumeric: 'tabular-nums' }}>
        {time} م
      </span>
    </div>
  );
}

export default function Header({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const dispatch = useDispatch();
  const status = useSelector(selectStatus);
  const { theme, toggle } = useTheme();
  const loading = status === 'loading';

  const toggleSidebar = () => {
    // على الموبايل نفتح الـ Overlay
    if (window.innerWidth <= 768) {
      setMobileOpen(!mobileOpen);
    } else {
      // على الديسكتوب نطوي/نفتح
      setCollapsed(!collapsed);
    }
  };

  return (
    <header className="flex items-center gap-1.5 sm:gap-2.5 md:gap-4 px-3 sm:px-4 md:px-6 flex-shrink-0 bg-[var(--bg-surface)] border-b border-[var(--border)] transition-all duration-250 sticky top-0 z-50 h-14 sm:h-16 w-full">
      {/* Menu Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg border border-[var(--border)] bg-transparent text-[var(--text-2)] cursor-pointer transition-colors duration-200 hover:bg-[var(--hover-bg)] flex-shrink-0"
      >
        <Menu size={18} />
      </button>

      {/* Search */}
      <div className="relative flex-1 max-w-[120px] sm:max-w-[200px] md:max-w-[320px]">
        <Search
          size={13}
          style={{
            position: 'absolute',
            right: 10,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-3)',
            pointerEvents: 'none',
          }}
        />
        <input
          type="text"
          placeholder="بحث..."
          className="w-full rounded-lg pr-8 pl-3 py-1 sm:py-1.5 text-[11px] sm:text-xs border border-[var(--border)] bg-[var(--bg-input)] text-[var(--text-1)] outline-none transition-all duration-200 font-sans"
          onChange={(e) => dispatch(setFilter({ key: 'search', value: e.target.value }))}
        />
      </div>

      {/* Clock */}
      <div className="flex-1 hidden min-[480px]:flex justify-center">
        <Clock />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
        <button
          onClick={() => dispatch(loadArticles())}
          disabled={loading}
          className="flex items-center gap-1.5 px-2 py-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border border-[var(--border)] bg-transparent text-[var(--text-2)] text-[10px] sm:text-xs font-semibold transition-all duration-200"
          style={{
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
          }}
        >
          <RefreshCw
            size={13}
            style={{
              color: loading ? 'var(--gold)' : 'inherit',
              animation: loading ? 'spin 1s linear infinite' : 'none',
            }}
          />
          <span className="hidden min-[480px]:inline">
            {loading ? 'تحديث...' : 'تحديث'}
          </span>
        </button>

        <button
          onClick={toggle}
          title={theme === 'dark' ? 'تفعيل النهاري' : 'تفعيل الليلي'}
          className="flex items-center gap-1.5 px-2 py-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border border-[var(--border)] bg-transparent text-[var(--text-2)] text-[10px] sm:text-xs font-semibold transition-all duration-200 cursor-pointer"
        >
          {theme === 'dark' ? (
            <>
              <Sun size={14} style={{ color: 'var(--gold)' }} />
              <span className="hidden min-[480px]:inline">نهاري</span>
            </>
          ) : (
            <>
              <Moon size={14} style={{ color: 'var(--accent)' }} />
              <span className="hidden min-[480px]:inline">ليلي</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
}