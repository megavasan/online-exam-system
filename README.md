# 🎓 Online Exam System

A modern, responsive, and robust **Online Exam System** built on the MERN stack. This application allows administrators to manage exams, subjects, and questions, while students can register, take tests, view reports, and track their performance.

---

## 🚀 Tech Stack

Here is the tech stack powering the online exam system:

![Frontend - React](https://img.shields.io/badge/Frontend-React%2018-blue?style=for-the-badge&logo=react)
![Backend - Node.js](https://img.shields.io/badge/Backend-Node.js%20Express-green?style=for-the-badge&logo=nodedotjs)
![Database - MongoDB](https://img.shields.io/badge/Database-MongoDB%20Local-brightgreen?style=for-the-badge&logo=mongodb)

---

## 🎨 System Highlights

> [!NOTE]
> **Student Experience**
> - **Self Registration & Authentication**: Secure sign-up and login portal.
> - **Interactive Exam Dashboard**: View assigned and available tests.
> - **Live Exam Timer**: Exams are timed and automatically submit when the timer expires.
> - **Exam Integrity Protection**: Detects and alerts on window/tab switching.

> [!TIP]
> **Admin Experience**
> - **Question Management**: Add and organize multiple-choice questions by subject.
> - **Special Test Assignment**: Assign specific tests to selected students.
> - **Analytics & Reports**: Track student scores, average grades, and completion metrics.

---

## 📁 Repository Structure

```text
online-exam-system/
├── backend/               # Express API server
│   ├── models/            # Database schemas (User, Question, Result, etc.)
│   ├── routes/            # API endpoints (Auth, Exam, Admin, SpecialTest)
│   ├── seedAdmin.js       # Admin user seeding script
│   ├── seedQuestions.js   # Sample questions seeding script
│   └── server.js          # Server entry point (Port 22020)
│
├── frontend/              # React frontend application
│   ├── public/            # Static assets
│   └── src/               # React components, pages, and context (Port 6001)
│
└── .gitignore             # Root exclusions file
```

---

## ⚙️ Local Setup Instructions

Follow these steps to run the application locally on your computer:

### 1. Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) running locally on port `27017`

### 2. Seeding the Database
Before running the backend, you should seed the default admin account and sample questions.

```bash
# Navigate to the backend directory
cd backend

# Install backend dependencies
npm install

# Seed Admin account (creates admin@exam.com | Admin@123)
node seedAdmin.js

# Seed sample exam questions
node seedQuestions.js
```

### 3. Start the Backend API Server
```bash
# Start the Express server (runs on http://localhost:22020)
npm start
```

### 4. Start the Frontend Website
Open a new terminal window:
```bash
# Navigate to the frontend directory
cd frontend

# Install frontend dependencies
npm install

# Start the React application (runs on http://localhost:6001)
npm start
```

---

## 🔒 Default Admin Credentials

For testing purposes, you can log in as an administrator using the following credentials:

| Field | Value |
| :--- | :--- |
| **Email** | `admin@exam.com` |
| **Password** | `Admin@123` |

> [!IMPORTANT]
> Change the default password in production environments or when deploying live.
