# LinkTask

Gestor de proyectos personal con tablero Kanban, construido con React, Node.js y MySQL. Incluye un asistente de IA integrado (LLaMA 3 vía Groq) para ayudar con la gestión de tareas.

## Tecnologías

- **Frontend:** React + Vite + TypeScript + Tailwind CSS
- **Backend:** Node.js + Express
- **Base de datos:** MySQL
- **Autenticación:** JWT + bcryptjs
- **IA:** Groq SDK (LLaMA 3.3 70B)
- **Containerización:** Docker + Docker Compose

## Funcionalidades

- Registro e inicio de sesión con JWT
- Crear, ver y eliminar proyectos
- Tablero Kanban con columnas To Do / En progreso / Hecho
- Crear, mover y eliminar tareas
- Asistente de IA integrado para consultas sobre el proyecto
- Interfaz moderna con glassmorphism

## 🐳 Instalación con Docker

La forma más rápida de levantar todo el proyecto (backend + frontend + MySQL) con un solo comando.

### Requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y corriendo

### Pasos

1. Clona el repositorio:

   ```bash
   git clone https://github.com/keynervk/linktask.git
   cd linktask
   ```

2. Crea un archivo `.env` en la raíz del proyecto con tus propias variables:

   ```
   PORT=3000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=tu_contraseña
   DB_NAME=linktask
   JWT_SECRET=tu_secreto_jwt
   GROQ_API_KEY=tu_api_key_de_groq
   ```

   > Puedes generar una API key gratuita de Groq en [console.groq.com](https://console.groq.com)

3. Levanta todo el proyecto:

   ```bash
   docker compose up --build
   ```

4. Accede a la app:
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend API: [http://localhost:3000](http://localhost:3000)
   - MySQL (opcional, para conectar con un cliente externo): `localhost:3307`

5. La primera vez, crea las tablas en la base de datos del contenedor:

   ```bash
   docker cp backend/schema.sql linktask-mysql-1:/schema.sql
   docker exec -it linktask-mysql-1 mysql -u root -p<tu_contraseña> linktask -e "source /schema.sql"
   ```

6. Regístrate desde la pantalla de login y ¡listo!

## 🛠️ Instalación manual (sin Docker)

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

Ejecuta `backend/schema.sql` en tu cliente de MySQL preferido (Workbench, CLI, etc), o usa este SQL directamente:

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
│   ├── Dockerfile
│   ├── schema.sql
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── routes/
│       └── middleware/
├── frontend/
│   ├── Dockerfile
│   └── src/
│       ├── pages/
│       ├── components/
│       └── services/
└── docker-compose.yml
```

## Próximamente

- Exportar reportes en PDF
- Estadísticas de productividad
- Healthcheck en docker-compose para evitar errores de arranque entre servicios
