
import pg from "pg";


const { Pool } = pg;

const pool = new Pool({
  host:     "localhost",       // адрес сервера БД
  port:     5432,              // порт PostgreSQL (по умолчанию 5432)
  database: "hirespace",       // название базы данных
  user:     "postgres",        // имя пользователя
  password: "21112003",                // ← ВПИШИТЕ СВОЙ ПАРОЛЬ ЗДЕСЬ
});

// Проверка подключения при старте
pool.connect((err, client, release) => {
  if (err) {
    console.error("❌ Ошибка подключения к БД:", err.message);
  } else {
    console.log("✅ Подключение к PostgreSQL успешно");
    release();
  }
});

export default pool;
