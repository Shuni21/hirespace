import { useState } from "react";
import { C } from "../constants/colors";
import { VACANCIES, CITIES, EDUCATIONS, GENDERS } from "../constants/data";
import { seekersApi } from "../constants/api";

const EXP_OPTS   = ["Любой","До 1 года","1–3 года","3–6 лет","6–10 лет","10+ лет"];
const AGE_FROM   = ["-","18","22","25","30","35","40"];
const AGE_TO     = ["-","25","30","35","40","45","55"];
const SKILLS_ALL = ["React","Vue","TypeScript","JavaScript","Docker","Figma","Agile","Python","Go","Java","PostgreSQL","MongoDB"];

const selSx = {
  width: "100%", boxSizing: "border-box", border: `1px solid ${C.border}`,
  borderRadius: 8, padding: "11px 14px", fontSize: 14, color: C.text,
  background: "#fff", outline: "none", fontFamily: "inherit", cursor: "pointer",
  appearance: "none",
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236B7280' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center", paddingRight: 36,
};

const inpSx = { ...selSx, appearance: "auto", backgroundImage: "none", paddingRight: 14 };

const Lbl = ({ children }) => <div style={{ fontSize: 13, color: C.text, marginBottom: 6 }}>{children}</div>;

const SubSection = ({ number, title, children }) => (
  <div style={{ borderBottom: `1px solid ${C.border}`, padding: "20px 24px" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
      <div style={{ width: 26, height: 26, borderRadius: "50%", background: C.primaryLight, color: C.primary, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>{number}</div>
      <div style={{ fontWeight: 600, fontSize: 14, color: C.text }}>{title}</div>
    </div>
    {children}
  </div>
);

// Карточка кандидата в результатах
const CandidateCard = ({ c, onBack, onUpdateStatus }) => {
  const initials = c.full_name.split(" ").map(w => w[0]).join("").slice(0, 2);
  const colors   = ["#4F46E5","#0891B2","#0D9488","#7C3AED","#BE185D"];
  const bg       = colors[c.full_name.charCodeAt(0) % colors.length];

  return (
    <div style={{ maxWidth: 840, margin: "0 auto", padding: "40px 24px", fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 24, cursor: "pointer" }} onClick={onBack}>
        <span style={{ color: C.primary, fontSize: 18 }}>←</span>
        <span style={{ color: C.primary, fontSize: 14, fontWeight: 500 }}>Вернуться назад</span>
      </div>
      <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>
        {/* Шапка */}
        <div style={{ padding: "28px 32px", display: "flex", alignItems: "center", gap: 20, borderBottom: `1px solid ${C.border}` }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: bg, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 22, flexShrink: 0 }}>{initials}</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18, color: C.text }}>{c.full_name}</div>
            <div style={{ color: C.sub, fontSize: 14, marginTop: 2 }}>{c.specialty}</div>
          </div>
        </div>
        {/* Поля */}
        <div style={{ padding: "24px 32px", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
            {[
              ["Возраст", c.age + " лет"],
              ["Пол",     c.gender],
              ["Ожидания", c.desired_salary ? c.desired_salary.toLocaleString("ru-RU") + " - " + (c.desired_salary * 1.4 | 0).toLocaleString("ru-RU") + " Руб." : "—"],
              ["Образование", c.education],
              ["Опыт",       c.experience || "—"],
              ["Город",      c.city],
            ].map(([label, val]) => (
              <div key={label}>
                <div style={{ fontSize: 13, color: C.sub, marginBottom: 4 }}>{label}</div>
                <div style={{ fontWeight: 600, fontSize: 14, color: C.text }}>{val}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Навыки */}
        {c.skills && (
          <div style={{ padding: "20px 32px", borderBottom: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 13, color: C.sub, marginBottom: 12 }}>Навыки</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {c.skills.split(", ").map(s => (
                <span key={s} style={{ border: `1px solid ${C.border}`, borderRadius: 8, padding: "5px 14px", fontSize: 13, color: C.text }}>{s}</span>
              ))}
            </div>
          </div>
        )}
        {/* Кнопка */}
        <div style={{ padding: "20px 32px" }}>
          <button onClick={() => onUpdateStatus(c.id, "Принято")}
            style={{ background: C.primary, border: "none", borderRadius: 8, padding: "12px 28px", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
            Пригласить
          </button>
        </div>
      </div>
    </div>
  );
};

// Список результатов
const ResultsList = ({ results, onSelect, onBack }) => {
  return (
    <div style={{ maxWidth: 840, margin: "0 auto", padding: "40px 24px", fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }} onClick={onBack}>
          <span style={{ color: C.primary, fontSize: 18 }}>←</span>
          <span style={{ color: C.primary, fontSize: 14, fontWeight: 500 }}>Изменить параметры</span>
        </div>
        <span style={{ color: C.border }}>|</span>
        <span style={{ color: C.sub, fontSize: 14 }}>{results.length} активных вакансий</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {results.map(c => {
          const initials = c.full_name.split(" ").map(w => w[0]).join("").slice(0, 2);
          const colors   = ["#4F46E5","#0891B2","#0D9488","#7C3AED","#BE185D"];
          const bg       = colors[c.full_name.charCodeAt(0) % colors.length];
          return (
            <div key={c.id} onClick={() => onSelect(c)}
              style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "center", gap: 16, cursor: "pointer" }}
              onMouseOver={e => e.currentTarget.style.borderColor = C.borderFocus}
              onMouseOut={e =>  e.currentTarget.style.borderColor = C.border}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: bg, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, flexShrink: 0 }}>{initials}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: C.text, marginBottom: 2 }}>{c.full_name}</div>
                <div style={{ fontSize: 13, color: C.sub }}>{c.specialty}   {c.city}</div>
                <div style={{ fontSize: 13, color: C.sub }}>{c.gender}</div>
              </div>
              {c.desired_salary > 0 && (
                <div style={{ color: C.green, fontWeight: 600, fontSize: 14, whiteSpace: "nowrap" }}>
                  {c.desired_salary.toLocaleString("ru-RU")} - {(c.desired_salary * 1.4 | 0).toLocaleString("ru-RU")} Руб.
                </div>
              )}
            </div>
          );
        })}
        {results.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0", color: C.muted }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
            <div>Никого не найдено. Попробуйте изменить параметры.</div>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Главный компонент ─────────────────────────────────────
export default function EmployerSearch({ onUpdateStatus }) {
  const [step,       setStep]       = useState("form");   // form | results | detail
  const [results,    setResults]    = useState([]);
  const [selected,   setSelected]   = useState(null);
  const [loading,    setLoading]    = useState(false);
  const [skills,     setSkills]     = useState([]);

  const [f, setF] = useState({
    specialty: "", city: "",
    gender: "Любой", age_from: "-", age_to: "-",
    experience: "Любой", education: "-",
    max_salary: "",
  });
  const sf = (k, v) => setF(prev => ({ ...prev, [k]: v }));

  const toggleSkill = (s) => setSkills(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const search = async () => {
    setLoading(true);
    try {
      const filters = {};
      if (f.specialty && f.specialty !== "Все") filters.specialty = f.specialty;
      if (f.city)       filters.city      = f.city;
      if (f.gender && f.gender !== "Любой") filters.gender = f.gender;
      if (f.max_salary) filters.max_salary = f.max_salary;
      const data = await seekersApi.getAll(filters);
      setResults(data);
      setStep("results");
    } catch (e) {
      alert("Ошибка загрузки: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setF({ specialty: "", city: "", gender: "Любой", age_from: "-", age_to: "-", experience: "Любой", education: "-", max_salary: "" });
    setSkills([]);
  };

  if (step === "detail" && selected) return (
    <CandidateCard c={selected} onBack={() => setStep("results")} onUpdateStatus={(id, s) => { onUpdateStatus && onUpdateStatus(id, s); setStep("results"); }} />
  );

  if (step === "results") return (
    <ResultsList results={results} onSelect={c => { setSelected(c); setStep("detail"); }} onBack={() => setStep("form")} />
  );

  // Форма поиска
  return (
    <div style={{ maxWidth: 840, margin: "0 auto", padding: "40px 24px", fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, color: C.text, marginBottom: 4 }}>Подбор кандидатов</h2>
      <p style={{ color: C.sub, fontSize: 14, marginBottom: 24 }}>Указать требования</p>

      <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>

        <SubSection number="1" title="Какая вакансия вас интересует">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <Lbl>Должность</Lbl>
              <select value={f.specialty} onChange={e => sf("specialty", e.target.value)} style={selSx}>
                <option value="">Выберите...</option>
                {VACANCIES.map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <Lbl>Город</Lbl>
              <input value={f.city} onChange={e => sf("city", e.target.value)} placeholder="Введите город" style={inpSx} />
            </div>
          </div>
        </SubSection>

        <SubSection number="2" title="Какого специалиста вы ищете?">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
            <div>
              <Lbl>Пол</Lbl>
              <select value={f.gender} onChange={e => sf("gender", e.target.value)} style={selSx}>
                {["Любой","Мужской","Женский"].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <Lbl>Возраст от</Lbl>
              <select value={f.age_from} onChange={e => sf("age_from", e.target.value)} style={selSx}>
                {AGE_FROM.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <Lbl>Возраст до</Lbl>
              <select value={f.age_to} onChange={e => sf("age_to", e.target.value)} style={selSx}>
                {AGE_TO.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>
        </SubSection>

        <SubSection number="3" title="Требования к квалификации">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <Lbl>Опыт работы</Lbl>
              <select value={f.experience} onChange={e => sf("experience", e.target.value)} style={selSx}>
                {EXP_OPTS.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <Lbl>Образование</Lbl>
              <select value={f.education} onChange={e => sf("education", e.target.value)} style={selSx}>
                <option value="-">-</option>
                {EDUCATIONS.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>
        </SubSection>

        <SubSection number="4" title="Бюджет">
          <div>
            <Lbl>Желаемая зарплата (₽)</Lbl>
            <input value={f.max_salary} onChange={e => sf("max_salary", e.target.value)} placeholder="Например: 200000" style={{ ...inpSx, maxWidth: 340 }} />
          </div>
        </SubSection>

        <SubSection number="5" title="Ключевые навыки специалиста вы ожидаете">
          <div style={{ fontSize: 13, color: C.sub, marginBottom: 12 }}>Выберите навыки из списка</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
            {SKILLS_ALL.map(s => {
              const active = skills.includes(s);
              return (
                <div key={s} onClick={() => toggleSkill(s)}
                  style={{ padding: "6px 14px", borderRadius: 8, fontSize: 13, cursor: "pointer", border: `1px solid ${active ? C.primary : C.border}`, background: active ? C.primaryLight : "#fff", color: active ? C.primary : C.text, display: "flex", alignItems: "center", gap: 6, transition: "all .12s" }}>
                  {active && <span>✓</span>}
                  {s}
                </div>
              );
            })}
          </div>
          {skills.length > 0 && (
            <div style={{ background: C.bg, borderRadius: 8, padding: "10px 14px", fontSize: 13, color: C.sub, display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
              <span>Выбрано:</span>
              {skills.map(s => <span key={s} style={{ background: C.primaryLight, color: C.primary, borderRadius: 6, padding: "2px 10px", fontWeight: 500 }}>{s}</span>)}
            </div>
          )}
        </SubSection>

        {/* Кнопки */}
        <div style={{ padding: "20px 24px", display: "flex", gap: 12 }}>
          <button onClick={search} disabled={loading}
            style={{ background: C.primary, border: "none", borderRadius: 8, padding: "12px 28px", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
            {loading ? "Ищем..." : "Найти кандидатов"}
          </button>
          <button onClick={reset}
            style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 8, padding: "12px 28px", color: C.sub, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
            Сбросить
          </button>
        </div>
      </div>
    </div>
  );
}
