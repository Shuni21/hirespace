// ============================================================
//  server.js — Express API сервер HireSpace
// ============================================================

const express = require("express");
const cors    = require("cors");
const pool    = require("./db");

const app  = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());


// ============================================================
//  USERS — Пользователи
// ============================================================

// Регистрация
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

// Вход
app.post("/api/users/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query(
      `SELECT id, email, role FROM users WHERE email = $1 AND password = $2`,
      [email, password]
    );
    if (result.rows.length === 0)
      return res.status(401).json({ error: "Неверная почта или пароль" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Список всех пользователей
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

// Все соискатели (с фильтрами)
app.get("/api/seekers", async (req, res) => {
  const { specialty, city, gender, application_status, max_salary } = req.query;

  let query  = `SELECT s.*, u.email FROM seekers s JOIN users u ON u.id = s.user_id WHERE 1=1`;
  const params = [];
  let i = 1;

  if (specialty)          { query += ` AND s.specialty = $${i++}`;          params.push(specialty); }
  if (city)               { query += ` AND s.city = $${i++}`;               params.push(city); }
  if (gender)             { query += ` AND s.gender = $${i++}`;             params.push(gender); }
  if (application_status) { query += ` AND s.application_status = $${i++}`; params.push(application_status); }
  if (max_salary)         { query += ` AND s.desired_salary <= $${i++}`;    params.push(parseInt(max_salary)); }

  query += ` ORDER BY s.full_name`;

  try {
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Анкета по user_id
app.get("/api/seekers/by-user/:user_id", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.*, u.email FROM seekers s JOIN users u ON u.id = s.user_id WHERE s.user_id = $1`,
      [req.params.user_id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Анкета не найдена" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Анкета по id соискателя
app.get("/api/seekers/:id", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.*, u.email FROM seekers s JOIN users u ON u.id = s.user_id WHERE s.id = $1`,
      [req.params.id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Соискатель не найден" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Создать анкету
app.post("/api/seekers", async (req, res) => {
  const {
    user_id, full_name, age, gender, city,
    specialty, education, experience, skills, desired_salary
  } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO seekers
         (user_id, full_name, age, gender, city, specialty, education, experience, skills, desired_salary)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       RETURNING *`,
      [user_id, full_name, age, gender, city, specialty, education, experience, skills, desired_salary]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Обновить анкету
app.put("/api/seekers/:id", async (req, res) => {
  const {
    full_name, age, gender, city,
    specialty, education, experience, skills, desired_salary
  } = req.body;
  try {
    const result = await pool.query(
      `UPDATE seekers
       SET full_name=$1, age=$2, gender=$3, city=$4, specialty=$5,
           education=$6, experience=$7, skills=$8, desired_salary=$9
       WHERE id = $10
       RETURNING *`,
      [full_name, age, gender, city, specialty, education, experience, skills, desired_salary, req.params.id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Соискатель не найден" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Изменить статус заявки
app.patch("/api/seekers/:id/status", async (req, res) => {
  const { application_status } = req.body;
  try {
    const result = await pool.query(
      `UPDATE seekers SET application_status = $1 WHERE id = $2
       RETURNING id, full_name, application_status`,
      [application_status, req.params.id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Соискатель не найден" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Удалить анкету
app.delete("/api/seekers/:id", async (req, res) => {
  try {
    await pool.query(`DELETE FROM seekers WHERE id = $1`, [req.params.id]);
    res.json({ message: "Анкета удалена" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// ============================================================
// VACANCIES
// ============================================================

// все вакансии
app.get("/api/vacancies", async (req, res) => {
  try {
    const result = await pool.query(
        "SELECT * FROM vacancies ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// вакансии работодателя
app.get("/api/vacancies/my/:user_id", async (req, res) => {
  try {
    const result = await pool.query(
        "SELECT * FROM vacancies WHERE user_id=$1 ORDER BY created_at DESC",
        [req.params.user_id]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// создать вакансию
app.post("/api/vacancies", async (req, res) => {
  const {
    user_id,
    title,
    company,
    city,
    salary_from,
    salary_to,
    schedule,
    description
  } = req.body;

  try {
    const result = await pool.query(
        `INSERT INTO vacancies
       (user_id,title,company,city,salary_from,salary_to,schedule,description)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING *`,
        [user_id,title,company,city,salary_from,salary_to,schedule,description]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// удалить
app.delete("/api/vacancies/:id", async (req, res) => {
  try {
    await pool.query(
        "DELETE FROM vacancies WHERE id=$1",
        [req.params.id]
    );

    res.json({ message: "Удалено" });
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
