import { C } from "../constants/colors";

const SEEKER_TABS   = [
  { id: "vacancies",  label: "Вакансии"    },
  { id: "responses",  label: "Мои отклики" },
  { id: "apply",      label: "Моя анкета"  },
];
const EMPLOYER_TABS = [
  { id: "vacancies",  label: "Мои вакансии"       },
  { id: "search",     label: "Поиск кандидатов"    },
  { id: "incoming",   label: "Входящие"            },
];

export default function Navbar({ role, screen, onNav, onLogout, userName }) {
  const tabs    = role === "seeker" ? SEEKER_TABS : EMPLOYER_TABS;
  const initials = userName ? userName[0].toUpperCase() : "?";
  const roleLabel = role === "seeker" ? "Соискатель" : "Работодатель";

  return (
    <div style={{ background: "#fff", borderBottom: `1px solid ${C.border}`, height: 60, display: "flex", alignItems: "center", padding: "0 32px", position: "sticky", top: 0, zIndex: 100 }}>

      {/* Логотип */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginRight: 32 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: C.primary, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 16 }}>H</div>
        <span style={{ fontWeight: 700, fontSize: 17, color: C.text, letterSpacing: -0.3 }}>HireSpace</span>
      </div>

      {/* Табы */}
      <div style={{ display: "flex", gap: 4, flex: 1 }}>
        {tabs.map(t => {
          const active = screen === t.id;
          return (
            <button key={t.id} onClick={() => onNav(t.id)}
              style={{ background: "none", border: active ? `1px solid ${C.border}` : "none", borderRadius: 8, padding: "6px 16px", color: active ? C.primary : C.sub, fontWeight: active ? 600 : 400, fontSize: 14, cursor: "pointer", fontFamily: "inherit", transition: "color .15s" }}>
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Правая часть: аватар + роль */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={onLogout} title="Выйти">
        <div style={{ width: 30, height: 30, borderRadius: "50%", background: C.border, display: "flex", alignItems: "center", justifyContent: "center", color: C.sub, fontWeight: 700, fontSize: 13 }}>
          {initials}
        </div>
        <span style={{ fontSize: 14, color: C.text, fontWeight: 500 }}>{roleLabel}</span>
      </div>
    </div>
  );
}
