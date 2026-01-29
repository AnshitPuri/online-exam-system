# Online Examination System - Frontend

A modern, secure, and efficient React-based frontend for conducting online examinations with real-time monitoring and instant results.

## 🚀 Features

### Student Features
- **User Authentication**: Secure login and registration
- **Exam Dashboard**: View available published exams
- **Exam Instructions**: Clear instructions before starting
- **Live Exam Interface**: 
  - Real-time countdown timer
  - Question navigation
  - Auto-save answers
  - Tab switch detection and warning
  - Auto-submit on time expiry
- **Instant Results**: Detailed result analysis with correct answers
- **Results History**: View all past exam attempts

### Admin Features
- **Dashboard**: Overview statistics and recent submissions
- **Exam Management**: Create, edit, publish/unpublish exams
- **Question Bank**: Add, edit, and delete questions
- **Student Management**: View and manage student accounts
- **Results Analysis**: View and filter all exam results
- **Real-time Monitoring**: Track exam attempts and performance

## 🛠️ Tech Stack

- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **State Management**: Context API
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Icons**: Lucide React

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running on `http://localhost:8000`

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
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
   
   Edit `.env` and set your API base URL:
   ```
   VITE_API_BASE_URL=http://localhost:8000/api
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

## 📦 Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

## 🏗️ Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── assets/         # Images, fonts, etc.
│   ├── components/     # Reusable components
│   │   ├── common/     # Shared UI components
│   │   ├── student/    # Student-specific components
│   │   └── admin/      # Admin-specific components
│   ├── pages/          # Page components
│   │   ├── student/    # Student pages
│   │   └── admin/      # Admin pages
│   ├── context/        # React Context providers
│   ├── hooks/          # Custom React hooks
│   ├── layouts/        # Layout components
│   ├── services/       # API service layer
│   ├── utils/          # Utility functions and helpers
│   ├── App.jsx         # Main app component
│   ├── main.jsx        # Application entry point
│   └── index.css       # Global styles
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🎯 Key Features Implementation

### Authentication
- JWT token-based authentication
- Auto-redirect based on user role
- Protected routes with role-based access

### Exam Timer
- Countdown timer with MM:SS format
- Visual warnings at 5 minutes and 1 minute
- Auto-submit when time reaches 0
- Persistent timer state

### Tab Switch Detection
- Uses `document.visibilitychange` event
- Tracks and limits tab switches
- Shows warning modal on detection
- Auto-submits exam on exceeding limit

### Auto-Save Answers
- Immediate save on answer selection
- Visual feedback for saved state
- Handles network errors gracefully

### Responsive Design
- Mobile-first approach
- Works on all screen sizes
- Optimized for tablets and desktops

## 🔐 Security Features

- HTTP-only cookie support
- CSRF protection
- XSS prevention
- Input validation
- Secure password handling

## 🎨 UI Components

### Common Components
- `Button` - Reusable button with variants
- `Input` - Form input with validation
- `Card` - Content container
- `Modal` - Dialog/confirmation modals
- `Loader` - Loading spinner
- `Navbar` - Top navigation
- `Footer` - Page footer

### Student Components
- `ExamCard` - Exam information display
- `ExamTimer` - Live countdown timer
- `QuestionCard` - Question with options
- `ResultCard` - Result summary card

### Admin Components
- `ExamForm` - Create/edit exam form
- `QuestionForm` - Add question form
- `StudentList` - Student management table
- `ResultsTable` - Results display table

## 📡 API Integration

All API calls are handled through the `api.js` service layer with:
- Axios interceptors for auth tokens
- Centralized error handling
- Request/response transformation
- Loading state management

### Available API Services

```javascript
// Authentication
authAPI.register(data)
authAPI.login(data)
authAPI.logout()

// Student
studentAPI.getAvailableExams()
studentAPI.startExam(examId)
studentAPI.saveAnswer(attemptId, data)
studentAPI.submitExam(attemptId)
studentAPI.getResult(attemptId)

// Admin
adminAPI.getDashboardStats()
adminAPI.createExam(data)
adminAPI.getAllExams()
adminAPI.addQuestion(examId, data)
adminAPI.getAllStudents()
adminAPI.getAllResults()
```

## 🧪 Testing

```bash
# Run linter
npm run lint

# Build and preview
npm run build
npm run preview
```

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Error**
   - Check if backend is running
   - Verify API base URL in `.env`
   - Check CORS settings on backend

2. **Build Fails**
   - Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
   - Clear cache: `npm cache clean --force`

3. **Timer Not Working**
   - Check browser console for errors
   - Ensure JavaScript is enabled

4. **Tab Switch Not Detected**
   - Works only in production/real browser tabs
   - May not work in browser DevTools

## 📄 License

This project is licensed under the MIT License.

## 👥 Contributors

- Anshit Puri

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support, email support@example.com or create an issue in the repository.

## 🙏 Acknowledgments

- React Team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Lucide for the beautiful icons
- Vite for the fast build tool




venv\Scripts\activate
uvicorn app.main:app