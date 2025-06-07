# Libraria

Libraria is a simple library management system built with Next.js, Prisma, and SQLite.  
The goal of this project is to provide a basic platform for managing books, users, and borrowing activities in a library environment. It supports user authentication, book management, and borrowing/returning books.

---

## Setup & Development Guide

Follow these steps to run the project locally:

### 1. Clone the Repository
```bash
git clone https://github.com/MozartKato/libraria
cd libraria
```

### 2. Copy Environment File
Create a `.env` file from the example (if available), or create it manually:
```bash
cp .env.example .env
# If .env.example does not exist, make sure your .env contains:
# DATABASE_URL="file:./db.sqlite3"
```

### 3. Install Dependencies
```bash
pnpm install
# or
npm install
# or
yarn install
```

### 4. Generate Prisma Client
```bash
npx prisma generate
```

### 5. Run Database Migration
```bash
npx prisma migrate dev --name init
```
This will create the necessary tables in the database according to the Prisma schema.

### 6. (Optional) Open Prisma Studio
To view or manage your database data:
```bash
npx prisma studio
```

### 7. Start the Development Server
```bash
pnpm dev
# or
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

---

**Notes:**  
- Make sure Node.js and your package manager (pnpm/npm/yarn) are installed.
- If you make changes to `prisma/schema.prisma`, repeat steps 4 and 5.