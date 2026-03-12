import { useState, useEffect } from "react";
import { C } from "../constants/colors";
import { seekersApi } from "../constants/api";

const SPECIALTIES = ["Frontend Developer","Backend Developer","Product Designer","Data Engineer","Product Manager","QA Engineer","DevOps Engineer","iOS Developer","Android Developer"];
const CITIES      = ["Москва","Санкт-Петербург","Казань","Новосибирск","Екатеринбург","Удалённо"];
const EDUCATIONS  = ["Высшее","Незаконченное высшее","Среднее специальное","Среднее"];
const GENDERS     = ["Мужской","Женский"];
const EXP_OPTS    = ["Без опыта","До 1 года","1–3 года","3–6 лет","6–10 лет","10+ лет"];
const SCHEDULES   = ["Полный день","Гибкий график","Удалённо","Сменный"];
const SKILLS_ALL  = ["React","Vue","TypeScript","JavaScript","Docker","Figma","Agile","Python","Go","Java","PostgreSQL","MongoDB","Git","SQL","AWS","UX Research"];

const inp = {
  width: "100%", boxSizing: "border-box", border: `1px solid ${C.border}`,
  borderRadius: 8, padding: "11px 14px", fontSize: 14, color: C.text,
  background: "#fff", outline: "none", fontFamily: "inherit",
};

const Inp = ({ label, required, ...props }) => (
  <div>
    <div style={{ fontSize: 13, color: C.text, marginBottom: 6 }}>
      {label}{required && <span style={{ color: C.red }}>*</span>}
    </div>
    <input style={inp} {...props} />
  </div>
);

const Sel = ({ label, required, value, onChange, options }) => (
  <div>
    <div style={{ fontSize: 13, color: C.text, marginBottom: 6 }}>
      {label}{required && <span style={{ color: C.red }}>*</span>}
    </div>
    <select value={value} onChange={e => onChange(e.target.value)}
      style={{ ...inp, cursor: "pointer", appearance: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236B7280' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center", paddingRight: 36 }}>
      <option value="">Выберите...</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

const Section = ({ number, title, children }) => (
  <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 12, padding: "24px 28px", marginBottom: 16 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
      <div style={{ width: 28, height: 28, borderRadius: "50%", background: C.primaryLight, color: C.primary, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{number}</div>
      <div style={{ fontWeight: 600, fontSize: 15, color: C.text }}>{title}</div>
    </div>
    {children}
  </div>
);

const Grid2 = ({ children }) => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>{children}</div>
);

export default function SeekerApplyForm({ currentUser, onProfileLoaded }) {
  const empty = {
    full_name: "", age: "", gender: "", city: "",
    specialty: "", schedule: "", salary_from: "", salary_to: "",
    experience: "", education: "", skills: "",
    phone: "", email: currentUser?.email || "",
  };

  const [form,      setForm]      = useState(empty);
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [savedOk,   setSavedOk]   = useState(false);
  const [seekerId,  setSeekerId]  = useState(null);

  useEffect(() => {
    if (!currentUser?.id) { setLoading(false); return; }
    seekersApi.getByUserId(currentUser.id)
      .then(data => {
        const skills = data.skills || "";
        setForm({
          full_name:    data.full_name    || "",
          age:          String(data.age   || ""),
          gender:       data.gender       || "",
          city:         data.city         || "",
          specialty:    data.specialty    || "",
          schedule:     data.schedule     || "",
          salary_from:  String(data.desired_salary || ""),
          salary_to:    "",
          experience:   data.experience   || "",
          education:    data.education    || "",
          skills,
          phone:        data.phone        || "",
          email:        currentUser?.email || "",
        });
        setSeekerId(data.id);
        if (onProfileLoaded) onProfileLoaded(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [currentUser?.id]);

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setSavedOk(false); };

  const toggleSkill = (s) => {
    const arr = form.skills ? form.skills.split(", ").filter(Boolean) : [];
    const next = arr.includes(s) ? arr.filter(x => x !== s) : [...arr, s];
    set("skills", next.join(", "));
  };

  const selectedSkills = form.skills ? form.skills.split(", ").filter(Boolean) : [];

  const clear = () => { setForm(empty); setSavedOk(false); };

    const submit = async () => {
        console.log(form);
        if (!form.full_name || !form.age || !form.gender || !form.email || !form.city || !form.specialty) {
            alert("Заполните все обязательные поля: ФИО, возраст, пол, email, город, вакансия");
            return;
        }
        setSaving(true);
        const body = {
            user_id:        currentUser?.id,
            full_name:      form.full_name,
            age:            parseInt(form.age) || 0,
            gender:         form.gender,
            city:           form.city,
            specialty:      form.specialty,
            education:      form.education || null,
            experience:     form.experience || null,
            skills:         form.skills || null,
            desired_salary: parseInt(form.salary_from) || null,
            phone:          form.phone || null,
            schedule:       form.schedule || null,
        };
        try {
            const result = seekerId
                ? await seekersApi.update(seekerId, body)
                : await seekersApi.create(body);
            if (result.error) {
                alert("Ошибка: " + result.error);
                return;
            }
            setSeekerId(result.id);
            setSavedOk(true);
            if (onProfileLoaded) onProfileLoaded(result);
        } catch (err) {
            alert("Ошибка сохранения: " + err.message);
        } finally {
            setSaving(false);
        }
    };

  if (loading) return (
    <div style={{ textAlign: "center", padding: "80px 0", color: C.muted, fontFamily: "inherit" }}>
      Загрузка анкеты...
    </div>
  );

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "40px 24px", fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, color: C.text, marginBottom: 4 }}>Анкета соискателя</h2>
      <p style={{ color: C.sub, fontSize: 14, marginBottom: 28 }}>Заполните форму</p>

      {/* 1. Личные данные */}
      <Section number="1" title="Личные данные">
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Inp label="ФИО" required placeholder="Алексей Алексеевич" value={form.full_name} onChange={e => set("full_name", e.target.value)} />
          <Grid2>
            <Inp label="Возраст" required type="number" placeholder="26" value={form.age} onChange={e => set("age", e.target.value)} />
            <Sel label="Пол" required value={form.gender} onChange={v => set("gender", v)} options={GENDERS} />
          </Grid2>
          <Grid2>
            <Inp label="Телефон" placeholder="+7 (999) 000-00-00" value={form.phone} onChange={e => set("phone", e.target.value)} />
            <Inp label="EMAIL" required type="email" placeholder="test@yandex.ru" value={form.email} onChange={e => set("email", e.target.value)} />
          </Grid2>
          <div style={{ maxWidth: 340 }}>
            <Inp label="Город проживания" required placeholder="Введите город" value={form.city} onChange={e => set("city", e.target.value)} />
          </div>
        </div>
      </Section>

      {/* 2. Желаемая должность */}
      <Section number="2" title="Желаемая должность">
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Sel label="Желаемая вакансия" required value={form.specialty} onChange={v => set("specialty", v)} options={SPECIALTIES} />
          <Sel label="График работы" value={form.schedule} onChange={v => set("schedule", v)} options={SCHEDULES} />
          <Inp label="Зарплата от (₽)" type="number" placeholder="100 000 - 200 000₽" value={form.salary_from} onChange={e => set("salary_from", e.target.value)} />
        </div>
      </Section>

      {/* 3. Опыт и образование */}
      <Section number="3" title="Опыт и образование">
        <Grid2>
          <Sel label="Опыт работы" value={form.experience} onChange={v => set("experience", v)} options={EXP_OPTS} />
          <Sel label="Образование" value={form.education}  onChange={v => set("education",  v)} options={EDUCATIONS} />
        </Grid2>
      </Section>

      {/* 4. Ключевые навыки */}
      <Section number="4" title="Ключевые навыки">
        <div style={{ fontSize: 13, color: C.sub, marginBottom: 12 }}>Выберите навыки из списка</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
          {SKILLS_ALL.map(s => {
            const active = selectedSkills.includes(s);
            return (
              <div key={s} onClick={() => toggleSkill(s)}
                style={{ padding: "6px 14px", borderRadius: 8, fontSize: 13, cursor: "pointer", border: `1px solid ${active ? C.primary : C.border}`, background: active ? C.primaryLight : "#fff", color: active ? C.primary : C.text, display: "flex", alignItems: "center", gap: 6, transition: "all .12s" }}>
                {active && <span style={{ fontSize: 11 }}>✓</span>}
                {s}
              </div>
            );
          })}
        </div>
        {selectedSkills.length > 0 && (
          <div style={{ background: C.bg, borderRadius: 8, padding: "10px 14px", fontSize: 13, color: C.sub, display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <span>Выбрано:</span>
            {selectedSkills.map(s => (
              <span key={s} style={{ background: C.primaryLight, color: C.primary, borderRadius: 6, padding: "2px 10px", fontWeight: 500 }}>{s}</span>
            ))}
          </div>
        )}
      </Section>

      {/* Кнопки */}
      <div style={{ display: "flex", gap: 12 }}>
        <button onClick={submit} disabled={saving}
          style={{ background: C.primary, border: "none", borderRadius: 8, padding: "13px 28px", color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: "inherit" }}>
          {saving ? "Сохраняем..." : "Опубликовать анкету"}
        </button>
        <button onClick={clear}
          style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 8, padding: "13px 28px", color: C.sub, fontWeight: 500, fontSize: 15, cursor: "pointer", fontFamily: "inherit" }}>
          Очистить форму
        </button>
        {savedOk && <span style={{ color: C.green, fontSize: 14, fontWeight: 600, alignSelf: "center" }}>✓ Сохранено</span>}
      </div>
    </div>
  );
}
