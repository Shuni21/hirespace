import { C } from "../constants/colors";

export default function EmployerIncoming({ candidates, onUpdateStatus }) {
  const list = candidates || [];

  const counts = {
    pending:  list.filter(c => c.application_status === "На рассмотрении").length,
    accepted: list.filter(c => c.application_status === "Принято").length,
    rejected: list.filter(c => c.application_status === "Отказано").length,
  };

  return (
    <div style={{ maxWidth: 840, margin: "0 auto", padding: "40px 24px", fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, color: C.text, marginBottom: 4 }}>Входящие отклики</h2>
      <p style={{ color: C.sub, fontSize: 14, marginBottom: 24 }}>{list.length} откликов отправлено</p>

      {/* Статистика */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 28 }}>
        <div style={{ background: C.amberLight, border: `1px solid ${C.amberBorder}`, borderRadius: 10, padding: "18px 20px", textAlign: "center" }}>
          <div style={{ color: C.amber, fontWeight: 600, fontSize: 15 }}>{counts.pending} Новых откликов</div>
        </div>
        <div style={{ background: C.greenLight, border: `1px solid ${C.greenBorder}`, borderRadius: 10, padding: "18px 20px", textAlign: "center" }}>
          <div style={{ color: C.green, fontWeight: 600, fontSize: 15 }}>{counts.accepted} Приглашено</div>
        </div>
        <div style={{ background: C.redLight, border: `1px solid ${C.redBorder}`, borderRadius: 10, padding: "18px 20px", textAlign: "center" }}>
          <div style={{ color: C.red, fontWeight: 600, fontSize: 15 }}>{counts.rejected} Отклонено</div>
        </div>
      </div>

      {/* Таблица */}
      <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>
        {/* Заголовок таблицы */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 1.5fr 1fr", gap: 0, padding: "12px 20px", borderBottom: `1px solid ${C.border}`, background: C.bg }}>
          {["Кандидат","Вакансия","Опыт","Ожидания","Статус"].map(h => (
            <div key={h} style={{ fontSize: 13, color: C.sub, fontWeight: 500 }}>{h}</div>
          ))}
        </div>

        {list.length === 0 ? (
          <div style={{ padding: "60px 20px", textAlign: "center", color: C.muted }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>
            <div>Откликов пока нет</div>
          </div>
        ) : (
          list.map((c, i) => {
            const initials = (c.full_name || "?").split(" ").map(w => w[0]).join("").slice(0, 2);
            const salary   = c.desired_salary
              ? c.desired_salary.toLocaleString("ru-RU") + " - " + (c.desired_salary * 1.5 | 0).toLocaleString("ru-RU") + "₽"
              : "—";
            return (
              <div key={c.id} style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 1.5fr 1fr", alignItems: "center", gap: 0, padding: "14px 20px", borderBottom: i < list.length - 1 ? `1px solid ${C.border}` : "none", background: "#fff" }}>
                {/* Кандидат */}
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.border, display: "flex", alignItems: "center", justifyContent: "center", color: C.sub, fontSize: 13, fontWeight: 600, flexShrink: 0 }}>{initials}</div>
                  <span style={{ fontWeight: 600, color: C.text, fontSize: 14 }}>{c.full_name}</span>
                </div>
                {/* Вакансия */}
                <div style={{ fontSize: 14, color: C.text }}>{c.specialty}</div>
                {/* Опыт */}
                <div style={{ fontSize: 14, color: C.text }}>{c.experience || "—"}</div>
                {/* Ожидания */}
                <div style={{ fontSize: 14, color: C.green, fontWeight: 500 }}>{salary}</div>
                {/* Кнопки статуса */}
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <button
                    onClick={() => onUpdateStatus && onUpdateStatus(c.id, "Принято")}
                    title="Принять"
                    style={{ width: 32, height: 32, borderRadius: 6, border: `1px solid ${C.greenBorder}`, background: C.greenLight, color: C.green, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    ✓
                  </button>
                  <button
                    onClick={() => onUpdateStatus && onUpdateStatus(c.id, "Отказано")}
                    title="Отказать"
                    style={{ width: 32, height: 32, borderRadius: 6, border: `1px solid ${C.redBorder}`, background: C.redLight, color: C.red, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    ✕
                  </button>
                </div>
              </div>
            );
          })
        )}

        {/* Пустая нижняя зона как в макете */}
        {list.length > 0 && (
          <div style={{ height: 80, background: "#fff" }} />
        )}
      </div>
    </div>
  );
}
