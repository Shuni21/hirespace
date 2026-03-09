import { useState } from "react";
import { C } from "../constants/colors";
import { usersApi } from "../constants/api";

// ── Input ──────────────────────────────────────────────────────────────────
const Input = ({ label, type = "text", placeholder, value, onChange, error, icon, rightEl }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 16 }}>
      {label && (
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 6 }}>
          {label}
        </label>
      )}
      <div style={{ position: "relative" }}>
        {icon && (
          <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", fontSize: 16, color: focused ? C.primary : C.muted, transition: "color .15s", pointerEvents: "none" }}>
            {icon}
          </span>
        )}
        <input
          type={type} placeholder={placeholder} value={value} onChange={onChange}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{
            width: "100%", boxSizing: "border-box",
            background: error ? C.redLight : C.surface,
            border: `1.5px solid ${error ? C.red : focused ? C.borderFocus : C.border}`,
            borderRadius: 10, padding: `11px 14px 11px ${icon ? "40px" : "14px"}`,
            paddingRight: rightEl ? 44 : 14,
            color: C.text, fontSize: 14, outline: "none",
            transition: "border-color .15s, box-shadow .15s",
            boxShadow: focused ? `0 0 0 3px ${C.primary}18` : "none",
          }}
        />
        {rightEl && (
          <span style={{ position: "absolute", right: 13, top: "50%", transform: "translateY(-50%)", cursor: "pointer", fontSize: 16, color: C.muted }}>
            {rightEl}
          </span>
        )}
      </div>
      {error && (
        <div style={{ color: C.red, fontSize: 12, marginTop: 5, display: "flex", alignItems: "center", gap: 4 }}>
          ⚠ {error}
        </div>
      )}
    </div>
  );
};

const LineDivider = ({ label }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
    <div style={{ flex: 1, height: 1, background: C.border }} />
    <span style={{ color: C.muted, fontSize: 13 }}>{label}</span>
    <div style={{ flex: 1, height: 1, background: C.border }} />
  </div>
);

const Spinner = () => (
  <div style={{ width: 16, height: 16, border: "2.5px solid #ffffff50", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.6s linear infinite" }} />
);

const SocialBtn = ({ icon, label }) => (
  <button
    style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: 10, padding: "10px 16px", fontSize: 14, fontWeight: 600, color: C.text, cursor: "pointer" }}
    onMouseOver={e => { e.currentTarget.style.borderColor = C.borderFocus; e.currentTarget.style.background = C.primaryLight; }}
    onMouseOut={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.surface; }}>
    <span style={{ fontSize: 18 }}>{icon}</span> {label}
  </button>
);

// ── LOGIN FORM ─────────────────────────────────────────────────────────────
const LoginForm = ({ onSwitch, onForgot, onSuccess }) => {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [errors,   setErrors]   = useState({});
  const [loading,  setLoading]  = useState(false);

  const validate = () => {
    const e = {};
    if (!email)                            e.email    = "Введите email";
    else if (!/\S+@\S+\.\S+/.test(email))  e.email    = "Некорректный email";
    if (!password)                         e.password = "Введите пароль";
    return e;
  };

  const submit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    try {
      const user = await usersApi.login({ email, password });
      if (user.error) { setErrors({ password: "Неверная почта или пароль" }); return; }
      onSuccess(user);
    } catch {
      setErrors({ password: "Ошибка подключения к серверу" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 style={{ fontSize: 24, fontWeight: 800, color: C.text, margin: "0 0 4px", letterSpacing: -0.5 }}>Добро пожаловать</h2>
      <p style={{ color: C.sub, fontSize: 14, margin: "0 0 28px" }}>Войдите в свой аккаунт HireSpace</p>

      <Input label="Email" type="email" placeholder="you@example.com" icon="✉"
        value={email} onChange={e => { setEmail(e.target.value); setErrors({}); }} error={errors.email} />
      <Input label="Пароль" type={showPw ? "text" : "password"} placeholder="Введите пароль" icon="🔒"
        value={password} onChange={e => { setPassword(e.target.value); setErrors({}); }} error={errors.password}
        rightEl={<span onClick={() => setShowPw(!showPw)} style={{ fontSize: 14 }}>{showPw ? "👁" : "👁‍🗨"}</span>} />

      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20, marginTop: -8 }}>
        <span onClick={onForgot} style={{ color: C.primary, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Забыли пароль?</span>
      </div>

      <button onClick={submit} disabled={loading}
        style={{ width: "100%", background: loading ? C.primaryBorder : C.primary, border: "none", borderRadius: 10, padding: "13px", color: "#fff", fontWeight: 700, fontSize: 15, cursor: loading ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        {loading ? <><Spinner /> Входим...</> : "Войти"}
      </button>

      <p style={{ textAlign: "center", color: C.sub, fontSize: 14, marginTop: 20 }}>
        Нет аккаунта?{" "}
        <span onClick={onSwitch} style={{ color: C.primary, fontWeight: 600, cursor: "pointer" }}>Зарегистрироваться</span>
      </p>
    </>
  );
};

// ── REGISTER FORM ──────────────────────────────────────────────────────────
const RegisterForm = ({ onSwitch, onSuccess }) => {
  const [role,     setRole]     = useState(null);
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [agree,    setAgree]    = useState(false);
  const [errors,   setErrors]   = useState({});
  const [loading,  setLoading]  = useState(false);

  const strength      = !password ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthLabel = ["", "Слабый", "Средний", "Надёжный"][strength];
  const strengthColor = ["", C.red, C.muted, C.green][strength];
  const strengthW     = ["0%", "33%", "66%", "100%"][strength];

  const validate = () => {
    const e = {};
    if (!role)                             e.role     = "Выберите роль";
    if (!name.trim())                      e.name     = "Введите имя";
    if (!email)                            e.email    = "Введите email";
    else if (!/\S+@\S+\.\S+/.test(email))  e.email    = "Некорректный email";
    if (!password)                         e.password = "Введите пароль";
    else if (password.length < 4)          e.password = "Минимум 6 символов";
    if (!agree)                            e.agree    = "Примите условия";
    return e;
  };

  const submit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    try {
      const ruRole = role === "seeker" ? "Соискатель" : "Работодатель";
      const user   = await usersApi.register({ email, password, role: ruRole });
      if (user.error) { setErrors({ email: user.error }); return; }
      onSuccess(user);
    } catch {
      setErrors({ email: "Ошибка подключения к серверу" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 style={{ fontSize: 24, fontWeight: 800, color: C.text, margin: "0 0 4px", letterSpacing: -0.5 }}>Создать аккаунт</h2>
      <p style={{ color: C.sub, fontSize: 14, margin: "0 0 24px" }}>Присоединяйтесь к HireSpace</p>

      {/* Role picker */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 8 }}>Я регистрируюсь как</label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { id: "seeker",   icon: "👤", label: "Соискатель",   sub: "Ищу работу"       },
            { id: "employer", icon: "🏢", label: "Работодатель", sub: "Ищу сотрудников"  },
          ].map(r => (
            <div key={r.id} onClick={() => { setRole(r.id); setErrors({}); }}
              style={{ border: `2px solid ${role === r.id ? C.primary : C.border}`, borderRadius: 12, padding: "14px 16px", cursor: "pointer", background: role === r.id ? C.primaryLight : C.surface, transition: "all .15s" }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>{r.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 14, color: role === r.id ? C.primary : C.text }}>{r.label}</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{r.sub}</div>
            </div>
          ))}
        </div>
        {errors.role && <div style={{ color: C.red, fontSize: 12, marginTop: 6 }}>⚠ {errors.role}</div>}
      </div>

      <Input label="Полное имя" placeholder="Иван Иванов" icon="👤"
        value={name} onChange={e => { setName(e.target.value); setErrors({}); }} error={errors.name} />
      <Input label="Email" type="email" placeholder="you@example.com" icon="✉"
        value={email} onChange={e => { setEmail(e.target.value); setErrors({}); }} error={errors.email} />

      <div style={{ marginBottom: 16 }}>
        <Input label="Пароль" type={showPw ? "text" : "password"} placeholder="Минимум 6 символов" icon="🔒"
          value={password} onChange={e => { setPassword(e.target.value); setErrors({}); }} error={errors.password}
          rightEl={<span onClick={() => setShowPw(!showPw)} style={{ fontSize: 14 }}>{showPw ? "👁" : "👁‍🗨"}</span>} />
      </div>


      <button onClick={submit} disabled={loading}
        style={{ width: "100%", background: loading ? C.primaryBorder : C.primary, border: "none", borderRadius: 10, padding: "13px", color: "#fff", fontWeight: 700, fontSize: 15, cursor: loading ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        {loading ? <><Spinner /> Создаём аккаунт...</> : "Зарегистрироваться"}
      </button>

      <p style={{ textAlign: "center", color: C.sub, fontSize: 14, marginTop: 20 }}>
        Уже есть аккаунт?{" "}
        <span onClick={onSwitch} style={{ color: C.primary, fontWeight: 600, cursor: "pointer" }}>Войти</span>
      </p>
    </>
  );
};

// ── FORGOT PASSWORD ────────────────────────────────────────────────────────
const ForgotForm = ({ onBack }) => {
  const [email,   setEmail]   = useState("");
  const [sent,    setSent]    = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = () => {
    if (!email) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 1000);
  };

  if (sent) return (
    <div style={{ textAlign: "center", padding: "12px 0" }}>
      <div style={{ width: 60, height: 60, borderRadius: "50%", background: C.greenLight, border: `2px solid ${C.greenBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, margin: "0 auto 20px" }}>✓</div>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: C.text, marginBottom: 8 }}>Письмо отправлено!</h2>
      <p style={{ color: C.sub, fontSize: 14, lineHeight: 1.6, marginBottom: 28 }}>
        Инструкция отправлена на <strong style={{ color: C.text }}>{email}</strong>
      </p>
      <button onClick={onBack} style={{ background: C.primary, border: "none", borderRadius: 10, padding: "12px 32px", color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
        Вернуться к входу
      </button>
    </div>
  );

  return (
    <>
      <button onClick={onBack} style={{ background: "none", border: "none", color: C.sub, fontSize: 13, cursor: "pointer", padding: 0, marginBottom: 20, display: "flex", alignItems: "center", gap: 4 }}>
        ← Назад
      </button>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: C.text, margin: "0 0 8px" }}>Восстановление пароля</h2>
      <p style={{ color: C.sub, fontSize: 14, margin: "0 0 24px", lineHeight: 1.6 }}>
        Введите email и мы пришлём ссылку для сброса пароля
      </p>
      <Input label="Email" type="email" placeholder="you@example.com" icon="✉"
        value={email} onChange={e => setEmail(e.target.value)} />
      <button onClick={submit} disabled={loading}
        style={{ width: "100%", background: loading ? C.primaryBorder : C.primary, border: "none", borderRadius: 10, padding: "13px", color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer", marginTop: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        {loading ? <><Spinner /> Отправляем...</> : "Отправить инструкцию"}
      </button>
    </>
  );
};

// ── SUCCESS ────────────────────────────────────────────────────────────────
const SuccessScreen = ({ mode, onContinue }) => (
  <div style={{ textAlign: "center", padding: "20px 0" }}>
    <div style={{ width: 64, height: 64, borderRadius: "50%", background: C.greenLight, border: `2px solid ${C.greenBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 20px" }}>✓</div>
    <h2 style={{ fontSize: 22, fontWeight: 800, color: C.text, marginBottom: 8 }}>
      {mode === "login" ? "Вход выполнен!" : "Аккаунт создан!"}
    </h2>
    <p style={{ color: C.sub, fontSize: 14, lineHeight: 1.6, marginBottom: 28 }}>
      {mode === "login" ? "Добро пожаловать обратно в HireSpace 👋" : "Добро пожаловать в HireSpace! Начнём поиск 🚀"}
    </p>
    <button onClick={onContinue}
      style={{ background: C.primary, border: "none", borderRadius: 10, padding: "12px 32px", color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
      Перейти к платформе →
    </button>
  </div>
);

// ── EXPORT ─────────────────────────────────────────────────────────────────
export default function AuthPage({ onLogin }) {
  const [mode,     setMode]     = useState("login");
  const [prevMode, setPrevMode] = useState("login");

  const switchTo  = (m)    => { setPrevMode(mode); setMode(m); };
  const onSuccess = (user) => { setPrevMode(mode); setMode("success"); if (onLogin) onLogin(user); };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Inter','Segoe UI',sans-serif", display: "flex", flexDirection: "column" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Топбар */}
      <div style={{ height: 60, background: C.surface, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: C.primary, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 15 }}>H</div>
          <span style={{ fontWeight: 700, fontSize: 16, color: C.text }}>HireSpace</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => switchTo("login")}
            style={{ background: mode === "login" ? C.primaryLight : "none", border: `1px solid ${mode === "login" ? C.primaryBorder : C.border}`, borderRadius: 8, padding: "7px 18px", color: mode === "login" ? C.primary : C.sub, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
            Войти
          </button>
          <button onClick={() => switchTo("register")}
            style={{ background: mode === "register" ? C.primary : C.surface, border: `1px solid ${mode === "register" ? C.primary : C.border}`, borderRadius: 8, padding: "7px 18px", color: mode === "register" ? "#fff" : C.sub, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
            Регистрация
          </button>
        </div>
      </div>

      {/* Тело */}
      <div style={{ flex: 1, display: "flex", alignItems: "stretch" }}>

        {/* Левая панель */}
        <div style={{ flex: 1, background: "linear-gradient(135deg, #1D4ED8 0%, #2563EB 50%, #3B82F6 100%)", padding: "48px", display: "flex", flexDirection: "column", justifyContent: "space-between", minWidth: 0 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#93C5FD", letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 32 }}>Платформа для найма</div>
            <h1 style={{ fontSize: 36, fontWeight: 800, color: "#fff", lineHeight: 1.2, marginBottom: 16, letterSpacing: -0.8 }}>
              Найди своё место — или нужного человека
            </h1>
            <p style={{ color: "#BFDBFE", fontSize: 15, lineHeight: 1.7, maxWidth: 380 }}>
              Тысячи вакансий, удобный отклик и прозрачный статус рассмотрения — всё в одном месте.
            </p>
          </div>
        </div>

        {/* Правая панель — форма */}
        <div style={{ width: 480, background: C.surface, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 48px", flexShrink: 0 }}>
          <div style={{ width: "100%", maxWidth: 380 }}>
            {mode === "login"    && <LoginForm    onSwitch={() => switchTo("register")} onForgot={() => switchTo("forgot")} onSuccess={onSuccess} />}
            {mode === "register" && <RegisterForm onSwitch={() => switchTo("login")}    onSuccess={onSuccess} />}
            {mode === "forgot"   && <ForgotForm   onBack={() => switchTo("login")} />}
            {mode === "success"  && <SuccessScreen mode={prevMode} onContinue={() => switchTo("login")} />}
          </div>
        </div>
      </div>
    </div>
  );
}
