import { C } from "../constants/colors";

export default function Navbar({ role, screen, onNav, onSwitch, incomingCount }) {
  const seekerTabs = [
    { id: "apply",       label: "Моя анкета"    },
    { id: "myresponses", label: "Мои отклики"   },
  ];
  const employerTabs = [
    { id: "incoming", label: `Входящие отклики${incomingCount ? ` (${incomingCount})` : ""}` },
    { id: "search",   label: "Поиск кандидатов" },
    { id: "saved",    label: "Сохранённые"       },
  ];
  const tabs = role === "seeker" ? seekerTabs : employerTabs;

  return (
    <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "0 32px", display: "flex", alignItems: "center", height: 60, position: "sticky", top: 0, zIndex: 100 }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginRight: 40, cursor: "pointer" }} onClick={() => onNav(tabs[0].id)}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: C.primary, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 15 }}>H</div>
        <span style={{ fontWeight: 700, fontSize: 16, color: C.text }}>HireSpace</span>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, flex: 1 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => onNav(t.id)}
            style={{ background: screen === t.id ? C.primaryLight : "transparent", border: "none", padding: "6px 14px", borderRadius: 8, color: screen === t.id ? C.primary : C.sub, fontWeight: screen === t.id ? 600 : 500, fontSize: 14, cursor: "pointer", position: "relative" }}>
            {t.label}
            {t.id === "incoming" && incomingCount > 0 && screen !== "incoming" && (
              <span style={{ position: "absolute", top: 4, right: 4, width: 7, height: 7, borderRadius: "50%", background: C.red }} />
            )}
          </button>
        ))}
      </div>

      {/* Role switcher */}
      <button onClick={onSwitch}
        style={{ display: "flex", alignItems: "center", gap: 8, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 13, color: C.sub, fontWeight: 500 }}>
        <div style={{ width: 22, height: 22, borderRadius: "50%", background: role === "seeker" ? "#EDE9FE" : C.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: role === "seeker" ? "#7C3AED" : C.primary, fontWeight: 700 }}>
          {role === "seeker" ? "С" : "Р"}
        </div>
        {role === "seeker" ? "Соискатель" : "Работодатель"}
        <span style={{ fontSize: 10 }}>▾</span>
      </button>
    </div>
  );
}
