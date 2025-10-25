const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
require('dotenv').config();

const db = require('./server-db');
const auth = require('./server-auth');
const admin = require('./server-admin');
const feedback = require('./server-feedback');
const lostfound = require('./server-lostfound');
const announcements = require('./server-announcements');
const events = require('./server-events');
const clubs = require('./server-clubs');
const resources = require('./server-resources');
const notifications = require('./server-notifications');
const requests = require('./server-requests');
const comments = require('./server-comments');

const app = express();
const PORT = process.env.PORT || 4000;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Compression middleware
app.use(compression());

// Middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(cors({
  origin: process.env.CORS_ORIGIN || true,
  credentials: true
}));

// Initialize DB (creates file and seed users)
db.init();

// API
app.use('/api/auth', auth);
app.use('/api/admin', admin);
app.use('/api/feedback', feedback);
app.use('/api/lostfound', lostfound);
app.use('/api/announcements', announcements);
app.use('/api/events', events);
app.use('/api/clubs', clubs);
app.use('/api/resources', resources);
app.use('/api/notifications', notifications);
app.use('/api/requests', requests);
app.use('/api/comments', comments);

// Serve static frontend from project root (optional)
app.use(express.static(path.join(__dirname)));

// health
app.get('/api/ping', (req, res) => res.json({ ok: true }));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Smart Campus API running at http://localhost:${PORT}`);
  console.log(`Open ${process.env.CORS_ORIGIN || 'your-frontend-url'} for frontend`);
});