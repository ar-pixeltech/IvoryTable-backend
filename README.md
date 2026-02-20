# 🤍 IvoryTable Backend

IvoryTable is a cloud-based POS (Point of Sale) and Vendor Management System designed for modern restaurants and hospitality businesses.  
This repository contains the backend service built with **Node.js, Express, Prisma, and PostgreSQL**.

---

## 🚀 Getting Started

Follow the steps below to set up the project locally.

---

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/IvoryTable-backend.git
cd IvoryTable-backend
```

## 2️⃣ Create Environment File

```bash
touch .env
```
Add the following variables:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/posdb"
NODE_ENV=production
JWT_SECRET="your_jwt_secret_key"
PORT=3001
RATE_LIMIT_WINDOW=15 * 60 * 1000 # 15 minutes
RATE_LIMIT_MAX=100 # Max 100 requests per window per IP
```

Make sure PostgreSQL is running before proceeding.

## 3️⃣ Install Dependencies

```bash
npm install
```
This installs all required Node.js modules.

## 4️⃣ Generate Prisma Client

```bash
npx prisma generate
```
This generates the Prisma client based on your schema.prisma file.

## 5️⃣ Start Development Server
```bash
npm run dev
```

Server will run at:
```aurduino
http://localhost:3001
```

## 🗂 Tech Stack
- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- dotenv