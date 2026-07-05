import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Mail, Lock, Unlock, Eye, EyeOff, LogIn, ShieldCheck, BarChart3, Radio } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import CONFIG from '../config/config';

export default function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [shake, setShake] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const emailRef = useRef(null);

  useEffect(() => {
    if (unlocked) emailRef.current?.focus();
  }, [unlocked]);

  if (isAuthenticated) {
    const from = location.state?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleUnlock = () => {
    if (unlocking || unlocked) return;
    setUnlocking(true);
    setTimeout(() => {
      setUnlocked(true);
      setUnlocking(false);
    }, 550);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!email.trim()) newErrors.email = 'أدخل البريد الإلكتروني';
    if (!password) newErrors.password = 'أدخل كلمة المرور';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      triggerShake();
      return;
    }

    const result = login(email, password);
    if (!result.success) {
      setErrors({ [result.field]: result.message });
      triggerShake();
      return;
    }

    setErrors({});
    const from = location.state?.from?.pathname || '/';
    navigate(from, { replace: true });
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-base)',
        direction: 'rtl',
        position: 'relative',
        overflow: 'hidden',
        padding: 20,
      }}
    >
      {/* Ambient background glows */}
      <div style={{ position: 'absolute', top: '-10%', right: '-6%', width: 380, height: 380, borderRadius: '50%', background: 'color-mix(in srgb, var(--gold) 7%, transparent)', filter: 'blur(40px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-12%', left: '-6%', width: 380, height: 380, borderRadius: '50%', background: 'color-mix(in srgb, var(--accent) 6%, transparent)', filter: 'blur(40px)', pointerEvents: 'none' }} />

      {/* Unified card */}
      <div
        className="login-shell fade-up"
        style={{
          width: '100%',
          maxWidth: 900,
          display: 'flex',
          borderRadius: 22,
          overflow: 'hidden',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-hover)',
          position: 'relative',
          zIndex: 1,
          animation: shake ? 'shake .5s' : undefined,
        }}
      >
        {/* Branding side */}
        <div
          className="login-branding"
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '46px 40px',
            position: 'relative',
            overflow: 'hidden',
            background: 'linear-gradient(150deg, color-mix(in srgb, var(--gold) 6%, transparent), transparent 60%)',
          }}
        >
          <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: 'color-mix(in srgb, var(--gold) 10%, transparent)', filter: 'blur(10px)', pointerEvents: 'none' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22, position: 'relative' }}>
            <div style={{
              width: 46, height: 46, borderRadius: 14,
              background: 'linear-gradient(135deg, var(--gold-dk), var(--gold))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 22px rgba(251,191,36,.3)', flexShrink: 0,
            }}>
              <span style={{ fontSize: 19, fontWeight: 900, color: '#fff' }}>م</span>
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 800, color: 'var(--gold)', margin: 0 }}>{CONFIG.DASHBOARD_TITLE}</p>
              <p style={{ fontSize: 11, color: 'var(--text-3)', margin: 0, marginTop: 2 }}>{CONFIG.DASHBOARD_SUBTITLE}</p>
            </div>
          </div>

          <h1 style={{ fontSize: 24, fontWeight: 900, lineHeight: 1.35, color: 'var(--text-1)', margin: 0, position: 'relative' }}>
            نظرة تنفيذية شاملة على{' '}
            <span style={{ background: 'linear-gradient(120deg, var(--gold) 0%, var(--gold-dk) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              حضورك الرقمي والإعلامي
            </span>
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 12, lineHeight: 1.8, position: 'relative' }}>
            تابع كل منصاتك، أخبارك، وإحصائياتك في مكان واحد آمن ومباشر.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 26, position: 'relative' }}>
            {[
              { icon: BarChart3, text: 'إحصائيات لحظية لكل المنصات' },
              { icon: ShieldCheck, text: 'وصول محصور على فريق العمل' },
              { icon: Radio, text: 'تحديث تلقائي مباشر للبيانات' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                  background: 'color-mix(in srgb, var(--gold) 12%, transparent)',
                  border: '1px solid color-mix(in srgb, var(--gold) 25%, transparent)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={13} style={{ color: 'var(--gold)' }} />
                </div>
                <span style={{ fontSize: 12.5, color: 'var(--text-2)', fontWeight: 500 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form side */}
        <div
          className="login-form-panel"
          style={{
            flex: '0 0 380px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: unlocked ? 'stretch' : 'center',
            justifyContent: 'center',
            padding: '46px 38px',
            borderRight: '1px solid var(--border)',
            background: 'var(--bg-card)',
            minHeight: 460,
          }}
        >
          {!unlocked ? (
            <button
              type="button"
              onClick={handleUnlock}
              className="lock-gate"
              style={{ background: 'none', border: 'none', cursor: unlocking ? 'default' : 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, padding: 0 }}
            >
              <div style={{ position: 'relative', width: 96, height: 96, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="lock-pulse-ring" />
                <span className="lock-pulse-ring" style={{ animationDelay: '.7s' }} />
                <div
                  className="lock-core"
                  style={{
                    width: 74, height: 74, borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--gold-dk), var(--gold))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 10px 28px rgba(251,191,36,.35)',
                    transform: unlocking ? 'rotate(-16deg) scale(1.1)' : 'none',
                    transition: 'transform .5s cubic-bezier(.34,1.56,.64,1)',
                  }}
                >
                  {unlocking ? <Unlock size={30} style={{ color: '#fff' }} /> : <Lock size={30} style={{ color: '#fff' }} />}
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-1)', margin: 0 }}>
                  {unlocking ? 'جارِ الفتح...' : 'اضغط لتسجيل الدخول'}
                </p>
                <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 5 }}>
                  الوصول مخصص لفريق العمل المصرّح له فقط
                </p>
              </div>
            </button>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="fade-up">
              <div style={{ marginBottom: 24 }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 12, marginBottom: 12,
                  background: 'linear-gradient(135deg, var(--gold-dk), var(--gold))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 8px 20px rgba(251,191,36,.3)',
                }}>
                  <LogIn size={19} style={{ color: '#fff' }} />
                </div>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-1)', margin: 0 }}>تسجيل الدخول</h2>
                <p style={{ fontSize: 11.5, color: 'var(--text-3)', marginTop: 4 }}>أدخل بياناتك للوصول إلى لوحة التحكم</p>
              </div>

              {/* Email */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-2)', marginBottom: 6, display: 'block' }}>
                  البريد الإلكتروني
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={15} style={{ position: 'absolute', top: '50%', right: 12, transform: 'translateY(-50%)', color: errors.email ? 'var(--neg)' : 'var(--text-3)' }} />
                  <input
                    ref={emailRef}
                    type="text"
                    dir="ltr"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors(er => ({ ...er, email: undefined })); }}
                    placeholder="name@email.com"
                    style={{
                      width: '100%',
                      padding: '10px 38px 10px 12px',
                      borderRadius: 10,
                      fontSize: 12.5,
                      border: `1px solid ${errors.email ? 'var(--neg)' : 'var(--border-md)'}`,
                      background: 'var(--bg-input)',
                      color: 'var(--text-1)',
                      textAlign: 'right',
                    }}
                  />
                </div>
                {errors.email && (
                  <p style={{ fontSize: 10.5, color: 'var(--neg)', marginTop: 5, fontWeight: 600 }}>⚠ {errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div style={{ marginBottom: 6 }}>
                <label style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-2)', marginBottom: 6, display: 'block' }}>
                  كلمة المرور
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={15} style={{ position: 'absolute', top: '50%', right: 12, transform: 'translateY(-50%)', color: errors.password ? 'var(--neg)' : 'var(--text-3)' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    dir="ltr"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors(er => ({ ...er, password: undefined })); }}
                    placeholder="••••••••"
                    style={{
                      width: '100%',
                      padding: '10px 38px 10px 38px',
                      borderRadius: 10,
                      fontSize: 12.5,
                      border: `1px solid ${errors.password ? 'var(--neg)' : 'var(--border-md)'}`,
                      background: 'var(--bg-input)',
                      color: 'var(--text-1)',
                      textAlign: 'right',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(s => !s)}
                    style={{
                      position: 'absolute', top: '50%', left: 10, transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)',
                      display: 'flex', alignItems: 'center', padding: 4,
                    }}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.password && (
                  <p style={{ fontSize: 10.5, color: 'var(--neg)', marginTop: 5, fontWeight: 600 }}>⚠ {errors.password}</p>
                )}
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 7,
                  padding: '11px 16px',
                  fontSize: 12.5,
                  marginTop: 16,
                  borderRadius: 10,
                  border: '1px solid transparent',
                  background: 'linear-gradient(135deg, var(--gold-dk), var(--gold))',
                  color: '#1a1200',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                <LogIn size={14} />
                <span>دخول</span>
              </button>

              <p style={{ fontSize: 10, color: 'var(--text-3)', textAlign: 'center', marginTop: 16 }}>
                هذه اللوحة مخصصة لفريق العمل المصرّح له فقط
              </p>
            </form>
          )}
        </div>
      </div>

      <style>{`
        @keyframes shake {
          10%, 90% { transform: translateX(-1px); }
          20%, 80% { transform: translateX(2px); }
          30%, 50%, 70% { transform: translateX(-5px); }
          40%, 60% { transform: translateX(5px); }
        }
        @keyframes lockPulse {
          0%   { transform: scale(.85); opacity: .55; }
          70%  { transform: scale(1.4); opacity: 0; }
          100% { opacity: 0; }
        }
        .lock-pulse-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 2px solid var(--gold);
          animation: lockPulse 2.4s ease-out infinite;
          pointer-events: none;
        }
        .lock-gate:hover .lock-core {
          transform: scale(1.06);
        }
        @media (max-width: 820px) {
          .login-shell { flex-direction: column !important; max-width: 420px !important; }
          .login-branding { display: none !important; }
          .login-form-panel { flex: 1 !important; border-right: none !important; padding: 36px 28px !important; }
        }
      `}</style>
    </div>
  );
}
