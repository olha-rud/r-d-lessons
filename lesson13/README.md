# Task Tracker - Monorepo

Повноцінний трекер для задач з React frontend та Node.js + PostgreSQL backend.

## 📁 Структура проєкту

```
lesson13/
├── backend/          # Express.js + PostgreSQL + Sequelize
├── frontend/         # React + TypeScript + Vite
├── package.json      # Root package.json з скриптами для обох проєктів
└── README.md
```

## 🚀 Швидкий старт

### 1. Встановлення залежностей

```bash
# Встановити залежності для обох проєктів
npm run install:all
```

Або окремо:
```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2. Налаштування бази даних

Переконайтеся, що PostgreSQL запущений:
```bash
# Перевірка статусу
brew services list | grep postgresql

# Запуск PostgreSQL (якщо не запущений)
brew services start postgresql@16
```

Створіть базу даних (якщо ще не створена):
```bash
psql -U rud -d postgres
CREATE DATABASE task_tracker;
\q
```

### 3. Запуск у режимі розробки

```bash
# Запустити backend і frontend одночасно
npm run dev
```

Або окремо:
```bash
# Backend (http://localhost:3000)
npm run dev:backend

# Frontend (http://localhost:5173)
npm run dev:frontend
```

## 🧪 Тестування

```bash
# Запустити тести для обох проєктів
npm test

# Тільки backend
npm run test:backend

# Тільки frontend
npm run test:frontend
```

## 🏗️ Build для production

```bash
# Build обох проєктів
npm run build

# Тільки backend (результат у backend/dist)
npm run build:backend

# Тільки frontend (результат у frontend/dist)
npm run build:frontend
```

## 📦 Запуск production build

```bash
# Backend
npm run start:backend

# Frontend (preview)
npm run start:frontend
```

## 🛠️ Технології

### Backend
- Node.js + Express
- TypeScript
- PostgreSQL + Sequelize ORM
- Jest + Supertest (тестування)
- Zod (валідація)

### Frontend
- React 18
- TypeScript
- Vite
- React Router
- Vitest + React Testing Library
- ESLint

## 📝 Корисні команди

```bash
# Очистити всі node_modules та dist
npm run clean

# Перевстановити все з нуля
npm run clean && npm run install:all
```

## 🔧 Налаштування

### Backend
- Порт: `3000` (змінити у `backend/src/server.ts`)
- База даних: налаштування у `backend/src/config/database.ts`

### Frontend
- Порт: `5173` (змінити у `frontend/vite.config.ts`)
- API URL: налаштування у `frontend/src/features/tasks/api.ts`

## 📚 Наступні кроки

1. ✅ Доповнити тести для всіх ендпоінтів backend
2. ✅ Додати тести для всіх компонентів frontend
3. ⏳ Налаштувати ESLint config для backend
4. ⏳ Налаштувати Husky + lint-staged для обох проєктів
5. ⏳ Перевірити production build процес
