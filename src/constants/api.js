const BASE = "http://localhost:3001/api";

const get   = (url)       => fetch(url).then(r => r.json());
const post  = (url, body) => fetch(url, { method: "POST",   headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).then(r => r.json());
const put   = (url, body) => fetch(url, { method: "PUT",    headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).then(r => r.json());
const patch = (url, body) => fetch(url, { method: "PATCH",  headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).then(r => r.json());
const del   = (url)       => fetch(url, { method: "DELETE" }).then(r => r.json());

// ── USERS ────────────────────────────────────────────────────
export const usersApi = {
  login:    (body) => post(`${BASE}/users/login`,    body),
  register: (body) => post(`${BASE}/users/register`, body),
  getAll:   ()     => get(`${BASE}/users`),
};

// ── VACANCIES ────────────────────────────────────────────────
export const vacanciesApi = {
  // Все вакансии с фильтрами (для соискателя)
  getAll: (filters = {}) => {
    const p = new URLSearchParams();
    Object.entries(filters).forEach(([k,v]) => { if (v) p.append(k, v); });
    return get(`${BASE}/vacancies?${p.toString()}`);
  },
  // Вакансии конкретного работодателя
  getMy:   (user_id) => get(`${BASE}/vacancies/my/${user_id}`),
  getById: (id)      => get(`${BASE}/vacancies/${id}`),
  create:  (body)    => post(`${BASE}/vacancies`, body),
  update:  (id,body) => put(`${BASE}/vacancies/${id}`, body),
  delete:  (id)      => del(`${BASE}/vacancies/${id}`),
};

// ── APPLICATIONS ─────────────────────────────────────────────
export const applicationsApi = {
  // Откликнуться на вакансию
  apply: (body) => post(`${BASE}/applications`, body),
  // Отклики соискателя
  getBySeeker:   (seeker_id) => get(`${BASE}/applications/seeker/${seeker_id}`),
  // Входящие для работодателя
  getByEmployer: (user_id)   => get(`${BASE}/applications/employer/${user_id}`),
  // Изменить статус отклика
  updateStatus:  (id,status) => patch(`${BASE}/applications/${id}/status`, { status }),
};

// ── SEEKERS ──────────────────────────────────────────────────
export const seekersApi = {
  getAll: (filters = {}) => {
    const p = new URLSearchParams();
    Object.entries(filters).forEach(([k,v]) => { if (v) p.append(k, v); });
    return get(`${BASE}/seekers?${p.toString()}`);
  },
  getByUserId: (user_id) => get(`${BASE}/seekers/by-user/${user_id}`),
  getById:     (id)      => get(`${BASE}/seekers/${id}`),
  create:      (body)    => post(`${BASE}/seekers`, body),
  update:      (id,body) => put(`${BASE}/seekers/${id}`, body),
  updateStatus:(id,status)=> patch(`${BASE}/seekers/${id}/status`, { application_status: status }),
  delete:      (id)      => del(`${BASE}/seekers/${id}`),
};
