# Online Examination System

![FastAPI](https://img.shields.io/badge/Backend-FastAPI%200.128.0-009688?logo=fastapi)
![React](https://img.shields.io/badge/Frontend-React%2018-61DAFB?logo=react)
![MySQL](https://img.shields.io/badge/Database-MySQL%208.0-4479A1?logo=mysql)
![License](https://img.shields.io/badge/License-MIT-green)

A modern, secure, and efficient full-stack online examination platform built with **React (frontend)** and **FastAPI (backend)** for conducting assessments with real-time monitoring and instant results.

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Technology Stack](#technology-stack)
4. [Architecture](#architecture)
5. [Database Design](#database-design)
6. [API Endpoints](#api-endpoints)
7. [Installation Guide](#installation-guide)
8. [Project Structure](#project-structure)
9. [Key Features Implementation](#key-features-implementation)
10. [Security Features](#security-features)
11. [Use Cases](#use-cases)
12. [Future Enhancements](#future-enhancements)
13. [Contributors](#contributors)
14. [License](#license)

---

## 📖 Project Overview

The Online Examination System is a comprehensive web-based platform designed to streamline the process of conducting online examinations. It provides separate interfaces for administrators and students, enabling seamless exam management, real-time monitoring, and instant result analysis.

---

## ✨ Features

### 👨‍🎓 Student Features
- Secure authentication using JWT
- Live exam interface with timer
- Auto-save answers
- Tab switch detection & warnings
- Auto-submit on time expiry
- Instant result evaluation
- Exam history & performance tracking

### 👨‍💼 Admin Features
- Exam creation & publishing
- Question bank management
- Student management
- Result analytics & CSV export
- Real-time monitoring

---

## 🛠️ Technology Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | UI framework |
| **Vite** | Fast development & build tool |
| **Tailwind CSS** | Utility-first styling |
| **React Router v6** | Client-side routing |
| **Context API** | State management |
| **Axios** | API communication |
| **Lucide React** | Icons |

### Backend
| Technology | Purpose |
|------------|---------|
| **Python 3.11** | Programming language |
| **FastAPI** | Backend framework |
| **SQLAlchemy** | ORM |
| **MySQL 8.0** | Relational database |
| **PyMySQL** | MySQL driver |
| **Pydantic** | Validation |
| **JWT** | Authentication |
| **Uvicorn** | ASGI server |

---

## 🏗️ Architecture

Frontend (React) communicates with Backend (FastAPI) via REST APIs.  
Backend uses SQLAlchemy ORM to interact with MySQL.

---

## 🗄️ Database Design

Key tables:
- Users
- Exams
- Questions
- ExamAttempts
- Answers

(Relational structure with proper foreign keys and indexing)

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Exams
- `GET /api/exams`
- `POST /api/exams`
- `PUT /api/exams/{id}`
- `DELETE /api/exams/{id}`

### Student
- `POST /api/student/exams/{id}/start`
- `POST /api/student/attempts/{id}/save`
- `POST /api/student/attempts/{id}/submit`

### Results
- `GET /api/results`
- `GET /api/results/export/csv`

---

## 📦 Installation Guide

### Prerequisites
- Node.js ≥ 16
- Python ≥ 3.11
- MySQL ≥ 8.0
- npm ≥ 8

---

### Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
````

Create `.env`:

```env
DATABASE_URL=mysql+pymysql://user:password@localhost:3306/exam_db
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

Run server:

```bash
uvicorn app.main:app --reload
```

Backend runs at:

```
http://localhost:8000
```

---

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

## 📂 Project Structure

```
online-exam-system/
├── backend/
│   ├── app/
│   ├── alembic/
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
├── README.md
└── .gitignore
```

---

## 🔐 Security Features

* JWT authentication
* Password hashing with bcrypt
* Role-based access control
* Input validation with Pydantic
* ORM-based SQL injection protection
* CORS configuration

---

## 🚀 Future Enhancements

* AI-based proctoring
* Question randomization
* Advanced analytics dashboard
* Multi-language support
* Mobile application

---

## 👥 Contributors

* **Anshit Puri** 

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 📞 Support

📧 [anshitpuri99@gmail.com](mailto:anshitpuri99@gmail.com)


