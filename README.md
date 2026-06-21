🚀 Isait — Премиум IT-решения
Современная, мощная и элегантная веб-платформа для IT-компании с премиальным дизайном, полноценным бэкендом и профессиональной архитектурой.


✨ Особенности проекта
Isait — это не просто сайт-визитка. Это полноценная современная веб-платформа премиум-класса:

Красивый тёмный премиальный дизайн с циановыми акцентами
Динамическая загрузка контента с бэкенда
Одна из самых красивых и функциональных форм заявок среди React-проектов
Полноценный REST API на TypeScript
Защищённая админ-панель
Работа с файлами (загрузка изображений)
Полная поддержка Docker (новая фича)


🐳 Docker Support (Добавлено в этой версии)
Проект полностью контейнеризирован. Теперь запустить весь стек можно одной командой.
Преимущества Docker-версии:

Единообразное окружение у всех разработчиков
Горячая перезагрузка и на фронте, и на бэке
Простой запуск и остановка проекта
Готово к деплою на любой сервер
Чёткое разделение frontend и backend

Структура Docker
textisait/
├── client/                 # React + Vite
│   └── Dockerfile
├── server/                 # Express + TypeScript
│   └── Dockerfile
└── docker-compose.yml      # Главный файл запуска
Быстрый старт с Docker
Bash# Клонируем проект и переходим в папку
cd isait

# Запускаем всё одной командой
docker compose up --build
После запуска:

Frontend: http://localhost:5173
Backend: http://localhost:5000

Готово. Никаких npm install и настройки окружения вручную не требуется.

🖥️ Frontend (React + TypeScript)
Технологии:

React 18 + TypeScript
Vite 6
Tailwind CSS 4
Полная типизация + современные практики

Реализованные возможности:

Премиальная форма заявки (Bid Form) с отличной валидацией и UX
Динамическая секция «Наши услуги»
Плавные анимации и микроинтеракции
Полностью адаптивный дизайн
Современный Navbar с плавной прокруткой


⚙️ Backend (Node.js + TypeScript)
Технологии:

Express.js + TypeScript
Drizzle ORM + SQLite
Multer (загрузка изображений)
Защита админки через middleware

Эндпоинты:
Публичные:

GET /services
GET /examples
POST /bid — главная форма заявки

Админские (требуют роль admin):

POST /admin/service
DELETE /admin/service/:id
POST /admin/example
GET /bids
DELETE /admin/bid/:id

Также доступна встроенная админ-панель по адресу /admin/panel (после авторизации через /login).

🛠️ Быстрый старт (без Docker)
Frontend
Bashcd client
npm install
npm run dev
Backend
Bashcd server
npm install
npm run dev
В client/src/App.tsx укажи адрес своего сервера:
TypeScriptconst API_URL = 'http://localhost:5000'

🚀 Планы развития

 Полноценная поддержка Docker
 Полноценная админ-панель на React
 Уведомления в Telegram при новой заявке
 Интеграция Framer Motion
 Production-вариант Docker (Nginx + multi-stage build)
 Деплой на Railway / Render / VPS


💬 Хочешь доработки?
Могу сразу добавить:

Production Docker (Nginx + оптимизированные образы)
Telegram-бота для уведомлений
Полноценную админ-панель на React
Аутентификацию через JWT
Любые другие улучшения
