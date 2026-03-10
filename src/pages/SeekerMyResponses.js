import { useState, useEffect } from "react";
import { C } from "../constants/colors";
import { applicationsApi } from "../constants/api";

const STATUS_MAP = {
  "Принято":         { label: "Принят",         bg: C.greenLight, border: C.greenBorder, color: C.green },
  "Отказано":        { label: "Отклонён",        bg: C.redLight,   border: C.redBorder,   color: C.red   },
  "На рассмотрении": { label: "На рассмотрении", bg: C.amberLight, border: C.amberBorder, color: C.amber },
};

const Badge = ({ status }) => {
  const s = STATUS_MAP[status] || STATUS_MAP["На рассмотрении"];
  return (
    <span style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color, borderRadius: 8, padding: "4px 12px", fontSize: 13, fontWeight: 500, whiteSpace: "nowrap" }}>
      {s.label}
    </span>
  );
};

const fmtSalary = (from, to) => {
  if (from && to)  return `${from.toLocaleString("ru-RU")} - ${to.toLocaleString("ru-RU")} Руб.`;
  if (from)        return `от ${from.toLocaleString("ru-RU")} Руб.`;
  if (to)          return `до ${to.toLocaleString("ru-RU")} Руб.`;
  return null;
};

export default function SeekerMyResponses({ seekerData }) {
  const [list,    setList]    = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!seekerData?.id) { setLoading(false); return; }
    applicationsApi.getBySeeker(seekerData.id)
      .then(data => setList(Array.isArray(data) ? data : []))
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  }, [seekerData?.id]);

  const counts = {
    accepted: list.filter(a => a.status === "Принято").length,
    rejected: list.filter(a => a.status === "Отказано").length,
    pending:  list.filter(a => a.status === "На рассмотрении").length,
  };

  if (loading) return (
    <div style={{ textAlign: "center", padding: "80px 0", color: C.muted, fontFamily: "inherit" }}>
      Загрузка откликов...
    </div>
  );

  return (
    <div style={{ maxWidth: 840, margin: "0 auto", padding: "40px 24px", fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, color: C.text, marginBottom: 4 }}>Мои отклики</h2>
      <p style={{ color: C.sub, fontSize: 14, marginBottom: 24 }}>{list.length} откликов отправлено</p>

      {/* Статистика */}
      {list.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 28 }}>
          <div style={{ background: C.greenLight, border: `1px solid ${C.greenBorder}`, borderRadius: 10, padding: "18px 20px", textAlign: "center" }}>
            <div style={{ color: C.green, fontWeight: 600, fontSize: 15 }}>{counts.accepted} Принято</div>
          </div>
          <div style={{ background: C.redLight, border: `1px solid ${C.redBorder}`, borderRadius: 10, padding: "18px 20px", textAlign: "center" }}>
            <div style={{ color: C.red, fontWeight: 600, fontSize: 15 }}>{counts.rejected} Отклонено</div>
          </div>
          <div style={{ background: C.amberLight, border: `1px solid ${C.amberBorder}`, borderRadius: 10, padding: "18px 20px", textAlign: "center" }}>
            <div style={{ color: C.amber, fontWeight: 600, fontSize: 15 }}>{counts.pending} На рассмотрении</div>
          </div>
        </div>
      )}

      {/* Список */}
      {list.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: C.muted }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>📭</div>
          <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 6 }}>Откликов пока нет</div>
          <div style={{ fontSize: 14 }}>Перейдите в «Вакансии» и откликнитесь на понравившиеся</div>
        </div>
      ) : (
        <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>
          {list.map((a, i) => {
            const salary = fmtSalary(a.salary_from, a.salary_to);
            return (
              <div key={a.id} style={{ padding: "18px 20px", borderBottom: i < list.length - 1 ? `1px solid ${C.border}` : "none", display: "flex", alignItems: "center", gap: 16, background: "#fff" }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: C.border, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: C.text, marginBottom: 3 }}>{a.title}</div>
                  <div style={{ fontSize: 13, color: C.sub }}>
                    {[a.company, a.city, a.schedule].filter(Boolean).join("   ")}
                    {a.created_at && <span style={{ marginLeft: 12 }}>Отклик {new Date(a.created_at).toLocaleDateString("ru-RU")}</span>}
                  </div>
                  {salary && <div style={{ fontSize: 13, color: C.green, fontWeight: 500, marginTop: 4 }}>{salary}</div>}
                </div>
                <Badge status={a.status} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
