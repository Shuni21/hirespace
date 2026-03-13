// ============================================================
//  server.js — Express API сервер
// ============================================================

const express = require("express");
const cors    = require("cors");
const pool    = require("./db");

const app  = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    console.log(`➡️  ${req.method} ${req.url}`, req.body);
    next();
});

// ============================================================
//  USERS
// ============================================================

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

app.get("/api/users", async (req, res) => {
    try {
        const result = await pool.query(`SELECT id, email, role FROM users ORDER BY role`);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// ============================================================
//  SEEKERS
// ============================================================

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

app.get("/api/seekers/by-user/:user_id", async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT s.*, u.email FROM seekers s
       JOIN users u ON u.id = s.user_id
       WHERE s.user_id = $1`,
            [req.params.user_id]
        );
        if (result.rows.length === 0)
            return res.status(404).json({ error: "Анкета не найдена" });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/api/seekers/:id", async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT s.*, u.email FROM seekers s
       JOIN users u ON u.id = s.user_id
       WHERE s.id = $1`,
            [req.params.id]
        );
        if (result.rows.length === 0)
            return res.status(404).json({ error: "Соискатель не найден" });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post("/api/seekers", async (req, res) => {
    const {
        user_id, full_name, age, gender, city,
        specialty, education, experience, skills, desired_salary,
        phone, schedule,
    } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO seekers
         (user_id, full_name, age, gender, city, specialty, education, experience, skills, desired_salary, phone, schedule)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
       RETURNING *`,
            [user_id, full_name, age || 0, gender, city, specialty, education,
                experience, skills, desired_salary || null, phone || null, schedule || null]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.put("/api/seekers/:id", async (req, res) => {
    const {
        full_name, age, gender, city,
        specialty, education, experience, skills, desired_salary,
        phone, schedule,
    } = req.body;

    try {
        const result = await pool.query(
            `UPDATE seekers SET
         full_name      = COALESCE($1,  full_name),
         age            = COALESCE($2,  age),
         gender         = COALESCE($3,  gender),
         city           = COALESCE($4,  city),
         specialty      = COALESCE($5,  specialty),
         education      = COALESCE($6,  education),
         experience     = COALESCE($7,  experience),
         skills         = COALESCE($8,  skills),
         desired_salary = COALESCE($9,  desired_salary),
         phone          = COALESCE($10, phone),
         schedule       = COALESCE($11, schedule)
       WHERE id = $12
       RETURNING *`,
            [full_name, age || null, gender, city, specialty, education,
                experience, skills, desired_salary || null, phone || null, schedule || null,
                req.params.id]
        );
        if (result.rows.length === 0)
            return res.status(404).json({ error: "Соискатель не найден" });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.patch("/api/seekers/:id/status", async (req, res) => {
    const { application_status } = req.body;
    try {
        const result = await pool.query(
            `UPDATE seekers SET application_status = $1
       WHERE id = $2
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

app.delete("/api/seekers/:id", async (req, res) => {
    try {
        await pool.query(`DELETE FROM seekers WHERE id = $1`, [req.params.id]);
        res.json({ message: "Анкета удалена" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// ============================================================
//  VACANCIES
// ============================================================

app.get("/api/vacancies", async (req, res) => {
    const { title, city, skill, schedule, experience } = req.query;

    let query = `SELECT * FROM vacancies WHERE 1=1`;
    const params = [];
    let i = 1;

    if (title)      { query += ` AND title ILIKE $${i++}`;      params.push(`%${title}%`); }
    if (city)       { query += ` AND city ILIKE $${i++}`;       params.push(`%${city}%`); }
    if (skill)      { query += ` AND skills ILIKE $${i++}`;     params.push(`%${skill}%`); }
    if (schedule)   { query += ` AND schedule = $${i++}`;       params.push(schedule); }
    if (experience) { query += ` AND experience = $${i++}`;     params.push(experience); }

    query += ` ORDER BY created_at DESC`;

    try {
        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.get("/api/vacancies/my/:user_id", async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT * FROM vacancies WHERE employer_id = $1 ORDER BY created_at DESC`,
            [req.params.user_id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.get("/api/vacancies/:id", async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT * FROM vacancies WHERE id = $1`,
            [req.params.id]
        );
        if (result.rows.length === 0)
            return res.status(404).json({ error: "Вакансия не найдена" });
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// ✅ POST — добавлен experience
app.post("/api/vacancies", async (req, res) => {
    const { employer_id, title, company, city, salary, schedule, experience, skills } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO vacancies (employer_id, title, company, city, salary, schedule, experience, skills)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
             RETURNING *`,
            [
                employer_id,
                title,
                company,
                city,
                salary ? parseInt(salary) : null,
                schedule   || null,
                experience || null,
                skills     || null
            ]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
});

// ✅ PUT — добавлен experience
app.put("/api/vacancies/:id", async (req, res) => {
    const { title, company, city, salary, schedule, experience, skills } = req.body;
    try {
        const result = await pool.query(
            `UPDATE vacancies SET
                title      = COALESCE($1, title),
                company    = COALESCE($2, company),
                city       = COALESCE($3, city),
                salary     = COALESCE($4, salary),
                schedule   = COALESCE($5, schedule),
                experience = COALESCE($6, experience),
                skills     = COALESCE($7, skills)
             WHERE id = $8
             RETURNING *`,
            [
                title,
                company,
                city,
                salary ? parseInt(salary) : null,
                schedule   || null,
                experience || null,
                skills     || null,
                req.params.id
            ]
        );
        if (result.rows.length === 0)
            return res.status(404).json({ error: "Вакансия не найдена" });
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
});

app.delete("/api/vacancies/:id", async (req, res) => {
    try {
        await pool.query(`DELETE FROM vacancies WHERE id = $1`, [req.params.id]);
        res.json({ message: "Вакансия удалена" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});


// ============================================================
//  APPLICATIONS
// ============================================================

app.post("/api/applications", async (req, res) => {
    const { vacancy_id, seeker_id } = req.body;
    try {
        const exists = await pool.query(
            `SELECT id FROM applications WHERE vacancy_id = $1 AND seeker_id = $2`,
            [vacancy_id, seeker_id]
        );
        if (exists.rows.length > 0)
            return res.status(400).json({ error: "Вы уже откликались на эту вакансию" });

        const result = await pool.query(
            `INSERT INTO applications (vacancy_id, seeker_id)
       VALUES ($1, $2)
       RETURNING *`,
            [vacancy_id, seeker_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.get("/api/applications/seeker/:seeker_id", async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT a.*, v.title, v.company, v.city, v.salary, v.schedule
       FROM applications a
       JOIN vacancies v ON v.id = a.vacancy_id
       WHERE a.seeker_id = $1
       ORDER BY a.created_at DESC`,
            [req.params.seeker_id]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/api/applications/employer/:user_id", async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT a.*, v.title AS vacancy_title, v.company,
              s.full_name, s.specialty, s.desired_salary, s.skills, u.email
       FROM applications a
       JOIN vacancies v ON v.id = a.vacancy_id
       JOIN seekers   s ON s.id = a.seeker_id
       JOIN users     u ON u.id = s.user_id
       WHERE v.employer_id = $1
       ORDER BY a.created_at DESC`,
            [req.params.user_id]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.patch("/api/applications/:id/status", async (req, res) => {
    const { status } = req.body;
    try {
        const result = await pool.query(
            `UPDATE applications SET status = $1 WHERE id = $2 RETURNING *`,
            [status, req.params.id]
        );
        if (result.rows.length === 0)
            return res.status(404).json({ error: "Отклик не найден" });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


// ============================================================
//  Запуск
// ============================================================
app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен: http://localhost:${PORT}`);
});