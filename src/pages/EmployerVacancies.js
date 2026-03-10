import { useState } from "react";
import { C } from "../constants/colors";

const inp = {
  width: "100%", boxSizing: "border-box", border: `1px solid ${C.border}`,
  borderRadius: 8, padding: "11px 14px", fontSize: 14, color: C.text,
  background: "#fff", outline: "none", fontFamily: "inherit",
};

const emptyForm = { title: "", company: "", salary: "", city: "" };

export default function EmployerVacancies() {
  const [vacancies, setVacancies] = useState([
    { id: 1, title: "Senior Frontend Developer", salary: "180 000 - 250 000 ₽", city: "Москва",    type: "Удалённо" },
    { id: 2, title: "Product Designer",          salary: "140 000 - 180 000 ₽", city: "Удалённо",  type: "Удалённо" },
    { id: 3, title: "Backend Developer",         salary: "200 000 - 260 000 ₽", city: "Москва",    type: "Удалённо" },
  ]);
  const [showForm,  setShowForm]  = useState(false);
  const [form,      setForm]      = useState(emptyForm);
  const [editId,    setEditId]    = useState(null);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const save = () => {
    if (!form.title) return;
    if (editId) {
      setVacancies(vs => vs.map(v => v.id === editId ? { ...v, title: form.title, salary: form.salary, city: form.city } : v));
      setEditId(null);
    } else {
      setVacancies(vs => [...vs, { id: Date.now(), title: form.title, salary: form.salary, city: form.city, type: "Удалённо" }]);
    }
    setForm(emptyForm);
    setShowForm(false);
  };

  const startEdit = (v) => {
    setForm({ title: v.title, company: "", salary: v.salary, city: v.city });
    setEditId(v.id);
    setShowForm(true);
  };

  return (
    <div style={{ maxWidth: 840, margin: "0 auto", padding: "40px 24px", fontFamily: "'Inter','Segoe UI',sans-serif" }}>

      {/* Заголовок */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: C.text, marginBottom: 4 }}>Мои вакансии</h2>
          <p style={{ color: C.sub, fontSize: 14 }}>{vacancies.length} активных вакансий</p>
        </div>
        <button onClick={() => { setShowForm(s => !s); setForm(emptyForm); setEditId(null); }}
          style={{ background: C.primary, border: "none", borderRadius: 8, padding: "12px 20px", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
          + Добавить вакансию
        </button>
      </div>

      {/* Форма добавления / редактирования */}
      {showForm && (
        <div style={{ background: "#fff", border: `2px solid ${C.primary}`, borderRadius: 12, padding: "24px 28px", marginBottom: 20 }}>
          <div style={{ fontWeight: 600, fontSize: 15, color: C.text, marginBottom: 20 }}>
            {editId ? "Редактировать вакансию" : "Новая вакансия"}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 13, color: C.text, marginBottom: 6 }}>Должность</div>
              <input style={inp} placeholder="" value={form.title}   onChange={e => set("title",   e.target.value)} />
            </div>
            <div>
              <div style={{ fontSize: 13, color: C.text, marginBottom: 6 }}>Компания</div>
              <input style={inp} placeholder="" value={form.company} onChange={e => set("company", e.target.value)} />
            </div>
            <div>
              <div style={{ fontSize: 13, color: C.text, marginBottom: 6 }}>Зарплата</div>
              <input style={inp} placeholder="" value={form.salary}  onChange={e => set("salary",  e.target.value)} />
            </div>
            <div>
              <div style={{ fontSize: 13, color: C.text, marginBottom: 6 }}>Город</div>
              <input style={inp} placeholder="" value={form.city}    onChange={e => set("city",    e.target.value)} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={save}
              style={{ background: C.primary, border: "none", borderRadius: 8, padding: "11px 24px", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
              Опубликовать
            </button>
            <button onClick={() => { setShowForm(false); setEditId(null); setForm(emptyForm); }}
              style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 8, padding: "11px 24px", color: C.sub, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
              Отмена
            </button>
          </div>
        </div>
      )}

      {/* Список вакансий */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {vacancies.map(v => (
          <div key={v.id} style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 12, padding: "18px 20px", display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: C.border, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 15, color: C.text, marginBottom: 4 }}>{v.title}</div>
              <div style={{ fontSize: 13, color: C.sub, display: "flex", gap: 12 }}>
                <span>{v.salary}</span>
                <span>{v.city}</span>
                <span>{v.type}</span>
              </div>
            </div>
            <button onClick={() => startEdit(v)}
              style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 18px", color: C.text, fontSize: 13, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
              Редактировать
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
