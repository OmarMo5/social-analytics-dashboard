import { useState, useRef, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Mail, Lock, Unlock, LogIn, ShieldCheck, BarChart3, Radio, ShieldAlert, Ban, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import CONFIG from '../config/config';

const POLL_INTERVAL_MS = 6000;

export default function LoginPage() {
  const { isAuthenticated, requestAccess, pollStatus } = useAuth();

  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [shake, setShake] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [phase, setPhase] = useState('form'); // form | pending | rejected | blocked
  const emailRef = useRef(null);
  const pollRef = useRef(null);
  const emailSentRef = useRef('');

  useEffect(() => {
    if (unlocked) emailRef.current?.focus();
  }, [unlocked]);

  useEffect(() => () => stopPolling(), []);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
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

  function stopPolling() {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }

  function applyResult(result) {
    if (result.status === 'pending') {
      setPhase('pending');
      startPolling();
    } else if (result.status === 'rejected') {
      stopPolling();
      setPhase('rejected');
    } else if (result.status === 'blocked') {
      stopPolling();
      setPhase('blocked');
    }
    // 'approved' needs no local handling — AuthContext stores the token/user,
    // isAuthenticated flips to true, and the check above redirects automatically.
  }

  function startPolling() {
    if (pollRef.current) return;
    pollRef.current = setInterval(async () => {
      try {
        const result = await pollStatus(emailSentRef.current);
        if (result.status !== 'pending') {
          stopPolling();
          applyResult(result);
        }
      } catch {
        // transient network hiccup — keep polling
      }
    }, POLL_INTERVAL_MS);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmed = email.trim();
    if (!trimmed) {
      setErrors({ email: 'أدخل البريد الإلكتروني' });
      triggerShake();
      return;
    }

    setErrors({});
    setSubmitting(true);
    emailSentRef.current = trimmed;

    try {
      const result = await requestAccess(trimmed);
      applyResult(result);
    } catch (err) {
      setErrors({ email: 'تعذر الاتصال بالخادم، حاول مرة أخرى' });
      triggerShake();
    } finally {
      setSubmitting(false);
    }
  };

  const backToForm = () => {
    stopPolling();
    setPhase('form');
    setErrors({});
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
          ) : phase === 'pending' ? (
            <div className="fade-up" style={{ textAlign: 'center' }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%', margin: '0 auto 20px', position: 'relative',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '3px solid var(--border)' }} />
                <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '3px solid transparent', borderTopColor: 'var(--gold)', animation: 'loginSpin 1s linear infinite' }} />
                <Mail size={22} style={{ color: 'var(--gold)' }} />
              </div>
              <p style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-1)', margin: 0 }}>
                بانتظار موافقة الإدارة
              </p>
              <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 8, lineHeight: 1.7 }}>
                تم إرسال طلبك بنجاح، جارٍ التحقق من حالة الموافقة تلقائيًا...
              </p>
              <p dir="ltr" style={{ fontSize: 11.5, color: 'var(--text-2)', marginTop: 10, fontWeight: 700, textAlign: 'center' }}>
                {emailSentRef.current}
              </p>
              <button
                type="button"
                onClick={backToForm}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 22,
                  fontSize: 11.5, fontWeight: 700, color: 'var(--text-3)',
                  background: 'none', border: 'none', cursor: 'pointer',
                }}
              >
                <ArrowRight size={13} />
                استخدام بريد إلكتروني آخر
              </button>
            </div>
          ) : phase === 'rejected' || phase === 'blocked' ? (
            <div className="fade-up" style={{ textAlign: 'center' }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%', margin: '0 auto 20px',
                background: 'var(--neg-bg)', border: '1px solid var(--neg-border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {phase === 'blocked' ? <Ban size={26} style={{ color: 'var(--neg)' }} /> : <ShieldAlert size={26} style={{ color: 'var(--neg)' }} />}
              </div>
              <p style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-1)', margin: 0 }}>
                {phase === 'blocked' ? 'تم حظر حسابك' : 'تم رفض طلبك'}
              </p>
              <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 8, lineHeight: 1.7 }}>
                {phase === 'blocked'
                  ? 'تم حظر هذا الحساب من الوصول إلى لوحة التحكم.'
                  : 'برجاء التواصل مع الإدارة لمزيد من المعلومات.'}
              </p>
              <button
                type="button"
                onClick={backToForm}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 22,
                  fontSize: 11.5, fontWeight: 700, color: 'var(--text-3)',
                  background: 'none', border: 'none', cursor: 'pointer',
                }}
              >
                <ArrowRight size={13} />
                استخدام بريد إلكتروني آخر
              </button>
            </div>
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
                <p style={{ fontSize: 11.5, color: 'var(--text-3)', marginTop: 4 }}>أدخل بريدك الإلكتروني للوصول إلى لوحة التحكم</p>
              </div>

              {/* Email */}
              <div style={{ marginBottom: 6 }}>
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
                    onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors({}); }}
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

              <button
                type="submit"
                disabled={submitting}
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
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  opacity: submitting ? 0.7 : 1,
                }}
              >
                <LogIn size={14} />
                <span>{submitting ? 'جارِ الإرسال...' : 'متابعة'}</span>
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
        @keyframes loginSpin {
          to { transform: rotate(360deg); }
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
