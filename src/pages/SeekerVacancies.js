import { useState, useEffect } from "react";
import { C } from "../constants/colors";
import { vacanciesApi, applicationsApi } from "../constants/api";

const SKILLS_TAGS = ["Все", "React", "Vue", "TypeScript", "JavaScript", "Docker", "Figma", "Agile", "Python", "Go", "Java", "PostgreSQL", "MongoDB", "Git", "SQL", "AWS", "UX Research"];
const SCHEDULES   = ["Любой", "Полный день", "Гибкий график", "Удалённо", "Сменный"];
const EXPERIENCES = ["Любой", "Без опыта", "До 1 года", "1–3 года", "3–6 лет", "6–10 лет", "10+ лет"];

const fmtSalary = (from, to) => {
  if (!from && !to) return null;
  if (from && to)   return `${from.toLocaleString("ru-RU")} - ${to.toLocaleString("ru-RU")} Руб.`;
  if (from)         return `от ${from.toLocaleString("ru-RU")} Руб.`;
  return `до ${to.toLocaleString("ru-RU")} Руб.`;
};

const selStyle = {
  border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px",
  fontSize: 14, outline: "none", fontFamily: "inherit", color: C.text,
  background: "#fff", cursor: "pointer", appearance: "none",
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236B7280' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", paddingRight: 32,
};

export default function SeekerVacancies({ seekerData }) {
  const [vacancies,   setVacancies]   = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState("");
  const [city,        setCity]        = useState("");
  const [activeTag,   setActiveTag]   = useState("Все");
  const [schedule,    setSchedule]    = useState("Любой");
  const [experience,  setExperience]  = useState("Любой");
  const [sortBy,      setSortBy]      = useState("По дате");
  const [expandedId,  setExpandedId]  = useState(null);
  const [applied,     setApplied]     = useState({});

  const load = async (filters = {}) => {
    setLoading(true);
    try {
      const data = await vacanciesApi.getAll(filters);
      setVacancies(Array.isArray(data) ? data : []);
    } catch {
      setVacancies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const buildFilters = ({ tag = activeTag, sch = schedule, exp = experience } = {}) => {
    const f = {};
    if (search) f.title = search;
    if (city)   f.city  = city;
    if (tag !== "Все")   f.skill    = tag;
    if (sch !== "Любой") f.schedule = sch;
    if (exp !== "Любой") f.experience = exp;
    return f;
  };

  const handleSearch = () => load(buildFilters());

  const handleTag = (tag) => {
    setActiveTag(tag);
    load(buildFilters({ tag }));
  };

  const handleSchedule = (sch) => {
    setSchedule(sch);
    load(buildFilters({ sch }));
  };

  const handleExperience = (exp) => {
    setExperience(exp);
    load(buildFilters({ exp }));
  };

  const handleReset = () => {
    setSearch(""); setCity(""); setActiveTag("Все");
    setSchedule("Любой"); setExperience("Любой");
    load({});
  };

  const handleApply = async (vacancy_id) => {
    if (!seekerData?.id) {
      setApplied(a => ({ ...a, [vacancy_id]: "no_profile" }));
      return;
    }
    setApplied(a => ({ ...a, [vacancy_id]: "loading" }));
    try {
      const r = await applicationsApi.apply({ vacancy_id, seeker_id: seekerData.id });
      if (r.error) {
        setApplied(a => ({ ...a, [vacancy_id]: r.error }));
      } else {
        setApplied(a => ({ ...a, [vacancy_id]: "success" }));
      }
    } catch {
      setApplied(a => ({ ...a, [vacancy_id]: "Ошибка сервера" }));
    }
  };

  const sorted = [...vacancies].sort((a, b) => {
    if (sortBy === "По зарплате") return (b.salary_from || 0) - (a.salary_from || 0);
    return new Date(b.created_at) - new Date(a.created_at);
  });

  const hasFilters = search || city || activeTag !== "Все" || schedule !== "Любой" || experience !== "Любой";

  return (
      <div style={{ maxWidth: 840, margin: "0 auto", padding: "40px 24px", fontFamily: "'Inter','Segoe UI',sans-serif" }}>

        {/* Поиск */}
        <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px 20px", marginBottom: 12 }}>

          {/* Строка поиска */}
          <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
            <input
                placeholder="Должность или компания"
                value={search} onChange={e => setSearch(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSearch()}
                style={{ flex: 1, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", fontSize: 14, outline: "none", fontFamily: "inherit", color: C.text }}
            />
            <input
                placeholder="Город"
                value={city} onChange={e => setCity(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSearch()}
                style={{ width: 160, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", fontSize: 14, outline: "none", fontFamily: "inherit", color: C.text }}
            />
            <button onClick={handleSearch}
                    style={{ background: C.primary, border: "none", borderRadius: 8, padding: "10px 24px", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
              Найти
            </button>
          </div>

          {/* Селекты: График и Опыт */}
          <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
            <select value={schedule} onChange={e => handleSchedule(e.target.value)} style={{ ...selStyle, flex: 1 }}>
              {SCHEDULES.map(s => <option key={s} value={s}>{s === "Любой" ? "График работы" : s}</option>)}
            </select>
            <select value={experience} onChange={e => handleExperience(e.target.value)} style={{ ...selStyle, flex: 1 }}>
              {EXPERIENCES.map(e => <option key={e} value={e}>{e === "Любой" ? "Опыт работы" : e}</option>)}
            </select>
            {hasFilters && (
                <button onClick={handleReset}
                        style={{ border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 16px", fontSize: 13, color: C.sub, background: "#fff", cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
                  Сбросить
                </button>
            )}
          </div>

          {/* Теги навыков */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {SKILLS_TAGS.map(tag => (
                <div key={tag} onClick={() => handleTag(tag)}
                     style={{ padding: "5px 14px", borderRadius: 8, fontSize: 13, cursor: "pointer", border: `1px solid ${activeTag === tag ? C.primary : C.border}`, background: activeTag === tag ? C.primaryLight : "#fff", color: activeTag === tag ? C.primary : C.text, transition: "all .12s" }}>
                  {tag}
                </div>
            ))}
          </div>
        </div>

        {/* Счётчик + сортировка */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <span style={{ fontSize: 14, color: C.sub }}>{sorted.length} вакансий найдено</span>
          <div style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}
               onClick={() => setSortBy(s => s === "По дате" ? "По зарплате" : "По дате")}>
            <span style={{ fontSize: 14, color: C.text }}>{sortBy}</span>
            <span style={{ fontSize: 12, color: C.sub }}>▾</span>
          </div>
        </div>

        {/* Список */}
        {loading ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: C.muted }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>⏳</div>
              <div>Загружаем вакансии...</div>
            </div>
        ) : sorted.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: C.muted }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>🔍</div>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>Вакансий не найдено</div>
              <div style={{ fontSize: 13 }}>Попробуйте изменить фильтры</div>
            </div>
        ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {sorted.map(v => {
                const isOpen     = expandedId === v.id;
                const applyState = applied[v.id];
                const skillsList = v.skills ? v.skills.split(",").map(s => s.trim()).filter(Boolean) : [];
                const salary     = fmtSalary(v.salary_from, v.salary_to);

                return (
                    <div key={v.id} style={{ background: "#fff", border: `1px solid ${isOpen ? C.primary : C.border}`, borderRadius: 12, overflow: "hidden", transition: "border-color .15s" }}>

                      <div onClick={() => setExpandedId(isOpen ? null : v.id)}
                           style={{ padding: "18px 20px", display: "flex", gap: 16, alignItems: "flex-start", cursor: "pointer" }}
                           onMouseOver={e => { if (!isOpen) e.currentTarget.style.background = C.bg; }}
                           onMouseOut={e =>  { e.currentTarget.style.background = "#fff"; }}>
                        <div style={{ width: 44, height: 44, borderRadius: 10, background: C.border, flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: 15, color: C.text, marginBottom: 3 }}>{v.title}</div>
                          <div style={{ fontSize: 13, color: C.sub, marginBottom: 8 }}>
                            {v.company && <span>{v.company}</span>}
                            {v.company && v.city && <span>  •  </span>}
                            {v.city && <span>{v.city}</span>}
                          </div>
                          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                            {skillsList.slice(0, 4).map(s => (
                                <span key={s} style={{ background: C.tagBg, borderRadius: 6, padding: "3px 10px", fontSize: 12, color: C.sub }}>{s}</span>
                            ))}
                            {v.schedule && (
                                <span style={{ background: C.tagBg, borderRadius: 6, padding: "3px 10px", fontSize: 12, color: C.sub }}>{v.schedule}</span>
                            )}
                          </div>
                          {salary && (
                              <div style={{ fontWeight: 600, fontSize: 14, color: C.green, marginTop: 8 }}>{salary}</div>
                          )}
                        </div>
                        <div style={{ color: C.muted, fontSize: 12, flexShrink: 0, marginTop: 4 }}>{isOpen ? "▲" : "▼"}</div>
                      </div>

                      {isOpen && (
                          <div style={{ borderTop: `1px solid ${C.border}`, padding: "16px 20px", background: C.bg }}>
                            {v.description && (
                                <div style={{ fontSize: 14, color: C.text, lineHeight: 1.6, marginBottom: 16 }}>
                                  {v.description}
                                </div>
                            )}
                            <div style={{ display: "flex", gap: 24, marginBottom: 16, flexWrap: "wrap" }}>
                              {v.company  && <div style={{ fontSize: 13, color: C.sub }}>🏢 {v.company}</div>}
                              {v.city     && <div style={{ fontSize: 13, color: C.sub }}>📍 {v.city}</div>}
                              {v.schedule && <div style={{ fontSize: 13, color: C.sub }}>🕐 {v.schedule}</div>}
                              {v.email    && <div style={{ fontSize: 13, color: C.sub }}>✉️ {v.email}</div>}
                              {salary     && <div style={{ fontSize: 13, color: C.green, fontWeight: 600 }}>{salary}</div>}
                            </div>

                            {applyState === "success" ? (
                                <div style={{ background: C.greenLight, border: `1px solid ${C.greenBorder}`, borderRadius: 8, padding: "10px 20px", color: C.green, fontWeight: 600, fontSize: 14, display: "inline-block" }}>
                                  ✓ Отклик отправлен!
                                </div>
                            ) : (
                                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                  <button
                                      onClick={() => handleApply(v.id)}
                                      disabled={applyState === "loading"}
                                      style={{ background: applyState === "loading" ? C.primaryBorder : C.primary, border: "none", borderRadius: 8, padding: "10px 24px", color: "#fff", fontWeight: 700, fontSize: 14, cursor: applyState === "loading" ? "default" : "pointer", fontFamily: "inherit" }}>
                                    {applyState === "loading" ? "Отправляем..." : "Откликнуться"}
                                  </button>
                                  {applyState && applyState !== "loading" && (
                                      <div style={{ fontSize: 13, color: applyState === "no_profile" ? C.amber : C.red }}>
                                        {applyState === "no_profile"
                                            ? "⚠ Сначала заполните анкету в разделе «Моя анкета»"
                                            : `⚠ ${applyState}`}
                                      </div>
                                  )}
                                </div>
                            )}
                          </div>
                      )}
                    </div>
                );
              })}
            </div>
        )}
      </div>
  );
}