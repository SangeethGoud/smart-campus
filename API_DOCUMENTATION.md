# Smart Campus Backend API Documentation

## Overview
This is a comprehensive backend API for a Smart Campus management system built with Node.js, Express, and SQLite.

## Base URL
```
http://localhost:4000/api
```

## Authentication
The API uses JWT tokens for authentication. Tokens are stored in HTTP-only cookies or can be sent in the Authorization header.

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "student@klh.edu",
  "password": "student123"
}
```

### Logout
```http
POST /api/auth/logout
```

### Get Current User
```http
GET /api/auth/me
```

## API Endpoints

### 1. Announcements API (`/api/announcements`)

#### Get All Announcements
```http
GET /api/announcements
```

#### Get Announcement by ID
```http
GET /api/announcements/:id
```

#### Create Announcement (Admin/Faculty Only)
```http
POST /api/announcements
Content-Type: application/json

{
  "title": "Important Notice",
  "content": "Campus will be closed on Monday",
  "priority": "high",
  "category": "general"
}
```

#### Update Announcement (Admin/Faculty Only)
```http
PUT /api/announcements/:id
Content-Type: application/json

{
  "title": "Updated Notice",
  "content": "Updated content",
  "priority": "normal",
  "category": "academic"
}
```

#### Delete Announcement (Admin Only)
```http
DELETE /api/announcements/:id
```

### 2. Events API (`/api/events`)

#### Get All Events
```http
GET /api/events
```

#### Get Event by ID
```http
GET /api/events/:id
```

#### Create Event (Admin/Faculty Only)
```http
POST /api/events
Content-Type: application/json

{
  "title": "Tech Workshop",
  "description": "Learn about new technologies",
  "start_date": "2024-01-15T10:00:00Z",
  "end_date": "2024-01-15T16:00:00Z",
  "location": "Main Hall",
  "category": "workshop",
  "max_attendees": 50
}
```

#### Register for Event
```http
POST /api/events/:id/register
```

#### Get Event Registrations (Admin/Faculty Only)
```http
GET /api/events/:id/registrations
```

#### Update Event (Admin/Faculty Only)
```http
PUT /api/events/:id
```

#### Delete Event (Admin Only)
```http
DELETE /api/events/:id
```

### 3. Clubs API (`/api/clubs`)

#### Get All Clubs
```http
GET /api/clubs
```

#### Get Club by ID
```http
GET /api/clubs/:id
```

#### Create Club (Admin/Faculty Only)
```http
POST /api/clubs
Content-Type: application/json

{
  "name": "Tech Club",
  "description": "Technology enthusiasts club",
  "category": "technology",
  "president_id": 1
}
```

#### Join Club
```http
POST /api/clubs/:id/join
```

#### Leave Club
```http
DELETE /api/clubs/:id/leave
```

#### Get Club Members (Admin/Faculty Only)
```http
GET /api/clubs/:id/members
```

#### Get User's Clubs
```http
GET /api/clubs/user/my-clubs
```

#### Update Club (Admin/Faculty Only)
```http
PUT /api/clubs/:id
```

#### Delete Club (Admin Only)
```http
DELETE /api/clubs/:id
```

### 4. Resources API (`/api/resources`)

#### Get All Resources
```http
GET /api/resources
```

#### Get Resource by ID
```http
GET /api/resources/:id
```

#### Create Resource (Admin/Faculty Only)
```http
POST /api/resources
Content-Type: application/json

{
  "title": "Study Guide",
  "description": "Comprehensive study guide for exams",
  "category": "academic",
  "file_url": "/uploads/study-guide.pdf",
  "file_type": "application/pdf",
  "file_size": 1024000
}
```

#### Download Resource
```http
POST /api/resources/:id/download
```

#### Get Resources by Category
```http
GET /api/resources/category/:category
```

#### Search Resources
```http
GET /api/resources/search/:query
```

#### Update Resource (Admin/Faculty Only)
```http
PUT /api/resources/:id
```

#### Delete Resource (Admin Only)
```http
DELETE /api/resources/:id
```

### 5. Notifications API (`/api/notifications`)

#### Get User's Notifications
```http
GET /api/notifications
```

#### Get Unread Count
```http
GET /api/notifications/unread-count
```

#### Mark Notification as Read
```http
PUT /api/notifications/:id/read
```

#### Mark All as Read
```http
PUT /api/notifications/mark-all-read
```

#### Delete Notification
```http
DELETE /api/notifications/:id
```

#### Create Notification (Admin/Faculty Only)
```http
POST /api/notifications
Content-Type: application/json

{
  "title": "New Event",
  "message": "A new event has been scheduled",
  "type": "info",
  "target_users": [1, 2, 3]
}
```

#### Get Notification by ID
```http
GET /api/notifications/:id
```

### 6. Feedback API (`/api/feedback`)

#### Submit Feedback
```http
POST /api/feedback
Content-Type: application/json

{
  "category": "general",
  "message": "Great campus facilities!"
}
```

#### Get All Feedback (Admin Only)
```http
GET /api/feedback
```

### 7. Lost & Found API (`/api/lostfound`)

#### Report Lost Item
```http
POST /api/lostfound/report
Content-Type: application/json

{
  "item": "iPhone 12",
  "location": "Library",
  "description": "Black iPhone with cracked screen"
}
```

#### Get All Lost Items
```http
GET /api/lostfound/list
```

### 8. Admin API (`/api/admin`)

#### Get All Users (Admin Only)
```http
GET /api/admin/users
```

#### Create User (Admin Only)
```http
POST /api/admin/users
Content-Type: application/json

{
  "email": "newuser@klh.edu",
  "password": "password123",
  "role": "student",
  "name": "New User"
}
```

#### Update User Role (Admin Only)
```http
PUT /api/admin/users/:id/role
Content-Type: application/json

{
  "role": "faculty"
}
```

## Response Format

### Success Response
```json
{
  "ok": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "error": "Error message",
  "detail": "Additional error details"
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## User Roles

- `admin` - Full access to all features
- `faculty` - Can create announcements, events, clubs, resources, and notifications
- `student` - Can view content and register for events/clubs

## Database Schema

### Users Table
- id, email, password, role, name, created_at

### Announcements Table
- id, title, content, priority, category, author_id, created_at, updated_at

### Events Table
- id, title, description, start_date, end_date, location, category, max_attendees, organizer_id, created_at, updated_at

### Event Registrations Table
- id, event_id, user_id, registered_at

### Clubs Table
- id, name, description, category, president_id, created_at, updated_at

### Club Memberships Table
- id, club_id, user_id, joined_at

### Resources Table
- id, title, description, category, file_url, file_type, file_size, download_count, uploader_id, created_at, updated_at

### Notifications Table
- id, user_id, title, message, type, is_read, created_at, read_at

### Feedback Table
- id, user_id, email, category, message, created_at

### Lost Items Table
- id, item, location, description, status, reporter_email, created_at

## Security Features

- JWT token authentication
- Role-based access control
- Rate limiting (100 requests per 15 minutes)
- Helmet security headers
- Input validation
- SQL injection protection
- CORS configuration

## File Upload

The API supports file uploads for resources. Files are stored in the `uploads/` directory with unique filenames.

Supported file types:
- Images: jpeg, jpg, png, gif, bmp, webp
- Documents: pdf, doc, docx, txt, rtf
- Media: mp4, mp3
- Archives: zip

Maximum file size: 10MB

## Environment Variables

Create a `.env` file with the following variables:

```
PORT=4000
JWT_SECRET=your_secret_key
CORS_ORIGIN=http://localhost:3000
NODE_ENV=development
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file from `env.example`

3. Start the server:
```bash
npm start
# or for development
npm run dev
```

4. The API will be available at `http://localhost:4000`

## Demo Users

The system comes with pre-configured demo users:

- **Admin**: admin@klh.edu / admin123
- **Faculty**: faculty@klh.edu / faculty123  
- **Student**: student@klh.edu / student123
