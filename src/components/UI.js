import { useState } from "react";
import { C } from "../constants/colors";

export const avatarColor = (name) => {
  const p = [C.primary, "#7C3AED", "#059669", "#D97706", "#DB2777", "#0891B2"];
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) % p.length;
  return p[h];
};

export const Lbl = ({ children, req }) => (
  <div style={{ fontSize: 12, fontWeight: 600, color: C.sub, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.4 }}>
    {children}{req && <span style={{ color: C.red, marginLeft: 2 }}>*</span>}
  </div>
);

export const Inp = ({ value, onChange, placeholder, type = "text" }) => {
  const [f, sf] = useState(false);
  return (
    <input
      type={type} value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder} onFocus={() => sf(true)} onBlur={() => sf(false)}
      style={{ width: "100%", background: C.surface, border: `1.5px solid ${f ? C.borderFocus : C.border}`, borderRadius: 8, padding: "10px 12px", color: C.text, fontSize: 14, outline: "none", boxSizing: "border-box", transition: "border-color .15s" }}
    />
  );
};

export const Sel = ({ value, options, onChange, placeholder }) => {
  const [f, sf] = useState(false);
  return (
    <select
      value={value} onChange={e => onChange(e.target.value)}
      onFocus={() => sf(true)} onBlur={() => sf(false)}
      style={{ width: "100%", background: C.surface, border: `1.5px solid ${f ? C.borderFocus : C.border}`, borderRadius: 8, padding: "10px 12px", color: value ? C.text : C.muted, fontSize: 14, outline: "none", cursor: "pointer" }}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
};

export const Txta = ({ value, onChange, placeholder, rows = 4 }) => {
  const [f, sf] = useState(false);
  return (
    <textarea
      value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder} rows={rows}
      onFocus={() => sf(true)} onBlur={() => sf(false)}
      style={{ width: "100%", background: C.surface, border: `1.5px solid ${f ? C.borderFocus : C.border}`, borderRadius: 8, padding: "10px 12px", color: C.text, fontSize: 14, outline: "none", resize: "none", boxSizing: "border-box", fontFamily: "inherit" }}
    />
  );
};

export const Tag = ({ children }) => (
  <span style={{ background: C.tagBg, color: C.tagText, border: `1px solid ${C.border}`, borderRadius: 6, padding: "3px 10px", fontSize: 12, fontWeight: 500 }}>
    {children}
  </span>
);

export const StatusBadge = ({ status }) => {
  const cfg = {
    pending:  { label: "На рассмотрении", bg: C.amberLight, color: C.amber, border: C.amberBorder },
    accepted: { label: "Приглашён",        bg: C.greenLight, color: C.green, border: C.greenBorder },
    rejected: { label: "Отказ",            bg: C.redLight,   color: C.red,   border: C.redBorder   },
    active:   { label: "Активно ищет",     bg: C.greenLight, color: C.green, border: C.greenBorder },
    consider: { label: "Рассматривает",    bg: C.amberLight, color: C.amber, border: C.amberBorder },
  }[status] || {};
  return (
    <span style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`, borderRadius: 6, padding: "3px 10px", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>
      {cfg.label}
    </span>
  );
};

export const Divider = () => <div style={{ height: 1, background: C.border }} />;

export const SecHead = ({ num, title }) => (
  <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
    <span style={{ background: C.primaryLight, color: C.primary, borderRadius: 6, width: 24, height: 24, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, flexShrink: 0 }}>
      {num}
    </span>
    {title}
  </div>
);

export const AvatarCircle = ({ avatar, name, size = 46 }) => {
  const color = avatarColor(name);
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: color + "15", border: `2px solid ${color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.3, fontWeight: 800, color, flexShrink: 0 }}>
      {avatar}
    </div>
  );
};
