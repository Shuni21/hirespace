import { useState, useEffect } from "react";
import { C } from "../constants/colors";
import { applicationsApi } from "../constants/api";

export default function EmployerIncoming({ currentUser }) {
    const [list,    setList]    = useState([]);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        if (!currentUser?.id) return;
        setLoading(true);
        try {
            const data = await applicationsApi.getByEmployer(currentUser.id);
            setList(Array.isArray(data) ? data : []);
        } catch {
            setList([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, [currentUser?.id]);

    const handleUpdateStatus = async (applicationId, status) => {
        try {
            await applicationsApi.updateStatus(applicationId, status);
            setList(prev => prev.map(c => c.id === applicationId ? { ...c, status } : c));
        } catch {
            alert("Ошибка обновления статуса");
        }
    };

    const counts = {
        pending:  list.filter(c => c.status === "На рассмотрении").length,
        accepted: list.filter(c => c.status === "Принято").length,
        rejected: list.filter(c => c.status === "Отказано").length,
    };

    if (loading) return (
        <div style={{ textAlign: "center", padding: "80px 0", color: C.muted, fontFamily: "'Inter','Segoe UI',sans-serif" }}>
            Загружаем отклики...
        </div>
    );

    return (
        <div style={{ maxWidth: 840, margin: "0 auto", padding: "40px 24px", fontFamily: "'Inter','Segoe UI',sans-serif" }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: C.text, marginBottom: 4 }}>Входящие отклики</h2>
            <p style={{ color: C.sub, fontSize: 14, marginBottom: 24 }}>{list.length} откликов получено</p>

            {/* Статистика */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 28 }}>
                <div style={{ background: C.amberLight, border: `1px solid ${C.amberBorder}`, borderRadius: 10, padding: "18px 20px", textAlign: "center" }}>
                    <div style={{ color: C.amber, fontWeight: 600, fontSize: 15 }}>{counts.pending} На рассмотрении</div>
                </div>
                <div style={{ background: C.greenLight, border: `1px solid ${C.greenBorder}`, borderRadius: 10, padding: "18px 20px", textAlign: "center" }}>
                    <div style={{ color: C.green, fontWeight: 600, fontSize: 15 }}>{counts.accepted} Принято</div>
                </div>
                <div style={{ background: C.redLight, border: `1px solid ${C.redBorder}`, borderRadius: 10, padding: "18px 20px", textAlign: "center" }}>
                    <div style={{ color: C.red, fontWeight: 600, fontSize: 15 }}>{counts.rejected} Отказано</div>
                </div>
            </div>

            {/* Таблица */}
            <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>

                {/* Заголовок */}
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 1.5fr 1fr", padding: "12px 20px", borderBottom: `1px solid ${C.border}`, background: C.bg }}>
                    {["Кандидат", "Вакансия", "Опыт", "Ожидания", "Статус"].map(h => (
                        <div key={h} style={{ fontSize: 13, color: C.sub, fontWeight: 500 }}>{h}</div>
                    ))}
                </div>

                {list.length === 0 ? (
                    <div style={{ padding: "60px 20px", textAlign: "center", color: C.sub }}>
                        <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>
                        <div>Откликов пока нет</div>
                    </div>
                ) : (
                    list.map((c, i) => {
                        const initials = (c.full_name || "?").split(" ").map(w => w[0]).join("").slice(0, 2);
                        const salary = c.desired_salary
                            ? c.desired_salary.toLocaleString("ru-RU") + " ₽"
                            : "—";
                        const status = c.status || "На рассмотрении";

                        return (
                            <div key={c.id}
                                 style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 1.5fr 1fr", alignItems: "center", padding: "14px 20px", borderBottom: i < list.length - 1 ? `1px solid ${C.border}` : "none", background: "#fff" }}>

                                {/* Кандидат */}
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.border, display: "flex", alignItems: "center", justifyContent: "center", color: C.sub, fontSize: 13, fontWeight: 600, flexShrink: 0 }}>
                                        {initials}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 600, color: C.text, fontSize: 14 }}>{c.full_name}</div>
                                        <div style={{ fontSize: 12, color: C.sub }}>{c.email}</div>
                                    </div>
                                </div>

                                {/* Вакансия */}
                                <div style={{ fontSize: 14, color: C.text }}>{c.vacancy_title || "—"}</div>

                                {/* Опыт */}
                                <div style={{ fontSize: 14, color: C.text }}>{c.experience || "—"}</div>

                                {/* Ожидания */}
                                <div style={{ fontSize: 14, color: C.green, fontWeight: 500 }}>{salary}</div>

                                {/* Кнопки */}
                                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                    <button
                                        onClick={() => handleUpdateStatus(c.id, "Принято")}
                                        title="Принять"
                                        style={{ width: 32, height: 32, borderRadius: 6, border: `1px solid ${C.greenBorder}`, background: status === "Принято" ? C.green : C.greenLight, color: status === "Принято" ? "#fff" : C.green, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        ✓
                                    </button>
                                    <button
                                        onClick={() => handleUpdateStatus(c.id, "Отказано")}
                                        title="Отказать"
                                        style={{ width: 32, height: 32, borderRadius: 6, border: `1px solid ${C.redBorder}`, background: status === "Отказано" ? C.red : C.redLight, color: status === "Отказано" ? "#fff" : C.red, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        ✕
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}