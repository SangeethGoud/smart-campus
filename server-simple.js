const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
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

const app = express();
const PORT = process.env.PORT || 4000;

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

// Serve static frontend from project root
app.use(express.static(path.join(__dirname)));

// health
app.get('/api/ping', (req, res) => res.json({ ok: true }));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Smart Campus API running at http://localhost:${PORT}`);
  console.log(`Frontend available at http://localhost:${PORT}`);
  console.log(`Database initialized at ./data/database.sqlite`);
});
