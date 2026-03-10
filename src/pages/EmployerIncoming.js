import { useState, useEffect } from "react";
import { C } from "../constants/colors";
import { applicationsApi } from "../constants/api";

export default function EmployerIncoming({ currentUser }) {
  const [list,    setList]    = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    if (!currentUser?.id) { setLoading(false); return; }
    applicationsApi.getByEmployer(currentUser.id)
      .then(data => setList(Array.isArray(data) ? data : []))
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [currentUser?.id]);

  const updateStatus = async (id, status) => {
    try {
      await applicationsApi.updateStatus(id, status);
      setList(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    } catch (e) { alert("Ошибка: " + e.message); }
  };

  const counts = {
    pending:  list.filter(a => a.status === "На рассмотрении").length,
    accepted: list.filter(a => a.status === "Принято").length,
    rejected: list.filter(a => a.status === "Отказано").length,
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
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 1.5fr 1fr", padding: "12px 20px", borderBottom: `1px solid ${C.border}`, background: C.bg }}>
          {["Кандидат","Вакансия","Опыт","Ожидания","Статус"].map(h => (
            <div key={h} style={{ fontSize: 13, color: C.sub }}>{h}</div>
          ))}
        </div>

        {loading ? (
          <div style={{ padding: "40px 20px", textAlign: "center", color: C.muted }}>Загрузка...</div>
        ) : list.length === 0 ? (
          <div style={{ padding: "60px 20px", textAlign: "center", color: C.muted }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>
            <div>Откликов пока нет</div>
          </div>
        ) : (
          list.map((a, i) => {
            const initials = (a.full_name||"?").split(" ").map(w => w[0]).join("").slice(0,2);
            const salary = a.desired_salary
              ? `${Number(a.desired_salary).toLocaleString("ru-RU")} - ${(a.desired_salary*1.5|0).toLocaleString("ru-RU")}₽`
              : "—";
            const statusColor = a.status === "Принято" ? C.green : a.status === "Отказано" ? C.red : C.amber;
            return (
              <div key={a.id} style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 1.5fr 1fr", alignItems: "center", padding: "14px 20px", borderBottom: i < list.length-1 ? `1px solid ${C.border}` : "none", background: "#fff" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.border, display: "flex", alignItems: "center", justifyContent: "center", color: C.sub, fontSize: 13, fontWeight: 600, flexShrink: 0 }}>{initials}</div>
                  <span style={{ fontWeight: 600, color: C.text, fontSize: 14 }}>{a.full_name}</span>
                </div>
                <div style={{ fontSize: 14, color: C.text }}>{a.vacancy_title}</div>
                <div style={{ fontSize: 14, color: C.text }}>{a.experience || "—"}</div>
                <div style={{ fontSize: 14, color: C.green, fontWeight: 500 }}>{salary}</div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  {a.status === "На рассмотрении" ? (
                    <>
                      <button onClick={() => updateStatus(a.id, "Принято")}  title="Принять"
                        style={{ width: 32, height: 32, borderRadius: 6, border: `1px solid ${C.greenBorder}`, background: C.greenLight, color: C.green, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✓</button>
                      <button onClick={() => updateStatus(a.id, "Отказано")} title="Отказать"
                        style={{ width: 32, height: 32, borderRadius: 6, border: `1px solid ${C.redBorder}`, background: C.redLight, color: C.red, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
                    </>
                  ) : (
                    <span style={{ fontSize: 13, fontWeight: 600, color: statusColor }}>{a.status}</span>
                  )}
                </div>
              </div>
            );
          })
        )}
        {list.length > 0 && <div style={{ height: 40, background: "#fff" }} />}
      </div>
    </div>
  );
}
