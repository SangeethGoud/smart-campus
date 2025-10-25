# Smart Campus Backend

A comprehensive backend API for a Smart Campus management system built with Node.js, Express, and SQLite.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Announcements**: Campus-wide announcements management
- **Events**: Event creation, registration, and management
- **Clubs**: Club management and membership system
- **Resources**: File upload and resource management
- **Notifications**: User notification system
- **Feedback**: User feedback collection
- **Lost & Found**: Lost item reporting and tracking
- **Admin Panel**: User and system management

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Security**: Helmet, Rate Limiting, CORS
- **Documentation**: Markdown API docs

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## 🚀 Quick Start

### 1. Clone and Install
```bash
# Navigate to your project directory
cd smart-campus

# Install dependencies
npm install
```

### 2. Environment Setup
```bash
# Copy environment template
cp env.example .env

# Edit .env file with your configuration
# At minimum, change the JWT_SECRET
```

### 3. Start the Server
```bash
# Development mode with auto-restart
npm run dev

# Or production mode
npm start

# Or use the startup script
node start.js
```

### 4. Access the API
- **API Base URL**: `http://localhost:4000/api`
- **Health Check**: `http://localhost:4000/api/ping`

## 📚 API Documentation

Complete API documentation is available in `API_DOCUMENTATION.md`.

### Quick API Overview

| Endpoint | Description | Auth Required |
|----------|-------------|---------------|
| `/api/auth/*` | Authentication | No |
| `/api/announcements/*` | Announcements | Admin/Faculty for write |
| `/api/events/*` | Events | Admin/Faculty for write |
| `/api/clubs/*` | Clubs | Admin/Faculty for write |
| `/api/resources/*` | Resources | Admin/Faculty for write |
| `/api/notifications/*` | Notifications | Yes |
| `/api/feedback/*` | Feedback | No |
| `/api/lostfound/*` | Lost & Found | No |
| `/api/admin/*` | Admin functions | Admin only |

## 👥 Demo Users

The system comes with pre-configured demo users:

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| Admin | admin@klh.edu | admin123 | Full access |
| Faculty | faculty@klh.edu | faculty123 | Create content |
| Student | student@klh.edu | student123 | View and register |

## 🗄️ Database Schema

The system uses SQLite with the following main tables:

- **users**: User accounts and roles
- **announcements**: Campus announcements
- **events**: Events and registrations
- **clubs**: Clubs and memberships
- **resources**: File resources
- **notifications**: User notifications
- **feedback**: User feedback
- **lost_items**: Lost and found items

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Admin, Faculty, Student roles
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Helmet Security**: Security headers
- **Input Validation**: Request validation
- **CORS Protection**: Cross-origin request protection
- **SQL Injection Protection**: Parameterized queries

## 📁 Project Structure

```
smart-campus/
├── server.js                 # Main server file
├── server-db.js             # Database configuration
├── server-auth.js           # Authentication routes
├── server-admin.js          # Admin routes
├── server-feedback.js       # Feedback routes
├── server-lostfound.js      # Lost & Found routes
├── server-announcements.js  # Announcements API
├── server-events.js         # Events API
├── server-clubs.js          # Clubs API
├── server-resources.js      # Resources API
├── server-notifications.js  # Notifications API
├── middleware-auth.js       # Authentication middleware
├── utils-fileupload.js      # File upload utilities
├── data/
│   └── database.sqlite      # SQLite database
├── uploads/                 # File upload directory
├── package.json
├── env.example
├── API_DOCUMENTATION.md
└── README_BACKEND.md
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 4000 |
| `JWT_SECRET` | JWT signing secret | dev_secret |
| `CORS_ORIGIN` | CORS origin | true |
| `NODE_ENV` | Environment | development |

### Database Configuration

The database is automatically created and initialized on first run. Demo users are seeded automatically.

## 📤 File Upload

The system supports file uploads for resources:

- **Supported Types**: Images, Documents, Media, Archives
- **Max Size**: 10MB per file
- **Storage**: Local `uploads/` directory
- **Security**: File type validation

## 🧪 Testing the API

### Using curl

```bash
# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@klh.edu","password":"admin123"}'

# Get announcements
curl http://localhost:4000/api/announcements

# Create announcement (requires auth)
curl -X POST http://localhost:4000/api/announcements \
  -H "Content-Type: application/json" \
  -H "Cookie: sc_token=your_jwt_token" \
  -d '{"title":"Test","content":"Test content"}'
```

### Using Postman

1. Import the API collection (if available)
2. Set up environment variables
3. Start with login request
4. Use returned token for authenticated requests

## 🚀 Deployment

### Production Setup

1. **Environment Variables**:
   ```bash
   NODE_ENV=production
   JWT_SECRET=your_strong_secret_key
   PORT=4000
   ```

2. **Database**: SQLite file will be created automatically

3. **File Storage**: Ensure `uploads/` directory is writable

4. **Process Management**: Use PM2 or similar for production

### Docker Deployment (Optional)

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 4000
CMD ["npm", "start"]
```

## 🔍 Monitoring & Logging

- **Health Check**: `GET /api/ping`
- **Error Handling**: Comprehensive error responses
- **Rate Limiting**: Built-in request limiting
- **Security Headers**: Helmet middleware

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:

1. Check the API documentation
2. Review the error messages
3. Check the server logs
4. Create an issue with detailed information

## 🔄 Updates

To update the backend:

1. Pull latest changes
2. Run `npm install` for new dependencies
3. Restart the server
4. Check for any database migrations needed

---

**Happy Coding! 🎉**
