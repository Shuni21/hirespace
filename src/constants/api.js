// ============================================================
//  constants/api.js — Все запросы к серверу из React
//  Сервер должен работать на http://localhost:3001
// ============================================================

const BASE = "http://localhost:3001/api";

// ── Helpers ────────────────────────────────────────────────
const get  = (url)        => fetch(url).then(r => r.json());
const post = (url, body)  => fetch(url, { method: "POST",  headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).then(r => r.json());
const put  = (url, body)  => fetch(url, { method: "PUT",   headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).then(r => r.json());
const patch = (url, body) => fetch(url, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).then(r => r.json());
const del  = (url)        => fetch(url, { method: "DELETE" }).then(r => r.json());


// ============================================================
//  USERS API
// ============================================================

export const usersApi = {

  // Войти / найти пользователя
  // login({ email, password }) → { id, email, role }
  login: (body) =>
    post(`${BASE}/users/login`, body),

  // Зарегистрироваться
  // register({ email, password, role }) → { id, email, role }
  register: (body) =>
    post(`${BASE}/users/register`, body),

  // Все пользователи
  getAll: () =>
    get(`${BASE}/users`),
};


// ============================================================
//  SEEKERS API
// ============================================================

export const seekersApi = {

  // Все соискатели (с фильтрами)
  // getAll({ specialty, city, gender, application_status, max_salary })
  getAll: (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => { if (v) params.append(k, v); });
    return get(`${BASE}/seekers?${params.toString()}`);
  },

  // Анкета по user_id (для соискателя — его собственная анкета)
  getByUserId: (user_id) =>
    get(`${BASE}/seekers/by-user/${user_id}`),

  // Анкета по id записи
  getById: (id) =>
    get(`${BASE}/seekers/${id}`),

  // Создать анкету
  // create({ user_id, full_name, age, gender, city, specialty, education, experience, skills, desired_salary })
  create: (body) =>
    post(`${BASE}/seekers`, body),

  // Обновить анкету
  // update(id, { full_name, age, ... })
  update: (id, body) =>
    put(`${BASE}/seekers/${id}`, body),

  // Изменить статус заявки
  // updateStatus(id, 'Принято' | 'Отказано' | 'На рассмотрении')
  updateStatus: (id, application_status) =>
    patch(`${BASE}/seekers/${id}/status`, { application_status }),

  // Удалить анкету
  delete: (id) =>
    del(`${BASE}/seekers/${id}`),
};
