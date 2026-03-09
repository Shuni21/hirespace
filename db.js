const { Pool } = require("pg");

const pool = new Pool({
  host: "localhost",
  port: 5432,
  database: "hirespace",
  user: "postgres",
  password: "21112003",
});

// Проверка подключения
pool.connect((err, client, release) => {
  if (err) {
    console.error("❌ Ошибка подключения к БД:", err.message);
  } else {
    console.log("✅ Подключение к PostgreSQL успешно");
    release();
  }
});

module.exports = pool;