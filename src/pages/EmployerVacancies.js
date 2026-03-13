import { useState, useEffect } from "react";
import { C } from "../constants/colors";

const inp = {
    width: "100%",
    boxSizing: "border-box",
    border: `1px solid ${C.border}`,
    borderRadius: 8,
    padding: "11px 14px",
    fontSize: 14,
    color: C.text,
    background: "#fff",
    outline: "none",
    fontFamily: "inherit"
};

const SKILLS_TAGS = ["React", "Vue", "TypeScript", "JavaScript", "Docker", "Figma", "Agile", "Python", "Go", "Java", "PostgreSQL", "MongoDB", "Git", "SQL", "AWS", "UX Research"];
const SCHEDULES   = ["Любой", "Полный день", "Гибкий график", "Удалённо", "Сменный"];
const EXPERIENCES = ["Любой", "Без опыта", "До 1 года", "1–3 года", "3–6 лет", "6–10 лет", "10+ лет"];

const emptyForm = {
    title: "",
    company: "",
    salary: "",
    city: "",
    schedule: "Любой",
    experience: "Любой",
    skills: [],
};

export default function EmployerVacancies() {

    const [vacancies, setVacancies] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        loadVacancies();
    }, []);

    const loadVacancies = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            const res = await fetch(`http://localhost:3001/api/vacancies/my/${user.id}`);
            const data = await res.json();
            setVacancies(data);
        } catch (err) {
            console.error(err);
        }
    };

    const set = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const toggleSkill = (skill) => {
        setForm(prev => ({
            ...prev,
            skills: prev.skills.includes(skill)
                ? prev.skills.filter(s => s !== skill)
                : [...prev.skills, skill]
        }));
    };

    const startEdit = (vacancy) => {
        setForm({
            title:      vacancy.title      || "",
            company:    vacancy.company    || "",
            salary:     vacancy.salary     || "",
            city:       vacancy.city       || "",
            schedule:   vacancy.schedule   || "Любой",
            experience: vacancy.experience || "Любой",
            skills:     vacancy.skills ? vacancy.skills.split(",") : [],
        });
        setEditId(vacancy.id);
        setShowForm(true);
    };

    const save = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            const method = editId ? "PUT" : "POST";
            const url = editId
                ? `http://localhost:3001/api/vacancies/${editId}`
                : "http://localhost:3001/api/vacancies";

            await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    employer_id: user.id,
                    title:      form.title,
                    company:    form.company,
                    salary:     form.salary ? parseInt(form.salary) : null,
                    city:       form.city,
                    schedule:   form.schedule   !== "Любой" ? form.schedule   : null,
                    experience: form.experience !== "Любой" ? form.experience : null,
                    skills:     form.skills.join(",")
                })
            });

            setForm(emptyForm);
            setEditId(null);
            setShowForm(false);
            loadVacancies();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={{ maxWidth: 840, margin: "0 auto", padding: "40px 24px", fontFamily: "'Inter','Segoe UI',sans-serif" }}>

            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
                <div>
                    <h2 style={{ fontSize: 24, fontWeight: 700, color: C.text, marginBottom: 4 }}>
                        Мои вакансии
                    </h2>
                    <p style={{ color: C.sub, fontSize: 14 }}>
                        {vacancies.length} активных вакансий
                    </p>
                </div>

                <button
                    onClick={() => { setShowForm(s => !s); setForm(emptyForm); setEditId(null); }}
                    style={{
                        background: C.primary,
                        border: "none",
                        borderRadius: 8,
                        padding: "12px 20px",
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: 14,
                        cursor: "pointer",
                        fontFamily: "inherit",
                        whiteSpace: "nowrap"
                    }}
                >
                    + Добавить вакансию
                </button>
            </div>

            {showForm && (
                <div style={{ background: "#fff", border: `2px solid ${C.primary}`, borderRadius: 12, padding: "24px 28px", marginBottom: 20 }}>
                    <div style={{ fontWeight: 600, fontSize: 15, color: C.text, marginBottom: 20 }}>
                        {editId ? "Редактировать вакансию" : "Новая вакансия"}
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                        <div>
                            <div style={{ fontSize: 13, marginBottom: 6 }}>Должность</div>
                            <input style={inp} value={form.title} onChange={e => set("title", e.target.value)} />
                        </div>

                        <div>
                            <div style={{ fontSize: 13, marginBottom: 6 }}>Компания</div>
                            <input style={inp} value={form.company} onChange={e => set("company", e.target.value)} />
                        </div>

                        <div>
                            <div style={{ fontSize: 13, marginBottom: 6 }}>Зарплата</div>
                            <input style={inp} value={form.salary} onChange={e => set("salary", e.target.value)} type="number" />
                        </div>

                        <div>
                            <div style={{ fontSize: 13, marginBottom: 6 }}>Город</div>
                            <input style={inp} value={form.city} onChange={e => set("city", e.target.value)} />
                        </div>

                        <div>
                            <div style={{ fontSize: 13, marginBottom: 6 }}>График</div>
                            <select style={inp} value={form.schedule} onChange={e => set("schedule", e.target.value)}>
                                {SCHEDULES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>

                        <div>
                            <div style={{ fontSize: 13, marginBottom: 6 }}>Опыт работы</div>
                            <select style={inp} value={form.experience} onChange={e => set("experience", e.target.value)}>
                                {EXPERIENCES.map(exp => <option key={exp} value={exp}>{exp}</option>)}
                            </select>
                        </div>

                        <div style={{ gridColumn: "1 / -1" }}>
                            <div style={{ fontSize: 13, marginBottom: 6 }}>Навыки</div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                                {SKILLS_TAGS.map(skill => (
                                    <button
                                        key={skill}
                                        type="button"
                                        onClick={() => toggleSkill(skill)}
                                        style={{
                                            padding: "6px 12px",
                                            borderRadius: 8,
                                            border: form.skills.includes(skill) ? `1px solid ${C.primary}` : `1px solid ${C.border}`,
                                            background: form.skills.includes(skill) ? C.primary : "#fff",
                                            color: form.skills.includes(skill) ? "#fff" : C.text,
                                            cursor: "pointer",
                                            fontSize: 13
                                        }}
                                    >
                                        {skill}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div style={{ display: "flex", gap: 12 }}>
                        <button
                            onClick={save}
                            style={{ background: C.primary, border: "none", borderRadius: 8, padding: "11px 24px", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" }}
                        >
                            {editId ? "Сохранить" : "Опубликовать"}
                        </button>

                        <button
                            onClick={() => { setShowForm(false); setEditId(null); setForm(emptyForm); }}
                            style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 8, padding: "11px 24px", color: C.sub, fontSize: 14, cursor: "pointer" }}
                        >
                            Отмена
                        </button>
                    </div>
                </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {vacancies.map(v => (
                    <div key={v.id} style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 12, padding: "18px 20px", display: "flex", alignItems: "center", gap: 16 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 10, background: C.border, flexShrink: 0 }} />

                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600, fontSize: 15, color: C.text, marginBottom: 4 }}>{v.title}</div>
                            <div style={{ fontSize: 13, color: C.sub, display: "flex", gap: 12 }}>
                                <span>{v.salary ? `${Number(v.salary).toLocaleString("ru-RU")} руб.` : "Зарплата не указана"}</span>
                                <span>{v.city}</span>
                                <span>{v.experience}</span>
                            </div>
                            <div style={{ fontSize: 12, color: C.sub, marginTop: 4 }}>
                                Навыки: {v.skills || "—"}
                            </div>
                        </div>

                        <button
                            onClick={() => startEdit(v)}
                            style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 18px", color: C.text, fontSize: 13, cursor: "pointer" }}
                        >
                            Редактировать
                        </button>
                    </div>
                ))}
            </div>

        </div>
    );
}