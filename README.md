# Online Examination System

A modern, secure, and efficient full-stack online examination platform built with React (frontend) and FastAPI (backend) for conducting assessments with real-time monitoring and instant results.

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

### Problem Statement

Traditional pen-and-paper examinations face challenges such as:
- Manual grading and result processing
- Time-consuming result declaration
- Difficulty in maintaining exam records
- Limited accessibility for remote students
- Higher probability of human errors

### Solution

This system addresses the above challenges by providing:
- Automated grading and instant results
- Digital record keeping
- Remote examination capability
- Real-time monitoring and analytics
- Enhanced security features

---

## ✨ Features

### 👨‍🎓 Student Features

| Feature | Description |
|---------|-------------|
| **User Authentication** | Secure login and registration with JWT tokens |
| **Exam Dashboard** | View all available published exams with details |
| **Exam Instructions** | Clear guidelines before starting the exam |
| **Live Exam Interface** | Real-time exam taking experience with timer |
| **Question Navigation** | Jump between questions easily |
| **Auto-Save Answers** | Automatic saving of selected answers |
| **Tab Switch Detection** | Monitors and warns about tab switches |
| **Auto-Submit** | Automatic submission on timer expiry |
| **Instant Results** | Detailed result analysis with correct answers |
| **Results History** | View all past exam attempts and performance |

### 👨‍💼 Admin Features

| Feature | Description |
|---------|-------------|
| **Dashboard** | Overview statistics and recent submissions |
| **Exam Management** | Create, edit, publish/unpublish exams |
| **Question Bank** | Add, edit, and delete questions with multiple formats |
| **Student Management** | View and manage student accounts |
| **Results Analysis** | View, filter, and export exam results |
| **Real-time Monitoring** | Track exam attempts and student performance |
| **CSV Export** | Export results to CSV for external analysis |

---

## 🛠️ Technology Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| **React 18** | UI framework with modern hooks |
| **Vite** | Build tool for fast development |
| **Tailwind CSS** | Utility-first CSS framework |
| **React Router v6** | Client-side routing |
| **Context API** | Global state management |
| **Axios** | HTTP client for API calls |
| **Lucide React** | Icon library |
| **ESLint** | Code linting and quality |

### Backend

| Technology | Purpose |
|------------|---------|
| **Python 3.11** | Programming language |
| **FastAPI** | Modern, fast web framework |
| **SQLAlchemy** | ORM for database operations |
| **MySQL** | Relational database |
| **PyMySQL** | MySQL database driver |
| **Pydantic** | Data validation |
| **JWT** | Authentication tokens |
| **Uvicorn** | ASGI server |
| **Python-multipart** | File upload support |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Layer (Frontend)                  │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                  React Application                       ││
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   ││
│  │  │  Auth    │ │  Exam     │ │ Results  │ │  Admin   │   ││
│  │  │ Context  │ │  Module   │ │  Module  │ │  Module  │   ││
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘   ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS/REST API
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Server Layer (Backend)                   │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                     FastAPI Server                       ││
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   ││
│  │  │  Auth    │ │  Exams   │ │Questions │ │ Results  │   ││
│  │  │  Routes  │ │  Routes  │ │  Routes  │ │  Routes  │   ││
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘   ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
                              │
                              │ SQLAlchemy ORM
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Data Layer (Database)                    │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                    MySQL Database                          ││
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       ││
│  │  │  Users  │ │  Exams  │ │Questions│ │ Results │       ││
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘       ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

## 🗄️ Database Design

### Users Table
| Column | Type | Description |
|--------|------|-------------|
| id | Integer | Primary key |
| email | String(255) | Unique email address |
| password_hash | String(255) | Hashed password |
| full_name | String(100) | User's full name |
| role | Enum | 'student' or 'admin' |
| created_at | DateTime | Creation timestamp |
| is_active | Boolean | Account status |

### Exams Table
| Column | Type | Description |
|--------|------|-------------|
| id | Integer | Primary key |
| title | String(255) | Exam title |
| description | Text | Exam description |
| duration_minutes | Integer | Time limit in minutes |
| passing_score | Integer | Minimum passing percentage |
| is_published | Boolean | Exam visibility status |
| created_by | Integer | Admin ID reference |
| created_at | DateTime | Creation timestamp |
| start_date | DateTime | Exam start availability |
| end_date | DateTime | Exam end availability |

### Questions Table
| Column | Type | Description |
|--------|------|-------------|
| id | Integer | Primary key |
| exam_id | Integer | Foreign key to exams |
| question_text | Text | Question content |
| question_type | Enum | 'multiple_choice', 'true_false' |
| options | JSON | Array of options with correct answer |
| points | Integer | Marks for the question |
| created_at | DateTime | Creation timestamp |

### ExamAttempts Table
| Column | Type | Description |
|--------|------|-------------|
| id | Integer | Primary key |
| exam_id | Integer | Foreign key to exams |
| user_id | Integer | Foreign key to users |
| score | Integer | Obtained score |
| total_questions | Integer | Total questions in exam |
| correct_answers | Integer | Number of correct answers |
| started_at | DateTime | Exam start time |
| submitted_at | DateTime | Submission timestamp |
| status | Enum | 'in_progress', 'completed', 'abandoned' |

### Answers Table
| Column | Type | Description |
|--------|------|-------------|
| id | Integer | Primary key |
| attempt_id | Integer | Foreign key to exam attempts |
| question_id | Integer | Foreign key to questions |
| selected_option | Integer | Index of selected option |
| is_correct | Boolean | Whether answer is correct |
| created_at | DateTime | Timestamp |

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/logout` | User logout |
| GET | `/api/auth/me` | Get current user |

### Exams
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/exams` | Get all published exams |
| GET | `/api/exams/{id}` | Get exam details |
| POST | `/api/exams` | Create new exam |
| PUT | `/api/exams/{id}` | Update exam |
| DELETE | `/api/exams/{id}` | Delete exam |
| POST | `/api/exams/{id}/publish` | Publish exam |

### Questions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/questions?exam_id={id}` | Get questions for exam |
| POST | `/api/questions` | Add new question |
| PUT | `/api/questions/{id}` | Update question |
| DELETE | `/api/questions/{id}` | Delete question |

### Student Exams
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/student/exams` | Get available exams |
| POST | `/api/student/exams/{id}/start` | Start exam attempt |
| POST | `/api/student/attempts/{id}/save` | Save answer |
| POST | `/api/student/attempts/{id}/submit` | Submit exam |
| GET | `/api/student/attempts/{id}` | Get attempt details |

### Results
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/results` | Get all results (admin) |
| GET | `/api/results/{id}` | Get specific result |
| GET | `/api/student/results` | Get student results |
| GET | `/api/results/export/csv` | Export results to CSV |

---

## 📦 Installation Guide

### Prerequisites

| Tool | Minimum Version |
|------|-----------------|
| Node.js | v16 or higher |
| Python | 3.11 or higher |
| MySQL | 8.0 or higher |
| npm | 8 or higher |

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   venv\Scripts\activate  # Windows
   source venv/bin/activate  # Linux/Mac
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/exam_db
   SECRET_KEY=your-secret-key
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ```

5. **Initialize database**
   ```bash
   python -m app.core.database
   ```

6. **Start backend server**
   ```bash
   uvicorn app.main:app --reload
   ```

   Server runs at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file:
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   Application runs at `http://localhost:3000`

---

## 📂 Project Structure

```
online-exam-system/
├── backend/
│   ├── app/
│   │   ├── core/           # Core configurations
│   │   │   ├── config.py   # App settings
│   │   │   ├── security.py # Auth & security
│   │   │   └── database.py # DB connection
│   │   ├── models/         # Database models
│   │   │   ├── user.py
│   │   │   ├── exam.py
│   │   │   └── question.py
│   │   ├── routes/         # API endpoints
│   │   │   ├── auth.py
│   │   │   ├── exams.py
│   │   │   ├── questions.py
│   │   │   └── results.py
│   │   ├── services/       # Business logic
│   │   │   └── csv_service.py
│   │   └── main.py         # Application entry
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   │   ├── common/     # Shared UI components
│   │   │   ├── student/    # Student components
│   │   │   └── admin/      # Admin components
│   │   ├── pages/          # Page components
│   │   │   ├── student/
│   │   │   └── admin/
│   │   ├── context/        # React Context
│   │   ├── hooks/          # Custom hooks
│   │   ├── layouts/        # Layout wrappers
│   │   ├── services/       # API services
│   │   ├── utils/          # Utilities
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── README.md
└── .gitignore
```

---

## 🎯 Key Features Implementation

### Authentication System
- JWT token-based authentication
- Password hashing with bcrypt
- Role-based access control (RBAC)
- Protected routes with route guards
- Auto-redirect based on user role

### Exam Timer System
- Countdown timer with MM:SS format
- Visual warnings at 5 minutes and 1 minute
- Auto-submit when time reaches 0
- Persistent timer state across page refreshes

### Tab Switch Detection
- Uses `document.visibilitychange` event
- Tracks and limits tab switches (configurable limit)
- Shows warning modal on detection
- Auto-submits exam on exceeding limit

### Auto-Save Answers
- Immediate save on answer selection
- Visual feedback for saved state
- Handles network errors gracefully
- Offline support with sync capability

### CSV Export
- Server-side CSV generation
- Complete result data export
- Excel-compatible format
- Batch processing for large datasets

---

## 🔐 Security Features

| Feature | Implementation |
|---------|----------------|
| **Authentication** | JWT tokens with expiration |
| **Password Security** | Bcrypt hashing (12 rounds) |
| **Input Validation** | Pydantic models |
| **SQL Injection** | SQLAlchemy ORM with parameterized queries |
| **CORS** | Configured allowed origins |
| **XSS Prevention** | React's automatic escaping |
| **CSRF Protection** | Same-site cookie attributes |
| **Rate Limiting** | SlowAPI middleware |

---

## 📊 Use Cases

### 1. Educational Institutions
- Conducting periodic assessments
- Online quizzes and tests
- Entrance examinations
- Certification exams

### 2. Corporate Training
- Employee skill assessments
- Pre-training evaluations
- Compliance testing
- Knowledge certification

### 3. Competitive Exams
- Large-scale standardized tests
- Recruitment assessments
- Scholarship eligibility tests

---

## 🚀 Future Enhancements

| Priority | Feature | Description |
|----------|---------|-------------|
| High | **Proctoring Integration** | AI-powered live proctoring with webcam |
| High | **Question Bank** | Randomized question selection from pool |
| Medium | **Multiple Question Types** | Fill in blanks, matching, essay |
| Medium | **Analytics Dashboard** | Advanced performance analytics |
| Medium | **Multi-language Support** | Interface and content translation |
| Low | **Mobile App** | Native mobile application |
| Low | **Offline Mode** | PWA with offline capabilities |
| Low | **Peer Review** | Essay question evaluation by peers |

---

## 👥 Contributors

- **Anshit Puri** - Project Lead & Developer

---

## 📄 License

This project is licensed under the MIT License.

---

## 📞 Support

anshitpuri99@gmail.com
