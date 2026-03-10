import { C } from "../constants/colors";

const STATUS_MAP = {
  "Принято":         { label: "Принят",          bg: C.greenLight, border: C.greenBorder, color: C.green },
  "Отказано":        { label: "Отклонён",         bg: C.redLight,   border: C.redBorder,   color: C.red   },
  "На рассмотрении": { label: "На рассмотрении",  bg: C.amberLight, border: C.amberBorder, color: C.amber },
};

const Badge = ({ status }) => {
  const s = STATUS_MAP[status] || STATUS_MAP["На рассмотрении"];
  return (
    <span style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color, borderRadius: 8, padding: "4px 12px", fontSize: 13, fontWeight: 500, whiteSpace: "nowrap" }}>
      {s.label}
    </span>
  );
};

export default function SeekerMyResponses({ applications }) {
  const list = applications || [];

  const counts = {
    accepted: list.filter(a => a.application_status === "Принято").length,
    rejected: list.filter(a => a.application_status === "Отказано").length,
    pending:  list.filter(a => a.application_status === "На рассмотрении").length,
  };

  return (
    <div style={{ maxWidth: 840, margin: "0 auto", padding: "40px 24px", fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, color: C.text, marginBottom: 4 }}>Мои отклики</h2>
      <p style={{ color: C.sub, fontSize: 14, marginBottom: 24 }}>{list.length} откликов отправлено</p>

      {/* Статистика */}
      {list.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 28 }}>
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
          <div style={{ fontSize: 14 }}>Заполните анкету, чтобы появиться в поиске работодателей</div>
        </div>
      ) : (
        <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>
          {list.map((a, i) => {
            const initials = (a.full_name || a.specialty || "?").split(" ").map(w => w[0]).join("").slice(0, 2);
            return (
              <div key={i} style={{ padding: "18px 20px", borderBottom: i < list.length - 1 ? `1px solid ${C.border}` : "none", display: "flex", alignItems: "center", gap: 16, background: "#fff" }}>
                {/* Аватар */}
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: C.border, display: "flex", alignItems: "center", justifyContent: "center", color: C.sub, fontSize: 14, fontWeight: 600, flexShrink: 0 }}>
                  {initials}
                </div>
                {/* Инфо */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: C.text, marginBottom: 3 }}>{a.specialty}</div>
                  <div style={{ fontSize: 13, color: C.sub }}>
                    {a.city && <span>{a.city}</span>}
                    {a.city && "    "}
                    <span>Отклик дата</span>
                    {a.created_at && <span>  {new Date(a.created_at).toLocaleDateString("ru-RU")}</span>}
                  </div>
                </div>
                <Badge status={a.application_status} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
