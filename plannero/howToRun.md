# How to Run Plannero Locally

This guide explains how to run the `plannero` Next.js project locally, plus MySQL database setup (Drizzle ORM). Follow all steps in order to have a working local environment.

## 1. Prerequisites

- Node.js (v18 or newer recommended)
- npm (v9+)
- MySQL server (or MariaDB)
- Git

Optional:
- Docker for containerized MySQL
- VS Code for development

---

## 2. Clone the repo

```bash
cd /path/to/projects
git clone <your-repo-url> zse-erasmus
cd zse-erasmus/plannero
```

---

## 3. Install dependencies

```bash
npm install
```

---

## 4. Environment variables

Copy `.env.example`:

```bash
cp .env.example .env
```

Open `.env` and adjust as needed:

```env
DATABASE_URL="mysql://root@localhost:8889/plannero_db"
BETTER_AUTH_SECRET="your-secret-here"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

For custom credentials:

```env
DATABASE_URL="mysql://user:password@localhost:3306/plannero_db"
```

---

## 5. MySQL setup

### A) Native local MySQL

1. Start MySQL.
2. Create database:

```sql
CREATE DATABASE plannero_db;
```

3. (Optional) Create user:

```sql
CREATE USER 'plannero_user'@'localhost' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON plannero_db.* TO 'plannero_user'@'localhost';
FLUSH PRIVILEGES;
```

4. Update `DATABASE_URL` in `.env` accordingly.

### B) Docker

```bash
docker run --name plannero-mysql -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=plannero_db -p 8889:3306 -d mysql:8.0
```

Set DB URL:

```env
DATABASE_URL="mysql://root:root@localhost:8889/plannero_db"
```

---

## 6. Apply database schema (Drizzle)

Project uses `drizzle-kit` with MySQL.

```bash
npm run db:push
```

If you need split steps:

```bash
npm run db:generate
npm run db:pull
```

---

## 7. Run the app

```bash
npm run dev
```

Open `http://localhost:3000`.

---

## 8. Verify

- UI loads
- DB connection works
- No errors in terminal

---

## 9. Production (!!)

```bash
npm run build
npm run start
```

---

## 10. Troubleshooting

- `ECONNREFUSED`: mySQL not running or wrong host/port
- `ER_NO_DB_ERROR`: database missing, create it or correct URL
- `.env` not loaded: ensure file exists in `plannero` folder

---

## 11. Helpful commands

- `npm run lint`
- `npm run db:studio`
- `npm run dev`
