# LinkTask 📋

Gestor de proyectos personal con tablero Kanban, construido con React, Node.js y MySQL.

## 🚀 Tecnologías

- **Frontend:** React + Vite + TypeScript + Tailwind CSS
- **Backend:** Node.js + Express
- **Base de datos:** MySQL
- **Autenticación:** JWT + bcryptjs

## ✨ Funcionalidades

- Registro e inicio de sesión con JWT
- Crear, ver y eliminar proyectos
- Tablero Kanban con columnas To Do / En progreso / Hecho
- Crear, mover y eliminar tareas
- Interfaz moderna con glassmorphism

## 🛠️ Instalación

### Backend

```bash
cd backend
npm install
# Configura tu .env con los datos de MySQL
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Base de datos

Ejecuta el SQL en MySQL Workbench:

```sql
CREATE DATABASE linktask;
USE linktask;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  owner_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id)
);

CREATE TABLE tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  status ENUM('todo', 'in_progress', 'done') DEFAULT 'todo',
  project_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id)
);
```

## 📁 Estructura

```
linktask/
├── backend/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── routes/
│       └── middleware/
└── frontend/
    └── src/
        ├── pages/
        ├── components/
        └── services/
```

## 🔮 Próximamente

- Integración con IA para sugerencias de tareas
- Exportar reportes en PDF
- Estadísticas de productividad
