import { useState, useEffect } from "react";
import { C } from "../constants/colors";
import { vacanciesApi } from "../constants/api";

const SCHEDULES  = ["Полный день","Гибкий график","Удалённо","Сменный"];
const inp = { width: "100%", boxSizing: "border-box", border: `1px solid ${C.border}`, borderRadius: 8, padding: "11px 14px", fontSize: 14, color: C.text, background: "#fff", outline: "none", fontFamily: "inherit" };
const Inp = ({ label, ...props }) => (
  <div>
    <div style={{ fontSize: 13, color: C.text, marginBottom: 6 }}>{label}</div>
    <input style={inp} {...props} />
  </div>
);
const fmtSalary = (from, to) => {
  if (from && to) return `${Number(from).toLocaleString("ru-RU")} - ${Number(to).toLocaleString("ru-RU")} ₽`;
  if (from)       return `от ${Number(from).toLocaleString("ru-RU")} ₽`;
  if (to)         return `до ${Number(to).toLocaleString("ru-RU")} ₽`;
  return "—";
};

const empty = { title: "", company: "", city: "", salary_from: "", salary_to: "", schedule: "", description: "" };

export default function EmployerVacancies({ currentUser }) {
  const [vacancies, setVacancies] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [showForm,  setShowForm]  = useState(false);
  const [form,      setForm]      = useState(empty);
  const [editId,    setEditId]    = useState(null);
  const [saving,    setSaving]    = useState(false);

  useEffect(() => {
    if (!currentUser?.id) return;
    vacanciesApi.getMy(currentUser.id)
      .then(data => setVacancies(Array.isArray(data) ? data : []))
      .catch(() => setVacancies([]))
      .finally(() => setLoading(false));
  }, [currentUser?.id]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const openNew = () => { setForm(empty); setEditId(null); setShowForm(true); };

  const openEdit = (v) => {
    setForm({ title: v.title, company: v.company||"", city: v.city||"", salary_from: v.salary_from||"", salary_to: v.salary_to||"", schedule: v.schedule||"", description: v.description||"" });
    setEditId(v.id);
    setShowForm(true);
  };

  const save = async () => {
    if (!form.title) return;
    setSaving(true);
    try {
      const body = { ...form, user_id: currentUser?.id, salary_from: parseInt(form.salary_from)||0, salary_to: parseInt(form.salary_to)||0 };
      if (editId) {
        const updated = await vacanciesApi.update(editId, body);
        setVacancies(vs => vs.map(v => v.id === editId ? updated : v));
      } else {
        const created = await vacanciesApi.create(body);
        setVacancies(vs => [created, ...vs]);
      }
      setShowForm(false); setEditId(null); setForm(empty);
    } catch (e) { alert("Ошибка: " + e.message); }
    finally { setSaving(false); }
  };

  const remove = async (id) => {
    if (!window.confirm("Удалить вакансию?")) return;
    await vacanciesApi.delete(id);
    setVacancies(vs => vs.filter(v => v.id !== id));
  };

  return (
    <div style={{ maxWidth: 840, margin: "0 auto", padding: "40px 24px", fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: C.text, marginBottom: 4 }}>Мои вакансии</h2>
          <p style={{ color: C.sub, fontSize: 14 }}>{vacancies.length} активных вакансий</p>
        </div>
        <button onClick={openNew}
          style={{ background: C.primary, border: "none", borderRadius: 8, padding: "12px 20px", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
          + Добавить вакансию
        </button>
      </div>

      {/* Форма */}
      {showForm && (
        <div style={{ background: "#fff", border: `2px solid ${C.primary}`, borderRadius: 12, padding: "24px 28px", marginBottom: 20 }}>
          <div style={{ fontWeight: 600, fontSize: 15, color: C.text, marginBottom: 20 }}>
            {editId ? "Редактировать вакансию" : "Новая вакансия"}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <Inp label="Должность"  value={form.title}       onChange={e => set("title",       e.target.value)} />
            <Inp label="Компания"   value={form.company}     onChange={e => set("company",     e.target.value)} />
            <Inp label="Зарплата от (₽)" type="number" value={form.salary_from} onChange={e => set("salary_from", e.target.value)} />
            <Inp label="Зарплата до (₽)" type="number" value={form.salary_to}   onChange={e => set("salary_to",   e.target.value)} />
            <Inp label="Город"      value={form.city}        onChange={e => set("city",        e.target.value)} />
            <div>
              <div style={{ fontSize: 13, color: C.text, marginBottom: 6 }}>График</div>
              <select value={form.schedule} onChange={e => set("schedule", e.target.value)}
                style={{ ...inp, cursor: "pointer" }}>
                <option value="">—</option>
                {SCHEDULES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, color: C.text, marginBottom: 6 }}>Описание</div>
            <textarea value={form.description} onChange={e => set("description", e.target.value)} rows={3}
              style={{ ...inp, resize: "vertical", lineHeight: 1.5 }} />
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={save} disabled={saving}
              style={{ background: C.primary, border: "none", borderRadius: 8, padding: "11px 24px", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
              {saving ? "Сохраняем..." : "Опубликовать"}
            </button>
            <button onClick={() => { setShowForm(false); setEditId(null); }}
              style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 8, padding: "11px 24px", color: C.sub, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
              Отмена
            </button>
          </div>
        </div>
      )}

      {/* Список */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: C.muted }}>Загрузка...</div>
      ) : vacancies.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: C.muted }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>📋</div>
          <div style={{ fontWeight: 600 }}>Вакансий ещё нет</div>
          <div style={{ fontSize: 13, marginTop: 4 }}>Нажмите «+ Добавить вакансию»</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {vacancies.map(v => (
            <div key={v.id} style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 12, padding: "18px 20px", display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: C.border, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 15, color: C.text, marginBottom: 4 }}>{v.title}</div>
                <div style={{ fontSize: 13, color: C.sub, display: "flex", gap: 12 }}>
                  <span>{fmtSalary(v.salary_from, v.salary_to)}</span>
                  {v.city     && <span>{v.city}</span>}
                  {v.schedule && <span>{v.schedule}</span>}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => openEdit(v)}
                  style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 18px", color: C.text, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
                  Редактировать
                </button>
                <button onClick={() => remove(v.id)}
                  style={{ background: "#fff", border: `1px solid ${C.redBorder}`, borderRadius: 8, padding: "8px 12px", color: C.red, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
