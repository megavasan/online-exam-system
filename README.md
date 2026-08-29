# 🎓 Production-Ready Online Exam System

A modern, responsive, and robust **Online Exam System** built on the MERN stack. This system features full administrative controls, student testing portals, dynamic exam timings, circular question navigation, and anti-cheat tab-switching guards.

The project is configured for seamless deployment to **Netlify** (Frontend), **Render** (Backend), and **MongoDB Atlas** (Database).

---

## 🚀 Tech Stack

Here is the tech stack powering the online exam system:

![Frontend - React](https://img.shields.io/badge/Frontend-React%2018-blue?style=for-the-badge&logo=react)
![Backend - Node.js](https://img.shields.io/badge/Backend-Node.js%20Express-green?style=for-the-badge&logo=nodedotjs)
![Database - MongoDB Atlas](https://img.shields.io/badge/Database-MongoDB%20Atlas-brightgreen?style=for-the-badge&logo=mongodb)

---

## 🎨 Core System Features

> [!NOTE]
> **Student Experience**
> - **Self Registration & Authentication**: Secure sign-up and login portal.
> - **Interactive Exam Dashboard**: View assigned subject tests (Java, Python, .NET, Full Stack) and personalized "Special Tests" assigned to student emails.
> - **Live Exam Timer**: Exams are timed dynamically based on question count, automatically submitting when the timer expires.
> - **Circular Navigator**: Navigate directly between questions with green (answered) and red (unanswered) indicator badges.
> - **Anti-Cheat Integrity Guard**: Monitors window tab switching via the `visibilitychange` event. Shows a warning alert on tab switches and automatically locks/submits the exam upon 3 violations.

> [!TIP]
> **Admin Control Panel**
> - **Question Management**: Aggregated CRUD dashboard to create, list, and categorize multiple-choice questions.
> - **Special Test Assignment**: Create custom, scheduled tests for targeted students with customizable durations.
> - **Detailed Analytics**: Inspect student profiles, average grades, overall statuses, and complete individual answer sheets.

---

## 📁 Repository Structure

```text
online-exam-system/
├── backend/               # Express API server
│   ├── models/            # Mongoose schemas (User, Question, Result, SpecialTest, SpecialResult)
│   ├── routes/            # Route scripts (auth, exam, admin, result, specialTest)
│   ├── .env.example       # Template for database secret variables
│   ├── seedAdmin.js       # Admin user seeding script
│   ├── seedQuestions.js   # Sample questions seeding script
│   └── server.js          # Entry point (dynamically binds PORT or 22020)
│
├── frontend/              # React frontend application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Timer, navigator elements
│   │   ├── context/       # Global Theme context (Dark / Light mode)
│   │   ├── pages/         # Interactive user panels & admin consoles
│   │   └── config.js      # Production resolver resolving process.env.REACT_APP_API_URL
│   └── package.json       # Build configurations
│
└── .gitignore             # Configured to exclude local .env and node_modules
```

---

## ⚙️ Setup and Configuration

Follow these steps to run the application locally or prepare it for production:

### 1. Environment Variables Configuration
Create a `.env` file inside the `backend/` directory based on the template:

```env
MONGODB_URI=your_mongodb_atlas_connection_string
PORT=22020
```

### 2. Backend Installation and Database Seeding
Initialize dependencies and populate the database with default accounts and question bundles:

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Seed Admin account (email: admin@exam.com | password: Admin@123)
node seedAdmin.js

# Seed default subject questions
node seedQuestions.js
```

### 3. Run Backend API Server
```bash
# Start backend server
npm start
```

### 4. Frontend Installation and Run
Open a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install packages
npm install --legacy-peer-deps

# Start React app (runs on http://localhost:3000 or http://localhost:6001)
npm start
```

---

## 🔒 Default Admin Credentials

For testing purposes, you can log in as an administrator using the following credentials:

| Field | Value |
| :--- | :--- |
| **Email** | `admin@exam.com` |
| **Password** | `Admin@123` |

---

## ☁️ Deployment Configurations

### Frontend (Netlify)
- **Build Command**: `npm run build`
- **Publish Directory**: `build`
- **Environment Variables**: Add `REACT_APP_API_URL` pointing to your deployed Render URL.

### Backend (Render)
- **Environment**: Node
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment Variables**: Add `MONGODB_URI` pointing to your MongoDB Atlas connection string.
