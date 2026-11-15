# GOREPO — Setup Guide

## Prerequisites
- Node.js 18+
- PostgreSQL running locally
- npm

---

## 1. Configure the database

Edit `.env` and update `DATABASE_URL` with your PostgreSQL credentials:

```
DATABASE_URL="postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/gouni_repo"
```

Create the database if it doesn't exist:
```sql
-- In psql:
CREATE DATABASE gouni_repo;
```

---

## 2. Run database migrations

```bash
npx prisma migrate dev --name init
```

This creates all tables. After the migration completes, add the full-text search column:

```bash
npx prisma migrate dev --name add_search_vector
```

Then add this SQL to the new migration file at `prisma/migrations/*/migration.sql`:
```sql
ALTER TABLE "Item" ADD COLUMN IF NOT EXISTS "search_vector" tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(abstract, '')), 'B')
  ) STORED;

CREATE INDEX IF NOT EXISTS item_search_gin ON "Item" USING GIN (search_vector);
```

Or run it directly in psql after migration:
```bash
psql -U YOUR_USER -d gouni_repo -c "
ALTER TABLE \"Item\" ADD COLUMN IF NOT EXISTS search_vector tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(abstract, '')), 'B')
  ) STORED;
CREATE INDEX IF NOT EXISTS item_search_gin ON \"Item\" USING GIN (search_vector);
"
```

---

## 3. Seed the database

```bash
npm run db:seed
```

This creates:
- 8 faculties + 31 departments
- 29 subjects
- 15 sample published items
- Admin: `admin@gouni.edu.ng` / `admin1234`
- Researcher: `researcher@gouni.edu.ng` / `test1234`

---

## 4. Start the development server

```bash
npm run dev
```

Open http://localhost:3000

---

## Key routes to test

| Route | Purpose |
|-------|---------|
| `/` | Homepage with stats and latest items |
| `/search?q=malaria` | Full-text search |
| `/browse/divisions` | Faculty tree |
| `/auth/login` | Sign in |
| `/deposit` | Submit research (researcher login required) |
| `/admin` | Admin panel (admin login required) |
| `/api/oai?verb=Identify` | OAI-PMH endpoint |
| `/api/feed/atom` | Atom feed |
| `/api/feed/rss` | RSS feed |

---

## Useful commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run db:studio    # Open Prisma Studio (visual DB browser)
npm run db:seed      # Re-seed the database
npx prisma generate  # Regenerate Prisma client after schema changes
```
