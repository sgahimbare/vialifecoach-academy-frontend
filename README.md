# Vialifecoach GF Application Portal

A comprehensive full-stack application platform for managing program applications, built with React, Node.js, Express, and PostgreSQL.

## 🚀 Features

### **Frontend (React)**
- **Application Portal** - Browse and apply to programs
- **GF Application Portal** - Comprehensive 14-section application form
- **User Dashboard** - Track application status and progress
- **Admin Dashboard** - Review and manage applications
- **Authentication** - Secure login/registration with JWT
- **File Upload** - Support for documents and images
- **Responsive Design** - Works on all devices

### **Backend (Node.js/Express)**
- **RESTful API** - Complete CRUD operations
- **JWT Authentication** - Secure token-based auth
- **File Upload** - Multer for document handling
- **Database Integration** - PostgreSQL with optimized queries
- **Error Handling** - Comprehensive error responses
- **Email Notifications** - Ready for nodemailer integration

### **Database (PostgreSQL)**
- **User Management** - Accounts and roles
- **Application Data** - JSONB for flexible form storage
- **Document Storage** - File metadata and paths
- **Reviews & Status** - Application workflow tracking

## 📋 Application Sections

The GF Application Portal includes 14 comprehensive sections:

1. **Account Creation** - User registration and setup
2. **Personal Information** - Basic personal details
3. **Background Information** - Refugee status and circumstances
4. **Education History** - Academic background and achievements
5. **Work & Experience** - Professional and volunteer experience
6. **Activities & Achievements** - Leadership and community involvement
7. **Personal Statement** - 500-650 word essay
8. **Program Selection** - Choose specific programs
9. **Supporting Documents** - Upload CV, ID, certificates
10. **Recommendations** - Request and manage recommendations
11. **Eligibility Questions** - Pre-screening questions
12. **Application Review** - Complete review before submission
13. **Submission** - Final submission process
14. **Admin Dashboard** - Application management

## 🛠️ Tech Stack

### **Frontend**
- React 18
- TypeScript
- React Router
- Tailwind CSS
- Lucide Icons

### **Backend**
- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- Multer (File Upload)
- bcrypt (Password Hashing)

### **Database**
- PostgreSQL 14+
- JSONB for flexible data storage
- Optimized indexes
- Triggers for timestamps

## 📁 Project Structure

```
vialifecoach-frontend/
├── backend/                    # Backend API server
│   ├── routes/                # API route handlers
│   ├── middleware/            # Custom middleware
│   ├── uploads/              # File upload directory
│   ├── db.js                 # Database connection
│   ├── server.js             # Express server
│   └── package.json          # Backend dependencies
├── database/                  # Database schema
│   └── schema.sql            # PostgreSQL schema
├── src/
│   ├── pages/                # React page components
│   ├── services/             # API service layer
│   ├── hooks/                # Custom React hooks
│   ├── components/           # Reusable components
│   └── routes/               # Frontend routing
└── README.md                 # This file
```

## 🚀 Quick Start

### **Prerequisites**
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### **1. Database Setup**

```bash
# Create database
createdb vialifecoach

# Run schema
psql -d vialifecoach -f database/schema.sql
```

### **2. Backend Setup**

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your database credentials
# DB_HOST=localhost
# DB_NAME=vialifecoach
# DB_USER=postgres
# DB_PASSWORD=your_password

# Start server
npm start
```

Backend will run on `http://localhost:5000`

### **3. Frontend Setup**

```bash
# Install dependencies
npm install

# Start development server
npm start
```

Frontend will run on `http://localhost:3000`

## 🔗 API Endpoints

### **Authentication**
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user

### **Programs**
- `GET /programs` - Get all programs
- `GET /programs/:id` - Get single program

### **Applications**
- `POST /applications/apply` - Submit application
- `GET /applications/my` - Get user's applications
- `GET /applications/:id` - Get application details

### **Common Application**
- `POST /common/save` - Save application data
- `GET /common/me` - Get user's application
- `PUT /common/section/:section` - Update section

### **Admin**
- `GET /admin/applications` - Get all applications
- `PATCH /admin/status/:id` - Update application status
- `GET /admin/dashboard/stats` - Get dashboard stats

### **File Upload**
- `POST /upload/single` - Upload single file
- `POST /upload/multiple` - Upload multiple files
- `GET /upload/documents` - Get user documents

## 🎯 User Flow

### **For Applicants**
1. **Browse Programs** - View available programs on Application Portal
2. **Create Account** - Click "Create Account to Apply" to register
3. **Complete Application** - Fill out comprehensive 14-section form
4. **Upload Documents** - Add supporting documents
5. **Submit Application** - Review and submit
6. **Track Status** - Monitor application progress on dashboard

### **For Administrators**
1. **Login to Admin Dashboard** - Access admin panel
2. **Review Applications** - View and filter applications
3. **Update Status** - Change application status
4. **Download Data** - Export application data
5. **Manage Users** - View user accounts

## 🔧 Configuration

### **Environment Variables**

**Backend (.env)**
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=vialifecoach
DB_USER=postgres
DB_PASSWORD=password

# Server
PORT=5000

# JWT
JWT_SECRET=your-super-secret-jwt-key

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# File Upload
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760
```

### **Database Configuration**

The application uses PostgreSQL with the following main tables:

- `users` - User accounts and authentication
- `common_applications` - Application form data (JSONB)
- `programs` - Available programs
- `applications` - Submitted applications
- `supporting_documents` - File uploads
- `recommendations` - Recommendation requests
- `application_reviews` - Admin reviews

## 📝 Development Notes

### **Frontend Architecture**
- Component-based React with TypeScript
- Custom hooks for state management
- Service layer for API calls
- Responsive design with Tailwind CSS

### **Backend Architecture**
- Express.js REST API
- JWT authentication middleware
- File upload with Multer
- PostgreSQL with connection pooling
- Comprehensive error handling

### **Security Features**
- JWT token authentication
- Password hashing with bcrypt
- File type validation
- SQL injection protection
- CORS configuration

## 🚀 Deployment

### **Frontend (Vercel/Netlify)**
1. Build the application: `npm run build`
2. Deploy the `build` folder
3. Set environment variables for API URL

### **Backend (Heroku/Railway)**
1. Deploy the Node.js application
2. Configure PostgreSQL addon
3. Set environment variables
4. Ensure file storage is configured

### **Database (Railway/Supabase)**
1. Deploy PostgreSQL
2. Run schema migration
3. Configure connection string
4. Set up backups

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation
- Review the API endpoints
- Test with the provided examples
- Create an issue for bugs

## 🎉 Ready to Use!

Your Vialifecoach GF Application Portal is now ready with:
- ✅ Complete frontend application
- ✅ Full backend API
- ✅ Database schema
- ✅ Authentication system
- ✅ File upload capability
- ✅ Admin dashboard
- ✅ Comprehensive documentation

Start the development servers and begin accepting applications! 🚀
