// ============================================================
//  server.js — Express API сервер
//  Все запросы к БД через этот файл
//  Запуск: node server.js
// ============================================================

const express = require("express");
const cors = require("cors");
const pool = require("./db");


const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());


// ============================================================
//  USERS
// ============================================================

// Регистрация нового пользователя
// POST /api/users/register
// Body: { email, password, role }
app.post("/api/users/register", async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO users (email, password, role)
       VALUES ($1, $2, $3)
       RETURNING id, email, role`,
      [email, password, role]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Вход (найти пользователя по почте)
// POST /api/users/login
// Body: { email, password }
app.post("/api/users/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query(
      `SELECT id, email, role FROM users
       WHERE email = $1 AND password = $2`,
      [email, password]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Неверная почта или пароль" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Получить всех пользователей
// GET /api/users
app.get("/api/users", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, email, role FROM users ORDER BY role`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ============================================================
//  SEEKERS — Соискатели
// ============================================================

// Получить всех соискателей (для поиска работодателем)
// GET /api/seekers
// Query params: specialty, city, gender, application_status, max_salary
app.get("/api/seekers", async (req, res) => {
  const { specialty, city, gender, application_status, max_salary } = req.query;

  let query  = `SELECT s.*, u.email FROM seekers s JOIN users u ON u.id = s.user_id WHERE 1=1`;
  const params = [];
  let i = 1;

  if (specialty)           { query += ` AND s.specialty = $${i++}`;           params.push(specialty); }
  if (city)                { query += ` AND s.city = $${i++}`;                params.push(city); }
  if (gender)              { query += ` AND s.gender = $${i++}`;              params.push(gender); }
  if (application_status)  { query += ` AND s.application_status = $${i++}`;  params.push(application_status); }
  if (max_salary)          { query += ` AND s.desired_salary <= $${i++}`;     params.push(parseInt(max_salary)); }

  query += ` ORDER BY s.full_name`;

  try {
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Получить анкету одного соискателя по user_id
// GET /api/seekers/by-user/:user_id
app.get("/api/seekers/by-user/:user_id", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.*, u.email FROM seekers s
       JOIN users u ON u.id = s.user_id
       WHERE s.user_id = $1`,
      [req.params.user_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Анкета не найдена" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Получить соискателя по id анкеты
// GET /api/seekers/:id
app.get("/api/seekers/:id", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.*, u.email FROM seekers s
       JOIN users u ON u.id = s.user_id
       WHERE s.id = $1`,
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Соискатель не найден" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Создать анкету соискателя
// POST /api/seekers
// Body: { user_id, full_name, age, gender, city, specialty, education, experience, skills, desired_salary }
app.post("/api/seekers", async (req, res) => {
  const {
    user_id, full_name, age, gender, city,
    specialty, education, experience, skills, desired_salary,
    phone, email // 1. Добавили новые поля из тела запроса
  } = req.body;

  try {
    const result = await pool.query(
        `INSERT INTO seekers
         (user_id, full_name, age, gender, city, specialty, education, experience, skills, desired_salary, phone, email)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
           RETURNING *`,
        [
          user_id, full_name, age, gender, city,
          specialty, education, experience, skills, desired_salary,
          phone, email
        ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Обновить анкету соискателя
// PUT /api/seekers/:id
// Body: любые поля для обновления
app.put("/api/seekers/:id", async (req, res) => {
  const {
    user_id, full_name, age, gender, city,
    specialty, education, experience, skills, desired_salary,
    phone, email
  } = req.body;
  try {
    const result = await pool.query(
        `UPDATE seekers SET
                          full_name       = COALESCE($1, full_name),
                          age             = COALESCE($2, age),
                          gender          = COALESCE($3, gender),
                          city            = COALESCE($4, city),
                          specialty       = COALESCE($5, specialty),
                          education       = COALESCE($6, education),
                          experience      = COALESCE($7, experience),
                          skills          = COALESCE($8, skills),
                          desired_salary  = COALESCE($9, desired_salary),
                          phone           = COALESCE($10, phone),
                          email           = COALESCE($11, email)
         WHERE id = $12
           RETURNING *`,
        [
          full_name,
          age,
          gender,
          city,
          specialty,
          education,
          experience,
          skills,
          desired_salary,
          phone,
          email,
          req.params.id
        ]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Соискатель не найден" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Обновить статус заявки
// PATCH /api/seekers/:id/status
// Body: { application_status }
app.patch("/api/seekers/:id/status", async (req, res) => {
  const { application_status } = req.body;
  try {
    const result = await pool.query(
      `UPDATE seekers SET application_status = $1
       WHERE id = $2
       RETURNING id, full_name, application_status`,
      [application_status, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Соискатель не найден" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Удалить анкету соискателя
// DELETE /api/seekers/:id
app.delete("/api/seekers/:id", async (req, res) => {
  try {
    await pool.query(`DELETE FROM seekers WHERE id = $1`, [req.params.id]);
    res.json({ message: "Анкета удалена" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ============================================================
//  VACANCIES — CRUD
// ============================================================

// Получить все вакансии (опционально фильтр по employer_id)
// GET /api/vacancies?employer_id=UUID
app.get("/api/vacancies", async (req, res) => {
    const { employer_id } = req.query;
    try {
        let query = `SELECT * FROM vacancies`;
        const params = [];

        if (employer_id) {
            query += ` WHERE employer_id = $1`;
            params.push(employer_id);
        }

        query += ` ORDER BY created_at DESC`;

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Создать вакансию
// POST /api/vacancies
// Body: { employer_id, title, company, city, salary, description }
app.post("/api/vacancies", async (req, res) => {
    const { employer_id, title, company, city, salary, description } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO vacancies (employer_id, title, company, city, salary, description)
             VALUES ($1, $2, $3, $4, $5, $6)
                 RETURNING *`,
            [employer_id, title, company, city, salary ? parseInt(salary) : null, description]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Обновить вакансию
// PUT /api/vacancies/:id
app.put("/api/vacancies", async (req, res) => {
    const { title, company, city, salary, description } = req.body;
    try {
        const result = await pool.query(
            `UPDATE vacancies SET
        title       = COALESCE($1, title),
        company     = COALESCE($2, company),
        city        = COALESCE($3, city),
        salary      = COALESCE($4, salary),
        description = COALESCE($5, description)
       WHERE id = $6
       RETURNING *`,
            [title, company, city, salary ? parseInt(salary) : null, description, req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Вакансия не найдена" });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Удалить вакансию
// DELETE /api/vacancies/:id
app.delete("/api/vacancies/:id", async (req, res) => {
    try {
        await pool.query(`DELETE FROM vacancies WHERE id = $1`, [req.params.id]);
        res.json({ message: "Вакансия удалена" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// ============================================================
//  Запуск сервера
// ============================================================

app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен: http://localhost:${PORT}`);
});