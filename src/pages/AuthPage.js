import { useState } from "react";
import { C } from "../constants/colors";
import { usersApi } from "../constants/api";

const inp = {
  width: "100%", boxSizing: "border-box", border: `1px solid ${C.border}`,
  borderRadius: 8, padding: "12px 14px", fontSize: 14, color: C.text,
  background: "#fff", outline: "none", fontFamily: "inherit",
};

const Inp = ({ label, error, ...props }) => (
  <div style={{ marginBottom: 16 }}>
    {label && <div style={{ fontSize: 14, color: C.text, marginBottom: 6 }}>{label}</div>}
    <input style={{ ...inp, borderColor: error ? C.red : C.border }} {...props} />
    {error && <div style={{ color: C.red, fontSize: 12, marginTop: 4 }}>{error}</div>}
  </div>
);

// ── Форма входа ───────────────────────────────────────────
const LoginForm = ({ onSwitch, onSuccess }) => {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [errors,   setErrors]   = useState({});
  const [loading,  setLoading]  = useState(false);

  const submit = async () => {
    const e = {};
    if (!email)    e.email    = "Введите email";
    if (!password) e.password = "Введите пароль";
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    try {
      const user = await usersApi.login({ email, password });
        if (user.error) { setErrors({ email: " ", password: "Неверная почта или пароль" }); return; }
      onSuccess(user);
    } catch {
      setErrors({ password: "Ошибка подключения к серверу" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: 28, fontWeight: 700, color: C.text, marginBottom: 24 }}>Добро пожаловать</h2>
      <Inp label="Email"  type="email"    placeholder="you@yandex.ru"  value={email}    onChange={e => { setEmail(e.target.value);    setErrors({}); }} error={errors.email} />
      <Inp label="Пароль" type="password" placeholder="Введите пароль" value={password} onChange={e => { setPassword(e.target.value); setErrors({}); }} error={errors.password} />
      <div style={{ textAlign: "right", marginTop: -8, marginBottom: 20 }}>
        <span style={{ fontSize: 14, color: C.primary, cursor: "pointer" }}>Забыли пароль?</span>
      </div>
      <button onClick={submit} disabled={loading}
        style={{ width: "100%", background: C.primary, border: "none", borderRadius: 8, padding: "13px", color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: "inherit" }}>
        {loading ? "Входим..." : "Войти"}
      </button>
      <p style={{ textAlign: "center", fontSize: 14, color: C.sub, marginTop: 20 }}>
        Нет аккаунта?{" "}
        <span onClick={onSwitch} style={{ color: C.primary, fontWeight: 600, cursor: "pointer" }}>Зарегистрироваться</span>
      </p>
    </div>
  );
};

// ── Форма регистрации ─────────────────────────────────────
const RegisterForm = ({ onSwitch, onSuccess }) => {
  const [role,     setRole]     = useState(null);
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [errors,   setErrors]   = useState({});
  const [loading,  setLoading]  = useState(false);

  const submit = async () => {
    const e = {};
    if (!role)     e.role     = "Выберите роль";
    if (!name)     e.name     = "Введите имя";
    if (!email)    e.email    = "Введите email";
    if (!password || password.length < 6) e.password = "Минимум 6 символов";
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    try {
      const ruRole = role === "seeker" ? "Соискатель" : "Работодатель";
      const user = await usersApi.register({ email, password, role: ruRole });
      if (user.error) { setErrors({ email: user.error }); return; }
      onSuccess(user);
    } catch {
      setErrors({ email: "Ошибка подключения к серверу" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: 28, fontWeight: 700, color: C.text, marginBottom: 20 }}>Создать аккаунт</h2>

      {/* Выбор роли */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 14, color: C.text, marginBottom: 10 }}>Я регистрируюсь как</div>
        <div style={{ display: "flex", gap: 12 }}>
          {[["seeker", "Соискатель"], ["employer", "Работодатель"]].map(([id, label]) => (
            <div key={id} onClick={() => { setRole(id); setErrors(e => ({ ...e, role: null })); }}
              style={{ flex: 1, border: `1.5px solid ${role === id ? C.primary : C.border}`, borderRadius: 8, padding: "12px", textAlign: "center", cursor: "pointer", background: role === id ? C.primaryLight : "#fff", color: role === id ? C.primary : C.text, fontWeight: role === id ? 600 : 400, fontSize: 14, transition: "all .15s" }}>
              {label}
            </div>
          ))}
        </div>
        {errors.role && <div style={{ color: C.red, fontSize: 12, marginTop: 4 }}>{errors.role}</div>}
      </div>

      <Inp label="Полное имя" placeholder="Алексей Алексеевич" value={name}     onChange={e => { setName(e.target.value);     setErrors(er => ({ ...er, name: null })); }} error={errors.name} />
      <Inp label="Email"      type="email" placeholder="you@yandex.ru"           value={email}    onChange={e => { setEmail(e.target.value);    setErrors(er => ({ ...er, email: null })); }} error={errors.email} />
      <Inp label="Пароль"     type="password" placeholder="Минимум 6 символов"  value={password} onChange={e => { setPassword(e.target.value); setErrors(er => ({ ...er, password: null })); }} error={errors.password} />


      <button onClick={submit} disabled={loading}
        style={{ width: "100%", background: C.primary, border: "none", borderRadius: 8, padding: "13px", color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: "inherit" }}>
        {loading ? "Создаём..." : "Зарегистрироваться"}
      </button>
      <p style={{ textAlign: "center", fontSize: 14, color: C.sub, marginTop: 20 }}>
        Есть аккаунт?{" "}
        <span onClick={onSwitch} style={{ color: C.primary, fontWeight: 600, cursor: "pointer" }}>Войти</span>
      </p>
    </div>
  );
};

// ── Главный компонент ─────────────────────────────────────
export default function AuthPage({ onLogin }) {
    const [mode, setMode] = useState("login");

    const handleSuccess = (user) => {
        localStorage.setItem("user", JSON.stringify(user));
        setTimeout(() => onLogin(user), 300);
    };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: "'Inter','Segoe UI',sans-serif" }}>

      {/* Шапка */}
      <div style={{ height: 60, background: "#fff", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: C.primary, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 16 }}>H</div>
          <span style={{ fontWeight: 700, fontSize: 18, color: C.text }}>HireSpace</span>
        </div>
        <button onClick={() => setMode(mode === "login" ? "register" : "login")}
          style={{ border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 20px", background: "#fff", color: C.text, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
          {mode === "login" ? "Войти" : "Войти"}
        </button>
      </div>

      {/* Тело */}
      <div style={{ flex: 1, display: "flex" }}>

        {/* Левая синяя панель */}
        <div style={{ flex: 1, background: C.primary, padding: "60px 56px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, marginBottom: 32 }}>Платформа для найма</div>
          <h1 style={{ fontSize: 40, fontWeight: 700, color: "#fff", lineHeight: 1.2, margin: 0 }}>
            Найди своё место - или нужного человека
          </h1>
        </div>

        {/* Правая форма */}
        <div style={{ width: 520, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 56px" }}>
          <div style={{ width: "100%", maxWidth: 380 }}>
            {mode === "login"
              ? <LoginForm    onSwitch={() => setMode("register")} onSuccess={handleSuccess} />
              : <RegisterForm onSwitch={() => setMode("login")}    onSuccess={handleSuccess} />
            }
          </div>
        </div>
      </div>
    </div>
  );
}
