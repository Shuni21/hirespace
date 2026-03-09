export const VACANCIES = [
  "Frontend Developer", "Backend Developer", "Product Designer",
  "Data Engineer", "Product Manager", "QA Engineer", "DevOps Engineer", "iOS Developer",
];

export const GENDERS    = ["Мужской", "Женский"];
export const CITIES     = ["Москва", "Санкт-Петербург", "Казань", "Новосибирск", "Удалённо"];
export const EDUCATIONS = ["Высшее", "Незаконченное высшее", "Среднее специальное"];
export const WORK_TYPES = ["Полная занятость", "Частичная занятость", "Проектная работа", "Стажировка"];
export const SCHEDULES  = ["Полный день", "Гибкий график", "Удалённо", "Сменный"];
export const EXP_OPTS   = ["Без опыта", "До 1 года", "1–3 года", "3–6 лет", "6–10 лет", "10+ лет"];
export const SKILLS_ALL = [
  "React","Vue","Angular","TypeScript","JavaScript","Node.js",
  "Python","Go","Java","PostgreSQL","MongoDB","Docker",
  "Kubernetes","Figma","UX Research","Agile","Scrum","SQL","AWS","Git",
];

// Search filter options
export const F_VACANCIES  = ["Все", ...VACANCIES.slice(0, 6)];
export const F_GENDERS    = ["Любой", ...GENDERS];
export const F_CITIES     = ["Любой", ...CITIES];
export const F_EDUCATIONS = ["Любое", "Высшее", "Незаконченное высшее"];
export const F_STATUSES   = ["Любой", "Активно ищет", "Рассматривает"];
export const F_EXP        = ["Любой", "До 1 года", "1–3 года", "3–6 лет", "6–10 лет", "10+ лет"];
export const F_AGE_FROM   = ["—", "18", "22", "25", "30", "35", "40"];
export const F_AGE_TO     = ["—", "25", "30", "35", "40", "45", "55"];

export const EMPLOYER_VACANCIES_INIT = [
  { id: 1, title: "Frontend Developer", salary: "150 000 — 220 000 ₽", city: "Москва",   posted: "01.03.2026" },
  { id: 2, title: "Product Designer",   salary: "120 000 — 180 000 ₽", city: "Удалённо", posted: "03.03.2026" },
  { id: 3, title: "Backend Developer",  salary: "200 000 — 280 000 ₽", city: "Москва",   posted: "05.03.2026" },
];

// Данные кандидатов и заявок теперь загружаются из БД
// через функции в constants/api.js
