import { useState } from "react";
import { C } from "../constants/colors";

// Моковые вакансии (в реальном проекте загружаются из БД)
const MOCK_VACANCIES = [
  { id: 1, title: "Senior Frontend Developer", company: "TechFlow",  city: "Москва",    type: "Удалённо", skills: ["React","TypeScript"], exp: "3+ лет", salary: "180 000 - 250 000" },
  { id: 2, title: "Product Designer",          company: "DesignHub", city: "Удалённо",  type: "Удалённо", skills: ["Figma","UX"],          exp: "2+ лет", salary: "150 000 - 200 000" },
  { id: 3, title: "Backend Developer",         company: "DataCorp",  city: "Москва",    type: "Офис",     skills: ["Go","PostgreSQL"],     exp: "2+ лет", salary: "200 000 - 280 000" },
  { id: 4, title: "Data Engineer",             company: "AnalyticsPro", city: "Санкт-Петербург", type: "Гибрид", skills: ["Python","SQL"], exp: "2+ лет", salary: "180 000 - 250 000" },
];

const QUICK_FILTERS = ["Все", "Удалённо", "React", "Python"];

export default function SeekerVacancies({ onApply }) {
  const [search,      setSearch]      = useState("");
  const [citySearch,  setCitySearch]  = useState("");
  const [activeTag,   setActiveTag]   = useState("Все");
  const [sortBy,      setSortBy]      = useState("По дате");

  const filtered = MOCK_VACANCIES.filter(v => {
    const q = search.toLowerCase();
    if (q && !v.title.toLowerCase().includes(q) && !v.company.toLowerCase().includes(q)) return false;
    if (citySearch && !v.city.toLowerCase().includes(citySearch.toLowerCase())) return false;
    if (activeTag !== "Все") {
      if (activeTag === "Удалённо" && v.type !== "Удалённо") return false;
      if (activeTag !== "Удалённо" && !v.skills.includes(activeTag)) return false;
    }
    return true;
  });

  return (
    <div style={{ maxWidth: 840, margin: "0 auto", padding: "40px 24px", fontFamily: "'Inter','Segoe UI',sans-serif" }}>

      {/* Поиск */}
      <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px 20px", marginBottom: 12 }}>
        <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
          <input
            placeholder="Должность или компания"
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", fontSize: 14, outline: "none", fontFamily: "inherit", color: C.text }}
          />
          <input
            placeholder="Город"
            value={citySearch} onChange={e => setCitySearch(e.target.value)}
            style={{ width: 160, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", fontSize: 14, outline: "none", fontFamily: "inherit", color: C.text }}
          />
          <button onClick={() => {}}
            style={{ background: C.primary, border: "none", borderRadius: 8, padding: "10px 24px", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
            Найти
          </button>
        </div>
        {/* Быстрые фильтры */}
        <div style={{ display: "flex", gap: 8 }}>
          {QUICK_FILTERS.map(tag => (
            <div key={tag} onClick={() => setActiveTag(tag)}
              style={{ padding: "5px 14px", borderRadius: 8, fontSize: 13, cursor: "pointer", border: `1px solid ${activeTag === tag ? C.primary : C.border}`, background: activeTag === tag ? C.primaryLight : "#fff", color: activeTag === tag ? C.primary : C.text, transition: "all .12s" }}>
              {tag}
            </div>
          ))}
        </div>
      </div>

      {/* Заголовок результатов */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <span style={{ fontSize: 14, color: C.sub }}>{filtered.length} вакансий найдено</span>
        <div style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}
          onClick={() => setSortBy(s => s === "По дате" ? "По зарплате" : "По дате")}>
          <span style={{ fontSize: 14, color: C.text }}>{sortBy}</span>
          <span style={{ fontSize: 12, color: C.sub }}>▾</span>
        </div>
      </div>

      {/* Список вакансий */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map(v => (
          <div key={v.id} onClick={() => onApply && onApply(v)}
            style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 12, padding: "18px 20px", cursor: "pointer", transition: "border-color .15s, box-shadow .15s" }}
            onMouseOver={e => { e.currentTarget.style.borderColor = C.borderFocus; e.currentTarget.style.boxShadow = "0 2px 12px rgba(37,99,235,0.08)"; }}
            onMouseOut={e =>  { e.currentTarget.style.borderColor = C.border;      e.currentTarget.style.boxShadow = "none"; }}>

            <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
              {/* Иконка компании */}
              <div style={{ width: 44, height: 44, borderRadius: 10, background: C.border, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 15, color: C.text, marginBottom: 3 }}>{v.title}</div>
                <div style={{ fontSize: 13, color: C.sub, marginBottom: 8 }}>{v.company}   {v.city}</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                  {v.skills.map(s => (
                    <span key={s} style={{ background: C.tagBg, borderRadius: 6, padding: "3px 10px", fontSize: 12, color: C.sub }}>{s}</span>
                  ))}
                  <span style={{ background: C.tagBg, borderRadius: 6, padding: "3px 10px", fontSize: 12, color: C.sub }}>{v.type}</span>
                  <span style={{ background: C.tagBg, borderRadius: 6, padding: "3px 10px", fontSize: 12, color: C.sub }}>{v.exp}</span>
                </div>
                <div style={{ fontWeight: 600, fontSize: 14, color: C.green }}>{v.salary} Руб.</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
