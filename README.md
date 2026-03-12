# 🚀 TaskFlow — Full Stack Task Manager
> React + Django REST Framework + MySQL

---

## 📁 Project Structure

```
task-manager/
├── backend/                  ← Django + DRF
│   ├── taskmanager/          ← Django project settings
│   │   ├── settings.py
│   │   └── urls.py
│   ├── taskapi/              ← App: models, views, serializers
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── manage.py
│   ├── requirements.txt
│   └── .env.example
│
└── frontend/                 ← React app
    ├── src/
    │   ├── api/api.js         ← Axios + JWT interceptors
    │   ├── context/AuthContext.js
    │   ├── pages/
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   └── Dashboard.js
    │   ├── components/
    │   │   ├── TaskCard.js
    │   │   └── TaskModal.js
    │   ├── App.js
    │   └── App.css
    └── package.json
```

---

## ⚙️ STEP 1 — MySQL Setup

Open MySQL and run:

```sql
CREATE DATABASE taskmanager_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'taskuser'@'localhost' IDENTIFIED BY 'yourpassword';
GRANT ALL PRIVILEGES ON taskmanager_db.* TO 'taskuser'@'localhost';
FLUSH PRIVILEGES;
```

---

## 🐍 STEP 2 — Backend Setup (Django)

```bash
# 1. Go into backend folder
cd task-manager/backend

# 2. Create virtual environment
python -m venv venv

# 3. Activate it
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# 4. Install dependencies
pip install -r requirements.txt

# 5. Create your .env file
cp .env.example .env
# Now edit .env with your DB password and a secret key

# 6. Run migrations (creates all tables in MySQL)
python manage.py makemigrations
python manage.py migrate

# 7. Create admin user (optional)
python manage.py createsuperuser

# 8. Start the server
python manage.py runserver
```

Backend runs at: **http://localhost:8000**
Django Admin: **http://localhost:8000/admin**

---

## ⚛️ STEP 3 — Frontend Setup (React)

Open a NEW terminal:

```bash
# 1. Go into frontend folder
cd task-manager/frontend

# 2. Install packages
npm install

# 3. Start the app
npm start
```

Frontend runs at: **http://localhost:3000**

---

## 🌐 API Endpoints

| Method | URL | Description | Auth |
|--------|-----|-------------|------|
| POST | `/api/register/` | Create account | ❌ |
| POST | `/api/login/` | Login, get JWT | ❌ |
| POST | `/api/logout/` | Logout | ✅ |
| GET | `/api/profile/` | Current user | ✅ |
| GET | `/api/tasks/` | List tasks | ✅ |
| POST | `/api/tasks/` | Create task | ✅ |
| GET | `/api/tasks/:id/` | Get task | ✅ |
| PATCH | `/api/tasks/:id/` | Update task | ✅ |
| DELETE | `/api/tasks/:id/` | Delete task | ✅ |
| GET | `/api/tasks/stats/` | Task counts | ✅ |

### Query Params for GET /api/tasks/:
- `?status=pending` or `?status=completed`
- `?priority=low` or `?priority=medium` or `?priority=high`
- `?search=keyword` (searches title + description)

---

## ✅ Features Included

| Feature | Status |
|---------|--------|
| User Registration | ✅ |
| User Login (JWT) | ✅ |
| Auto token refresh | ✅ |
| Create Task | ✅ |
| Edit Task | ✅ |
| Delete Task | ✅ |
| Mark Complete/Pending | ✅ |
| Task Priority (Low/Med/High) | ✅ |
| Task Deadline | ✅ |
| Overdue Detection | ✅ |
| Search Tasks | ✅ |
| Filter by Status | ✅ |
| Filter by Priority | ✅ |
| Task Stats Dashboard | ✅ |
| Dark / Light Mode | ✅ |
| Responsive Design | ✅ |
| Django Admin Panel | ✅ |

---

## 🗄️ Database Tables

### Users (Django built-in `auth_user`)
- id, username, email, password (hashed)

### Tasks (`taskapi_task`)
- id, title, description, status, priority, deadline, created_at, updated_at, user_id

---

## 📝 Resume Description

> **Task Manager Web Application**
> - Built a full-stack task management system using React, Django REST Framework, and MySQL
> - Implemented JWT-based authentication with auto token refresh
> - Developed RESTful APIs for full CRUD operations on tasks
> - Added search, filter by status/priority, task statistics dashboard
> - Designed responsive dark-mode UI using React components

---

## 🛠️ Troubleshooting

**`mysqlclient` install error on Windows?**
```bash
pip install mysqlclient --only-binary :all:
# Or use PyMySQL instead:
pip install pymysql
# And add to taskmanager/__init__.py:
# import pymysql; pymysql.install_as_MySQLdb()
```

**CORS error in browser?**
Make sure `django-cors-headers` is installed and `CORS_ALLOWED_ORIGINS` includes `http://localhost:3000` in settings.py.

**`python manage.py migrate` fails?**
Double-check your `.env` file — DB_NAME, DB_USER, DB_PASSWORD must match your MySQL setup.
